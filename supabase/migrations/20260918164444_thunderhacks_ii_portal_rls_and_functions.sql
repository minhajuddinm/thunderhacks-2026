-- ---------------------------------------------------------------- RLS ------
alter table public.event_settings enable row level security;
alter table public.profiles       enable row level security;
alter table public.teams          enable row level security;
alter table public.team_members   enable row level security;
alter table public.team_requests  enable row level security;

-- Read-only policies. No write policies anywhere on purpose: every mutation
-- goes through a SECURITY DEFINER function below, which is where the rules live.
create policy event_settings_read on public.event_settings
  for select to anon, authenticated using (true);

create policy profiles_read on public.profiles
  for select to authenticated using (true);

create policy teams_read on public.teams
  for select to authenticated using (true);

create policy team_members_read on public.team_members
  for select to authenticated using (true);

-- A request thread is visible to the person it concerns and to the team leader.
create policy team_requests_read on public.team_requests
  for select to authenticated using (
    profile_id = (select auth.uid())
    or exists (
      select 1 from public.teams t
      where t.id = team_requests.team_id and t.leader_id = (select auth.uid())
    )
  );

-- ---------------------------------------------------------- helper: gate ----
create function public.registration_is_open()
returns boolean
language sql stable security definer set search_path = public, pg_temp
as $$ select now() >= s.registration_opens_at from public.event_settings s where s.id $$;

-- ------------------------------------------------------ complete signup ----
create function public.complete_registration(
  p_full_name text,
  p_program   text,
  p_year      smallint,
  p_school    public.school_choice
) returns public.profiles
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid uuid := (select auth.uid());
  v_row public.profiles;
begin
  if v_uid is null then
    raise exception 'You must be signed in to register.' using errcode = '42501';
  end if;
  if not public.registration_is_open() then
    raise exception 'Registration has not opened yet.' using errcode = 'P0001';
  end if;

  insert into public.profiles (id, full_name, program, year_of_study, school)
  values (v_uid, btrim(p_full_name), btrim(p_program), p_year, p_school)
  on conflict (id) do update set
    full_name     = excluded.full_name,
    program       = excluded.program,
    year_of_study = excluded.year_of_study,
    school        = excluded.school
  returning * into v_row;

  return v_row;
end $$;

-- ------------------------------------------------------------ create team --
create function public.create_team(p_name text)
returns public.teams
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid  uuid := (select auth.uid());
  v_team public.teams;
begin
  if v_uid is null then
    raise exception 'You must be signed in.' using errcode = '42501';
  end if;
  if not exists (select 1 from public.profiles where id = v_uid) then
    raise exception 'Complete your registration first.' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.team_members where profile_id = v_uid) then
    raise exception 'You are already in a team. Leave it before creating another.' using errcode = 'P0001';
  end if;

  begin
    insert into public.teams (name, leader_id) values (btrim(p_name), v_uid)
    returning * into v_team;
  exception when unique_violation then
    raise exception 'A team with that name already exists.' using errcode = 'P0001';
  end;

  insert into public.team_members (team_id, profile_id) values (v_team.id, v_uid);

  update public.team_requests set status = 'cancelled', responded_at = now()
   where profile_id = v_uid and status = 'pending';

  return v_team;
end $$;

-- --------------------------------------------------------- ask to join -----
create function public.request_to_join(p_team_id uuid)
returns public.team_requests
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid uuid := (select auth.uid());
  v_max smallint;
  v_cnt int;
  v_row public.team_requests;
begin
  if v_uid is null then
    raise exception 'You must be signed in.' using errcode = '42501';
  end if;
  if not exists (select 1 from public.profiles where id = v_uid) then
    raise exception 'Complete your registration first.' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.team_members where profile_id = v_uid) then
    raise exception 'You are already in a team.' using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.teams where id = p_team_id) then
    raise exception 'That team no longer exists.' using errcode = 'P0001';
  end if;

  select max_team_size into v_max from public.event_settings where id;
  select count(*) into v_cnt from public.team_members where team_id = p_team_id;
  if v_cnt >= v_max then
    raise exception 'That team is already full.' using errcode = 'P0001';
  end if;

  begin
    insert into public.team_requests (team_id, profile_id, kind)
    values (p_team_id, v_uid, 'request')
    returning * into v_row;
  exception when unique_violation then
    raise exception 'You already have a pending request with that team.' using errcode = 'P0001';
  end;

  return v_row;
end $$;

-- ------------------------------------------------------------- invite ------
create function public.invite_to_team(p_profile_id uuid)
returns public.team_requests
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid  uuid := (select auth.uid());
  v_team uuid;
  v_max  smallint;
  v_cnt  int;
  v_row  public.team_requests;
begin
  if v_uid is null then
    raise exception 'You must be signed in.' using errcode = '42501';
  end if;

  select id into v_team from public.teams where leader_id = v_uid;
  if v_team is null then
    raise exception 'Only a team leader can invite people.' using errcode = 'P0001';
  end if;
  if p_profile_id = v_uid then
    raise exception 'You are already in your own team.' using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.profiles where id = p_profile_id) then
    raise exception 'That person has not registered.' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.team_members where profile_id = p_profile_id) then
    raise exception 'That person is already in a team.' using errcode = 'P0001';
  end if;

  select max_team_size into v_max from public.event_settings where id;
  select count(*) into v_cnt from public.team_members where team_id = v_team;
  if v_cnt >= v_max then
    raise exception 'Your team is already full.' using errcode = 'P0001';
  end if;

  begin
    insert into public.team_requests (team_id, profile_id, kind)
    values (v_team, p_profile_id, 'invite')
    returning * into v_row;
  exception when unique_violation then
    raise exception 'There is already a pending thread with that person.' using errcode = 'P0001';
  end;

  return v_row;
end $$;

-- ------------------------------------------------- accept / decline --------
create function public.respond_to_request(p_request_id uuid, p_accept boolean)
returns public.team_requests
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid    uuid := (select auth.uid());
  v_req    public.team_requests;
  v_leader uuid;
  v_max    smallint;
  v_cnt    int;
begin
  if v_uid is null then
    raise exception 'You must be signed in.' using errcode = '42501';
  end if;

  -- Lock the thread so two taps cannot both add a fifth member.
  select * into v_req from public.team_requests where id = p_request_id for update;
  if v_req.id is null then
    raise exception 'That request no longer exists.' using errcode = 'P0001';
  end if;
  if v_req.status <> 'pending' then
    raise exception 'That request has already been answered.' using errcode = 'P0001';
  end if;

  select leader_id into v_leader from public.teams where id = v_req.team_id;

  if v_req.kind = 'request' and v_leader <> v_uid then
    raise exception 'Only the team leader can answer join requests.' using errcode = '42501';
  end if;
  if v_req.kind = 'invite' and v_req.profile_id <> v_uid then
    raise exception 'Only the invited person can answer an invite.' using errcode = '42501';
  end if;

  if not p_accept then
    update public.team_requests set status = 'declined', responded_at = now()
     where id = p_request_id returning * into v_req;
    return v_req;
  end if;

  if exists (select 1 from public.team_members where profile_id = v_req.profile_id) then
    raise exception 'That person has already joined a team.' using errcode = 'P0001';
  end if;

  select max_team_size into v_max from public.event_settings where id;
  select count(*) into v_cnt from public.team_members where team_id = v_req.team_id;
  if v_cnt >= v_max then
    raise exception 'That team is already full.' using errcode = 'P0001';
  end if;

  insert into public.team_members (team_id, profile_id) values (v_req.team_id, v_req.profile_id);

  update public.team_requests set status = 'accepted', responded_at = now()
   where id = p_request_id returning * into v_req;

  -- Every other live thread for that person is moot now.
  update public.team_requests set status = 'cancelled', responded_at = now()
   where profile_id = v_req.profile_id and status = 'pending';

  return v_req;
end $$;

-- ------------------------------------------------------------ withdraw -----
create function public.cancel_request(p_request_id uuid)
returns public.team_requests
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid uuid := (select auth.uid());
  v_req public.team_requests;
  v_leader uuid;
begin
  select * into v_req from public.team_requests where id = p_request_id;
  if v_req.id is null or v_req.status <> 'pending' then
    raise exception 'Nothing to withdraw.' using errcode = 'P0001';
  end if;
  select leader_id into v_leader from public.teams where id = v_req.team_id;

  -- You can withdraw what you sent: your own request, or your team's invite.
  if not ((v_req.kind = 'request' and v_req.profile_id = v_uid)
       or (v_req.kind = 'invite'  and v_leader = v_uid)) then
    raise exception 'That is not yours to withdraw.' using errcode = '42501';
  end if;

  update public.team_requests set status = 'cancelled', responded_at = now()
   where id = p_request_id returning * into v_req;
  return v_req;
end $$;

-- ---------------------------------------------------------- leave team -----
create function public.leave_team()
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid  uuid := (select auth.uid());
  v_team uuid;
  v_leader uuid;
  v_next uuid;
begin
  select team_id into v_team from public.team_members where profile_id = v_uid;
  if v_team is null then
    raise exception 'You are not in a team.' using errcode = 'P0001';
  end if;

  select leader_id into v_leader from public.teams where id = v_team;

  if v_leader = v_uid then
    select profile_id into v_next from public.team_members
     where team_id = v_team and profile_id <> v_uid
     order by joined_at asc limit 1;

    if v_next is null then
      -- Last one out disbands the team; members and threads cascade.
      delete from public.teams where id = v_team;
      return;
    end if;

    update public.teams set leader_id = v_next where id = v_team;
  end if;

  delete from public.team_members where team_id = v_team and profile_id = v_uid;
end $$;

-- ------------------------------------------------------------- grants ------
revoke execute on function public.complete_registration(text, text, smallint, public.school_choice) from public;
revoke execute on function public.create_team(text)            from public;
revoke execute on function public.request_to_join(uuid)        from public;
revoke execute on function public.invite_to_team(uuid)         from public;
revoke execute on function public.respond_to_request(uuid, boolean) from public;
revoke execute on function public.cancel_request(uuid)         from public;
revoke execute on function public.leave_team()                 from public;

grant execute on function public.complete_registration(text, text, smallint, public.school_choice) to authenticated;
grant execute on function public.create_team(text)             to authenticated;
grant execute on function public.request_to_join(uuid)         to authenticated;
grant execute on function public.invite_to_team(uuid)          to authenticated;
grant execute on function public.respond_to_request(uuid, boolean) to authenticated;
grant execute on function public.cancel_request(uuid)          to authenticated;
grant execute on function public.leave_team()                  to authenticated;
grant execute on function public.registration_is_open()        to anon, authenticated;
