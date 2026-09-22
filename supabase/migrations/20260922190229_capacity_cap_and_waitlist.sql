-- A cap on how many people hold a spot, with everyone after that on a
-- waitlist. Admins run the event, so they never count against the cap.
alter table public.event_settings
  add column if not exists capacity smallint not null default 65;

alter table public.profiles
  add column if not exists status text not null default 'confirmed';

alter table public.profiles drop constraint if exists profiles_status_valid;
alter table public.profiles add constraint profiles_status_valid
  check (status in ('confirmed', 'waitlist'));

-- ------------------------------------------------------------ counts ----
create or replace function public.confirmed_count()
returns integer
language sql stable security definer set search_path = public, pg_temp
as $$
  select count(*)::int
  from public.profiles p
  where p.status = 'confirmed'
    and not exists (select 1 from public.admins a where a.user_id = p.id)
$$;

-- What the signup page needs before anyone signs in.
create or replace function public.capacity_state()
returns table (capacity integer, taken integer, spots_left integer, is_full boolean)
language sql stable security definer set search_path = public, pg_temp
as $$
  select s.capacity::int,
         public.confirmed_count(),
         greatest(s.capacity::int - public.confirmed_count(), 0),
         public.confirmed_count() >= s.capacity::int
  from public.event_settings s
  where s.id
$$;

revoke execute on function public.confirmed_count() from public;
grant  execute on function public.confirmed_count() to anon, authenticated;
revoke execute on function public.capacity_state() from public;
grant  execute on function public.capacity_state() to anon, authenticated;

-- ------------------------------------------------------ registration ----
create or replace function public.complete_registration(
  p_full_name     text,
  p_program       text,
  p_year          smallint,
  p_school        public.school_choice,
  p_school_other  text    default null,
  p_campus        text    default null,
  p_media_consent boolean default null
) returns public.profiles
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid      uuid := (select auth.uid());
  v_other    text := nullif(btrim(coalesce(p_school_other, '')), '');
  v_campus   text := nullif(btrim(coalesce(p_campus, '')), '');
  v_capacity int;
  v_status   text;
  v_row      public.profiles;
begin
  if v_uid is null then
    raise exception 'You must be signed in to register.' using errcode = '42501';
  end if;
  if not public.registration_is_open() then
    raise exception 'Registration has not opened yet.' using errcode = 'P0001';
  end if;

  if p_school = 'other' then
    if not (select allow_other_schools from public.event_settings where id) then
      raise exception 'ThunderHacks II is open to Algoma University and Sault College students for now.' using errcode = 'P0001';
    end if;
    if v_other is null then
      raise exception 'Tell us which school you are at.' using errcode = 'P0001';
    end if;
  else
    v_other := null;
  end if;

  if v_campus is not null and v_campus not in ('brampton', 'sault_ste_marie') then
    raise exception 'Choose the campus you will attend.' using errcode = 'P0001';
  end if;
  if p_school = 'sault_college' and v_campus = 'brampton' then
    raise exception 'Sault College students attend the Sault Ste. Marie campus.' using errcode = 'P0001';
  end if;
  if p_media_consent is false then
    raise exception 'You need to agree to photos and video to take part.' using errcode = 'P0001';
  end if;

  -- Hold the settings row so two people signing up at the same moment cannot
  -- both take the last spot.
  select capacity into v_capacity from public.event_settings where id for update;

  select status into v_status from public.profiles where id = v_uid;
  if v_status is null then
    v_status := case
      when public.is_admin() then 'confirmed'
      when public.confirmed_count() >= v_capacity then 'waitlist'
      else 'confirmed'
    end;
  end if;

  insert into public.profiles (id, full_name, program, year_of_study, school, school_other, campus, media_consent_at, status)
  values (v_uid, btrim(p_full_name), btrim(p_program), p_year, p_school, v_other, v_campus,
          case when p_media_consent then now() end, v_status)
  on conflict (id) do update set
    full_name        = excluded.full_name,
    program          = excluded.program,
    year_of_study    = excluded.year_of_study,
    school           = excluded.school,
    school_other     = excluded.school_other,
    campus           = coalesce(excluded.campus, public.profiles.campus),
    media_consent_at = coalesce(public.profiles.media_consent_at, excluded.media_consent_at)
  returning * into v_row;

  return v_row;
end $$;

revoke execute on function public.complete_registration(text, text, smallint, public.school_choice, text, text, boolean) from public, anon;
grant  execute on function public.complete_registration(text, text, smallint, public.school_choice, text, text, boolean) to authenticated;

-- ------------------------------------------------------------- teams ----
-- A spot on the waitlist is not a place at the event, so no team building
-- until an admin confirms it.
create or replace function public.create_team(p_name text)
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
  if exists (select 1 from public.profiles where id = v_uid and status = 'waitlist') then
    raise exception 'You are on the waitlist. You can make a team once a spot opens up.' using errcode = 'P0001';
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

create or replace function public.request_to_join(p_team_id uuid)
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
  if exists (select 1 from public.profiles where id = v_uid and status = 'waitlist') then
    raise exception 'You are on the waitlist. You can join a team once a spot opens up.' using errcode = 'P0001';
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

create or replace function public.invite_to_team(p_profile_id uuid)
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
  if exists (select 1 from public.profiles where id = p_profile_id and status = 'waitlist') then
    raise exception 'That person is on the waitlist and cannot join a team yet.' using errcode = 'P0001';
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

create or replace function public.respond_to_request(p_request_id uuid, p_accept boolean)
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

  if exists (select 1 from public.profiles where id = v_req.profile_id and status = 'waitlist') then
    raise exception 'That person is on the waitlist and cannot join a team yet.' using errcode = 'P0001';
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

-- ------------------------------------------------------------- admin ----
drop function if exists public.admin_list_participants();
create function public.admin_list_participants()
returns table (
  id uuid, full_name text, email text, program text, year_of_study smallint,
  school text, school_other text, campus text, media_consent_at timestamptz,
  status text, is_admin boolean,
  team_id uuid, team_name text, is_leader boolean, registered_at timestamptz
)
language plpgsql stable security definer set search_path = public, auth, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  return query
  select p.id, p.full_name, u.email::text, p.program, p.year_of_study,
         p.school::text, p.school_other, p.campus, p.media_consent_at,
         p.status, exists (select 1 from public.admins a where a.user_id = p.id),
         t.id, t.name, coalesce(t.leader_id = p.id, false), p.created_at
  from public.profiles p
  join auth.users u on u.id = p.id
  left join public.team_members tm on tm.profile_id = p.id
  left join public.teams t on t.id = tm.team_id
  order by p.created_at;
end $$;

create or replace function public.admin_set_status(p_profile_id uuid, p_status text)
returns public.profiles
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_row public.profiles;
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  if p_status not in ('confirmed', 'waitlist') then
    raise exception 'Unknown status.' using errcode = 'P0001';
  end if;

  -- Moving someone back to the waitlist takes them out of any team, the same
  -- as leaving one, so a team is never holding a spot for someone without one.
  if p_status = 'waitlist' then
    update public.team_requests set status = 'cancelled', responded_at = now()
     where profile_id = p_profile_id and status = 'pending';
    delete from public.teams t
     where t.leader_id = p_profile_id
       and not exists (select 1 from public.team_members m
                        where m.team_id = t.id and m.profile_id <> p_profile_id);
    update public.teams t
       set leader_id = (select m.profile_id from public.team_members m
                         where m.team_id = t.id and m.profile_id <> p_profile_id
                         order by m.joined_at limit 1)
     where t.leader_id = p_profile_id;
    delete from public.team_members where profile_id = p_profile_id;
  end if;

  update public.profiles set status = p_status where id = p_profile_id
  returning * into v_row;
  if v_row.id is null then
    raise exception 'That participant no longer exists.' using errcode = 'P0001';
  end if;
  return v_row;
end $$;

create or replace function public.admin_set_capacity(p_capacity integer)
returns integer
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  if p_capacity is null or p_capacity < 1 or p_capacity > 2000 then
    raise exception 'Pick a cap between 1 and 2000.' using errcode = 'P0001';
  end if;
  update public.event_settings set capacity = p_capacity where id;
  return p_capacity;
end $$;

revoke execute on function public.admin_list_participants() from public, anon;
grant  execute on function public.admin_list_participants() to authenticated;
revoke execute on function public.admin_set_status(uuid, text) from public, anon;
grant  execute on function public.admin_set_status(uuid, text) to authenticated;
revoke execute on function public.admin_set_capacity(integer) from public, anon;
grant  execute on function public.admin_set_capacity(integer) to authenticated;

-- ------------------------------------------------ participants view ----
drop view if exists public.participants;
create view public.participants with (security_invoker = true) as
select p.id, p.full_name, p.program, p.year_of_study, p.school, p.school_other,
       p.campus, p.status, p.created_at, tm.team_id, t.name as team_name
from public.profiles p
left join public.team_members tm on tm.profile_id = p.id
left join public.teams t on t.id = tm.team_id;
grant select on public.participants to authenticated;
revoke all on public.participants from anon;
revoke insert, update, delete, truncate, references, trigger on public.participants from authenticated;
