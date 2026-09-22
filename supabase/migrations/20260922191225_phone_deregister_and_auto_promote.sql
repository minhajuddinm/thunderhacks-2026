-- A phone number for everyone, a way to give up a spot without emailing us,
-- and the waitlist moving up on its own whenever a spot frees.
alter table public.profiles add column if not exists phone text;

-- Ten digits for a Canadian or US number, or + and 8 to 15 digits for anyone
-- with a number from somewhere else.
create or replace function public.normalize_phone(p_phone text)
returns text
language plpgsql immutable
as $$
declare v text := btrim(coalesce(p_phone, '')); v_digits text;
begin
  if v = '' then return null; end if;
  if left(v, 1) = '+' then
    v_digits := regexp_replace(v, '[^0-9]', '', 'g');
    if length(v_digits) between 8 and 15 then return '+' || v_digits; end if;
    raise exception 'That phone number does not look right.' using errcode = 'P0001';
  end if;
  v_digits := regexp_replace(v, '[^0-9]', '', 'g');
  if length(v_digits) = 11 and left(v_digits, 1) = '1' then
    v_digits := right(v_digits, 10);
  end if;
  if length(v_digits) = 10 then return v_digits; end if;
  raise exception 'Enter a 10 digit phone number, or + and the country code.' using errcode = 'P0001';
end $$;

alter table public.profiles drop constraint if exists profiles_phone_valid;
alter table public.profiles add constraint profiles_phone_valid
  check (phone is null or phone ~ '^[0-9]{10}$' or phone ~ '^\+[0-9]{8,15}$');

revoke execute on function public.normalize_phone(text) from public;
grant  execute on function public.normalize_phone(text) to authenticated;

-- ------------------------------------------------ waitlist moves up ----
-- Called whenever a spot frees or the cap goes up. Longest wait first.
create or replace function public.promote_from_waitlist()
returns integer
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_capacity int; v_moved int := 0; v_id uuid;
begin
  select capacity into v_capacity from public.event_settings where id for update;
  loop
    exit when public.confirmed_count() >= v_capacity;
    select p.id into v_id
      from public.profiles p
     where p.status = 'waitlist'
     order by p.created_at
     limit 1;
    exit when v_id is null;
    update public.profiles set status = 'confirmed' where id = v_id;
    v_moved := v_moved + 1;
  end loop;
  return v_moved;
end $$;

revoke execute on function public.promote_from_waitlist() from public, anon, authenticated;

-- ------------------------------------------------------ registration ----
create or replace function public.complete_registration(
  p_full_name     text,
  p_program       text,
  p_year          smallint,
  p_school        public.school_choice,
  p_school_other  text    default null,
  p_campus        text    default null,
  p_media_consent boolean default null,
  p_phone         text    default null
) returns public.profiles
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid      uuid := (select auth.uid());
  v_other    text := nullif(btrim(coalesce(p_school_other, '')), '');
  v_campus   text := nullif(btrim(coalesce(p_campus, '')), '');
  v_phone    text := public.normalize_phone(p_phone);
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

  insert into public.profiles (id, full_name, program, year_of_study, school, school_other, campus, media_consent_at, status, phone)
  values (v_uid, btrim(p_full_name), btrim(p_program), p_year, p_school, v_other, v_campus,
          case when p_media_consent then now() end, v_status, v_phone)
  on conflict (id) do update set
    full_name        = excluded.full_name,
    program          = excluded.program,
    year_of_study    = excluded.year_of_study,
    school           = excluded.school,
    school_other     = excluded.school_other,
    campus           = coalesce(excluded.campus, public.profiles.campus),
    media_consent_at = coalesce(public.profiles.media_consent_at, excluded.media_consent_at),
    phone            = coalesce(excluded.phone, public.profiles.phone)
  returning * into v_row;

  return v_row;
end $$;

revoke execute on function public.complete_registration(text, text, smallint, public.school_choice, text, text, boolean, text) from public, anon;
grant  execute on function public.complete_registration(text, text, smallint, public.school_choice, text, text, boolean, text) to authenticated;

-- -------------------------------- the short form for existing people ----
create or replace function public.complete_event_details(
  p_campus text,
  p_media_consent boolean,
  p_phone text default null
) returns public.profiles
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid uuid := (select auth.uid());
  v_school public.school_choice;
  v_phone text := public.normalize_phone(p_phone);
  v_row public.profiles;
begin
  if v_uid is null then
    raise exception 'You must be signed in.' using errcode = '42501';
  end if;
  select school into v_school from public.profiles where id = v_uid;
  if v_school is null then
    raise exception 'Complete your registration first.' using errcode = 'P0001';
  end if;
  if p_campus is null or p_campus not in ('brampton', 'sault_ste_marie') then
    raise exception 'Choose the campus you will attend.' using errcode = 'P0001';
  end if;
  if v_school = 'sault_college' and p_campus <> 'sault_ste_marie' then
    raise exception 'Sault College students attend the Sault Ste. Marie campus.' using errcode = 'P0001';
  end if;
  if coalesce(p_media_consent, false) is not true then
    raise exception 'You need to agree to photos and video to take part.' using errcode = 'P0001';
  end if;
  update public.profiles
     set campus = p_campus,
         media_consent_at = coalesce(media_consent_at, now()),
         phone = coalesce(v_phone, phone)
   where id = v_uid
  returning * into v_row;
  return v_row;
end $$;
revoke execute on function public.complete_event_details(text, boolean, text) from public, anon;
grant  execute on function public.complete_event_details(text, boolean, text) to authenticated;

-- -------------------------------------------------------- deregister ----
-- Someone giving up their own spot. Same as an admin removal, except they
-- are doing it themselves, and the waitlist moves up straight away.
create or replace function public.deregister(p_reason text default null)
returns void
language plpgsql security definer set search_path = public, auth, pg_temp
as $$
declare v_me uuid := (select auth.uid()); v_team uuid; v_leader uuid; v_next uuid;
begin
  if v_me is null then
    raise exception 'You must be signed in.' using errcode = '42501';
  end if;
  if public.is_admin() then
    raise exception 'Admin accounts cannot be deleted here.' using errcode = 'P0001';
  end if;

  insert into public.removed_participants
    (full_name, email, program, year_of_study, school, school_other, team_name, registered_at, removed_by, reason)
  select p.full_name, u.email, p.program, p.year_of_study, p.school::text, p.school_other,
         (select t.name from public.team_members tm join public.teams t on t.id = tm.team_id where tm.profile_id = u.id),
         coalesce(p.created_at, u.created_at),
         u.email,
         coalesce(nullif(btrim(coalesce(p_reason, '')), ''), 'Left on their own')
  from auth.users u left join public.profiles p on p.id = u.id
  where u.id = v_me;

  select team_id into v_team from public.team_members where profile_id = v_me;
  if v_team is not null then
    select leader_id into v_leader from public.teams where id = v_team;
    if v_leader = v_me then
      select profile_id into v_next from public.team_members
       where team_id = v_team and profile_id <> v_me
       order by joined_at limit 1;
      if v_next is null then
        delete from public.teams where id = v_team;
      else
        update public.teams set leader_id = v_next where id = v_team;
      end if;
    end if;
  end if;

  delete from auth.users where id = v_me;

  perform public.promote_from_waitlist();
end $$;

revoke execute on function public.deregister(text) from public, anon;
grant  execute on function public.deregister(text) to authenticated;

-- ------------------------------------------------------------- admin ----
create or replace function public.admin_remove_participant(p_profile_id uuid, p_reason text default null)
returns void
language plpgsql security definer set search_path = public, auth, pg_temp
as $$
declare
  v_me    uuid := (select auth.uid());
  v_team  uuid; v_leader uuid; v_next uuid;
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  if p_profile_id = v_me then
    raise exception 'You cannot remove your own account here.' using errcode = 'P0001';
  end if;
  if not exists (select 1 from auth.users where id = p_profile_id) then
    raise exception 'That participant no longer exists.' using errcode = 'P0001';
  end if;

  -- Keep a record before anything goes.
  insert into public.removed_participants
    (full_name, email, program, year_of_study, school, school_other, team_name, registered_at, removed_by, reason)
  select p.full_name, u.email, p.program, p.year_of_study, p.school::text, p.school_other,
         (select t.name from public.team_members tm join public.teams t on t.id = tm.team_id where tm.profile_id = u.id),
         coalesce(p.created_at, u.created_at),
         (select email from auth.users where id = v_me),
         nullif(btrim(coalesce(p_reason,'')), '')
  from auth.users u left join public.profiles p on p.id = u.id
  where u.id = p_profile_id;

  -- A leader's team must not vanish with them: hand it to the next member,
  -- the same way leave_team() does, and only disband if they were alone.
  select team_id into v_team from public.team_members where profile_id = p_profile_id;
  if v_team is not null then
    select leader_id into v_leader from public.teams where id = v_team;
    if v_leader = p_profile_id then
      select profile_id into v_next from public.team_members
       where team_id = v_team and profile_id <> p_profile_id
       order by joined_at limit 1;
      if v_next is null then
        delete from public.teams where id = v_team;
      else
        update public.teams set leader_id = v_next where id = v_team;
      end if;
    end if;
  end if;

  -- Removing the login account cascades to their profile, membership and
  -- requests. They can register again only if their school is allowed.
  delete from auth.users where id = p_profile_id;

  perform public.promote_from_waitlist();
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
  perform public.promote_from_waitlist();
  return p_capacity;
end $$;

drop function if exists public.admin_update_participant(uuid, text, text, smallint, public.school_choice, text, text);
create function public.admin_update_participant(
  p_profile_id uuid, p_full_name text, p_program text, p_year smallint,
  p_school public.school_choice, p_school_other text default null,
  p_campus text default null, p_phone text default null
) returns public.profiles
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_row public.profiles; v_other text := nullif(btrim(coalesce(p_school_other,'')), '');
        v_campus text := nullif(btrim(coalesce(p_campus,'')), '');
        v_phone text := public.normalize_phone(p_phone);
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  if p_school <> 'other' then v_other := null; end if;
  if p_school = 'other' and v_other is null then
    raise exception 'Give the school name when choosing Another school.' using errcode = 'P0001';
  end if;
  if v_campus is not null and v_campus not in ('brampton','sault_ste_marie') then
    raise exception 'Unknown campus.' using errcode = 'P0001';
  end if;
  if p_school = 'sault_college' and v_campus = 'brampton' then
    raise exception 'Sault College students attend the Sault Ste. Marie campus.' using errcode = 'P0001';
  end if;
  update public.profiles set
    full_name = btrim(p_full_name), program = btrim(p_program),
    year_of_study = p_year, school = p_school, school_other = v_other,
    campus = coalesce(v_campus, campus),
    phone = coalesce(v_phone, phone)
  where id = p_profile_id
  returning * into v_row;
  if v_row.id is null then
    raise exception 'That participant no longer exists.' using errcode = 'P0001';
  end if;
  return v_row;
end $$;

drop function if exists public.admin_list_participants();
create function public.admin_list_participants()
returns table (
  id uuid, full_name text, email text, phone text, program text, year_of_study smallint,
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
  select p.id, p.full_name, u.email::text, p.phone, p.program, p.year_of_study,
         p.school::text, p.school_other, p.campus, p.media_consent_at,
         p.status, exists (select 1 from public.admins a where a.user_id = p.id),
         t.id, t.name, coalesce(t.leader_id = p.id, false), p.created_at
  from public.profiles p
  join auth.users u on u.id = p.id
  left join public.team_members tm on tm.profile_id = p.id
  left join public.teams t on t.id = tm.team_id
  order by p.created_at;
end $$;

revoke execute on function public.admin_list_participants() from public, anon;
grant  execute on function public.admin_list_participants() to authenticated;
revoke execute on function public.admin_update_participant(uuid, text, text, smallint, public.school_choice, text, text, text) from public, anon;
grant  execute on function public.admin_update_participant(uuid, text, text, smallint, public.school_choice, text, text, text) to authenticated;
revoke execute on function public.admin_remove_participant(uuid, text) from public, anon;
grant  execute on function public.admin_remove_participant(uuid, text) to authenticated;
revoke execute on function public.admin_set_capacity(integer) from public, anon;
grant  execute on function public.admin_set_capacity(integer) to authenticated;
