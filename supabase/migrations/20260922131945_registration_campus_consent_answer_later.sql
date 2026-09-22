-- Campus and consent may be left out at registration: anyone without them
-- is held on the two-question page until they answer, so they still cannot
-- reach the dashboard without agreeing. What is sent is still checked.
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
  v_uid    uuid := (select auth.uid());
  v_other  text := nullif(btrim(coalesce(p_school_other, '')), '');
  v_campus text := nullif(btrim(coalesce(p_campus, '')), '');
  v_row    public.profiles;
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

  insert into public.profiles (id, full_name, program, year_of_study, school, school_other, campus, media_consent_at)
  values (v_uid, btrim(p_full_name), btrim(p_program), p_year, p_school, v_other, v_campus,
          case when p_media_consent then now() end)
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
