-- Which campus someone attends, and when they agreed to photos and video.
-- Both are null for people who registered before these existed; the site
-- sends them to a short page to answer before their dashboard.
alter table public.profiles
  add column if not exists campus text,
  add column if not exists media_consent_at timestamptz;

alter table public.profiles drop constraint if exists profiles_campus_valid;
alter table public.profiles add constraint profiles_campus_valid
  check (campus is null or campus in ('brampton', 'sault_ste_marie'));

-- Sault College students attend the Sault Ste. Marie campus.
alter table public.profiles drop constraint if exists profiles_sault_college_campus;
alter table public.profiles add constraint profiles_sault_college_campus
  check (campus is null or school <> 'sault_college' or campus = 'sault_ste_marie');

-- complete_registration gains p_campus and p_media_consent. Its final body is
-- in 20260922131945_registration_campus_consent_answer_later.sql.
drop function if exists public.complete_registration(text, text, smallint, public.school_choice, text);

-- ------------------------------ the two questions, for existing people ----
create or replace function public.complete_event_details(p_campus text, p_media_consent boolean)
returns public.profiles
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_uid uuid := (select auth.uid()); v_school public.school_choice; v_row public.profiles;
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
         media_consent_at = coalesce(media_consent_at, now())
   where id = v_uid
  returning * into v_row;
  return v_row;
end $$;
revoke execute on function public.complete_event_details(text, boolean) from public, anon;
grant  execute on function public.complete_event_details(text, boolean) to authenticated;

-- ------------------------------------------------ participants view ----
drop view if exists public.participants;
create view public.participants with (security_invoker = true) as
select p.id, p.full_name, p.program, p.year_of_study, p.school, p.school_other,
       p.campus, p.created_at, tm.team_id, t.name as team_name
from public.profiles p
left join public.team_members tm on tm.profile_id = p.id
left join public.teams t on t.id = tm.team_id;
grant select on public.participants to authenticated;
revoke all on public.participants from anon;
revoke insert, update, delete, truncate, references, trigger on public.participants from authenticated;

-- ------------------------------------------------------------ admin ----
drop function if exists public.admin_list_participants();
create function public.admin_list_participants()
returns table (
  id uuid, full_name text, email text, program text, year_of_study smallint,
  school text, school_other text, campus text, media_consent_at timestamptz,
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
         t.id, t.name, coalesce(t.leader_id = p.id, false), p.created_at
  from public.profiles p
  join auth.users u on u.id = p.id
  left join public.team_members tm on tm.profile_id = p.id
  left join public.teams t on t.id = tm.team_id
  order by p.created_at;
end $$;

drop function if exists public.admin_update_participant(uuid, text, text, smallint, public.school_choice, text);
create function public.admin_update_participant(
  p_profile_id uuid, p_full_name text, p_program text, p_year smallint,
  p_school public.school_choice, p_school_other text default null, p_campus text default null
) returns public.profiles
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_row public.profiles; v_other text := nullif(btrim(coalesce(p_school_other,'')), '');
        v_campus text := nullif(btrim(coalesce(p_campus,'')), '');
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
    campus = coalesce(v_campus, campus)
  where id = p_profile_id
  returning * into v_row;
  if v_row.id is null then
    raise exception 'That participant no longer exists.' using errcode = 'P0001';
  end if;
  return v_row;
end $$;

revoke execute on function public.admin_list_participants() from public, anon;
grant  execute on function public.admin_list_participants() to authenticated;
revoke execute on function public.admin_update_participant(uuid, text, text, smallint, public.school_choice, text, text) from public, anon;
grant  execute on function public.admin_update_participant(uuid, text, text, smallint, public.school_choice, text, text) to authenticated;
