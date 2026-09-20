-- Somebody who picks "Other" types their school, so the name is kept rather
-- than flattened to a label nobody can report on.
alter table public.profiles
  add column if not exists school_other text;

-- Present exactly when school is 'other', and never blank in that case.
alter table public.profiles
  drop constraint if exists profiles_school_other_pairing;

alter table public.profiles
  add constraint profiles_school_other_pairing check (
    (school = 'other'  and school_other is not null
                       and char_length(btrim(school_other)) between 2 and 80)
    or
    (school <> 'other' and school_other is null)
  );

-- Recreate rather than overload: a second signature would leave PostgREST
-- guessing which one a call meant.
drop function if exists public.complete_registration(text, text, smallint, public.school_choice);

create function public.complete_registration(
  p_full_name    text,
  p_program      text,
  p_year         smallint,
  p_school       public.school_choice,
  p_school_other text default null
) returns public.profiles
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid   uuid := (select auth.uid());
  v_other text := nullif(btrim(coalesce(p_school_other, '')), '');
  v_row   public.profiles;
begin
  if v_uid is null then
    raise exception 'You must be signed in to register.' using errcode = '42501';
  end if;
  if not public.registration_is_open() then
    raise exception 'Registration has not opened yet.' using errcode = 'P0001';
  end if;

  if p_school = 'other' and v_other is null then
    raise exception 'Tell us which school you are at.' using errcode = 'P0001';
  end if;
  -- Anything typed alongside one of the named schools is dropped, so the
  -- column cannot disagree with the enum.
  if p_school <> 'other' then
    v_other := null;
  end if;

  insert into public.profiles (id, full_name, program, year_of_study, school, school_other)
  values (v_uid, btrim(p_full_name), btrim(p_program), p_year, p_school, v_other)
  on conflict (id) do update set
    full_name     = excluded.full_name,
    program       = excluded.program,
    year_of_study = excluded.year_of_study,
    school        = excluded.school,
    school_other  = excluded.school_other
  returning * into v_row;

  return v_row;
end $$;

revoke execute on function public.complete_registration(text, text, smallint, public.school_choice, text) from public, anon;
grant  execute on function public.complete_registration(text, text, smallint, public.school_choice, text) to authenticated;

-- Dropped and rebuilt because a replace cannot insert a column mid-list.
drop view if exists public.participants;

create view public.participants with (security_invoker = true) as
select
  p.id,
  p.full_name,
  p.program,
  p.year_of_study,
  p.school,
  p.school_other,
  p.created_at,
  tm.team_id,
  t.name as team_name
from public.profiles p
left join public.team_members tm on tm.profile_id = p.id
left join public.teams t on t.id = tm.team_id;

grant select on public.participants to authenticated;
revoke select, insert, update, delete, truncate, references, trigger
  on public.participants from anon;
revoke insert, update, delete, truncate, references, trigger
  on public.participants from authenticated;
