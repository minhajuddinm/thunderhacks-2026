-- Judging portal. Judges are not site accounts: they pick their name and type
-- one shared code, which every judging function checks for itself. Nothing here
-- is reachable without that code, so the page can sit on the main site without
-- being linked from it.

create table if not exists public.judges (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  title      text,
  sort       smallint not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.judging_settings (
  id          boolean primary key default true check (id),
  access_code text not null,
  is_open     boolean not null default true
);

-- Each stream is one set of criteria. "overall" is the main one every team is
-- judged on; the rest are sponsor tracks a team may also have entered.
create table if not exists public.judging_streams (
  id       uuid primary key default gen_random_uuid(),
  key      text unique not null,
  name     text not null,
  blurb    text,
  sort     smallint not null default 0,
  is_main  boolean not null default false,
  criteria jsonb not null
);

create table if not exists public.judging_scores (
  id                  uuid primary key default gen_random_uuid(),
  judge_id            uuid not null references public.judges(id) on delete cascade,
  team_id             uuid not null references public.teams(id) on delete cascade,
  stream_id           uuid not null references public.judging_streams(id) on delete cascade,
  scores              jsonb not null,
  comment             text,
  total               numeric not null,
  max_total           numeric not null,
  submitted_at        timestamptz not null default now(),
  edited_by_admin_at  timestamptz,
  unique (judge_id, team_id, stream_id)
);

alter table public.judges            enable row level security;
alter table public.judging_settings  enable row level security;
alter table public.judging_streams   enable row level security;
alter table public.judging_scores    enable row level security;
revoke all on public.judges, public.judging_settings, public.judging_streams, public.judging_scores from anon, authenticated;

insert into public.judging_settings (id, access_code)
values (true, 'THUNDER26')
on conflict (id) do nothing;

insert into public.judging_streams (key, name, blurb, sort, is_main, criteria) values
  ('overall', 'Overall', 'Every team is judged on this.', 0, true,
   '[{"key":"innovation","label":"Innovation","max":10},
     {"key":"technical","label":"Technical execution","max":10},
     {"key":"design","label":"Design and usability","max":10},
     {"key":"impact","label":"Impact","max":10},
     {"key":"presentation","label":"Presentation","max":10}]'::jsonb),
  ('olg', 'OLG challenge', 'Criteria to be confirmed by OLG.', 1, false,
   '[{"key":"innovation","label":"Innovation","max":10},
     {"key":"technical","label":"Technical execution","max":10},
     {"key":"fit","label":"Fit with the challenge","max":10},
     {"key":"presentation","label":"Presentation","max":10}]'::jsonb),
  ('cbn', 'Canadian Bank Note challenge', 'Criteria to be confirmed by CBN.', 2, false,
   '[{"key":"innovation","label":"Innovation","max":10},
     {"key":"technical","label":"Technical execution","max":10},
     {"key":"fit","label":"Fit with the challenge","max":10},
     {"key":"presentation","label":"Presentation","max":10}]'::jsonb),
  ('gamejam', 'Algoma game jam', 'Criteria to be confirmed.', 3, false,
   '[{"key":"fun","label":"Fun","max":10},
     {"key":"art","label":"Art and sound","max":10},
     {"key":"technical","label":"Technical execution","max":10},
     {"key":"presentation","label":"Presentation","max":10}]'::jsonb)
on conflict (key) do nothing;

-- ------------------------------------------------------------- helpers ----
create or replace function public.judging_code_ok(p_code text)
returns boolean
language sql stable security definer set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.judging_settings s
    where s.id and btrim(upper(p_code)) = btrim(upper(s.access_code))
  )
$$;

create or replace function public.judging_check(p_judge_id uuid, p_code text)
returns void
language plpgsql stable security definer set search_path = public, pg_temp
as $$
begin
  if not public.judging_code_ok(p_code) then
    raise exception 'That code is not right.' using errcode = '42501';
  end if;
  if not exists (select 1 from public.judges where id = p_judge_id and is_active) then
    raise exception 'Pick your name again.' using errcode = '42501';
  end if;
end $$;

create or replace function public.judging_total(p_criteria jsonb, p_scores jsonb)
returns numeric
language plpgsql immutable
as $$
declare c jsonb; v numeric; t numeric := 0;
begin
  for c in select * from jsonb_array_elements(p_criteria) loop
    v := (p_scores ->> (c ->> 'key'))::numeric;
    if v is null then
      raise exception 'Score every line before saving.' using errcode = 'P0001';
    end if;
    if v < 0 or v > (c ->> 'max')::numeric then
      raise exception 'Scores have to be between 0 and the maximum shown.' using errcode = 'P0001';
    end if;
    t := t + v;
  end loop;
  return t;
end $$;

-- --------------------------------------------------------- judge-facing ----
-- The judge list is needed before the code is typed, so this one is open. It
-- gives names only, nothing else.
create or replace function public.judging_judges()
returns table (id uuid, full_name text, title text)
language sql stable security definer set search_path = public, pg_temp
as $$
  select j.id, j.full_name, j.title
  from public.judges j where j.is_active order by j.sort, j.full_name
$$;

create or replace function public.judging_open(p_judge_id uuid, p_code text)
returns table (judge_name text, is_open boolean)
language plpgsql stable security definer set search_path = public, pg_temp
as $$
begin
  perform public.judging_check(p_judge_id, p_code);
  return query
  select j.full_name, (select s.is_open from public.judging_settings s where s.id)
  from public.judges j where j.id = p_judge_id;
end $$;

create or replace function public.judging_streams_list(p_judge_id uuid, p_code text)
returns table (id uuid, key text, name text, blurb text, is_main boolean, criteria jsonb)
language plpgsql stable security definer set search_path = public, pg_temp
as $$
begin
  perform public.judging_check(p_judge_id, p_code);
  return query
  select s.id, s.key, s.name, s.blurb, s.is_main, s.criteria
  from public.judging_streams s order by s.sort, s.name;
end $$;

-- Teams, with who is in them and what this judge has already scored.
create or replace function public.judging_teams(p_judge_id uuid, p_code text)
returns table (
  team_id uuid, team_name text, campus text, members text,
  done_streams text, main_done boolean
)
language plpgsql stable security definer set search_path = public, pg_temp
as $$
begin
  perform public.judging_check(p_judge_id, p_code);
  return query
  select t.id, t.name,
         (select p.campus from public.profiles p where p.id = t.leader_id),
         (select string_agg(p2.full_name, ', ' order by m.joined_at)
            from public.team_members m join public.profiles p2 on p2.id = m.profile_id
           where m.team_id = t.id),
         (select string_agg(st.name, ', ' order by st.sort)
            from public.judging_scores sc join public.judging_streams st on st.id = sc.stream_id
           where sc.team_id = t.id and sc.judge_id = p_judge_id),
         exists (
           select 1 from public.judging_scores sc2 join public.judging_streams st2 on st2.id = sc2.stream_id
            where sc2.team_id = t.id and sc2.judge_id = p_judge_id and st2.is_main
         )
  from public.teams t
  order by t.name;
end $$;

-- What this judge has saved for one team, so the page can show it back.
create or replace function public.judging_team_scores(p_judge_id uuid, p_code text, p_team_id uuid)
returns table (
  score_id uuid, stream_id uuid, stream_key text, stream_name text,
  criteria jsonb, scores jsonb, comment text, total numeric, max_total numeric,
  submitted_at timestamptz
)
language plpgsql stable security definer set search_path = public, pg_temp
as $$
begin
  perform public.judging_check(p_judge_id, p_code);
  return query
  select sc.id, st.id, st.key, st.name, st.criteria, sc.scores, sc.comment,
         sc.total, sc.max_total, sc.submitted_at
  from public.judging_scores sc join public.judging_streams st on st.id = sc.stream_id
  where sc.judge_id = p_judge_id and sc.team_id = p_team_id
  order by st.sort;
end $$;

-- Saving is once only. A judge cannot change a score afterwards.
create or replace function public.judging_save(
  p_judge_id uuid, p_code text, p_team_id uuid, p_stream_key text,
  p_scores jsonb, p_comment text
) returns uuid
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_stream public.judging_streams; v_total numeric; v_max numeric; v_id uuid;
begin
  perform public.judging_check(p_judge_id, p_code);
  if not (select s.is_open from public.judging_settings s where s.id) then
    raise exception 'Judging is closed.' using errcode = 'P0001';
  end if;
  select * into v_stream from public.judging_streams where key = p_stream_key;
  if v_stream.id is null then
    raise exception 'Unknown stream.' using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.teams where id = p_team_id) then
    raise exception 'That team no longer exists.' using errcode = 'P0001';
  end if;
  if exists (
    select 1 from public.judging_scores
     where judge_id = p_judge_id and team_id = p_team_id and stream_id = v_stream.id
  ) then
    raise exception 'You have already saved this one.' using errcode = 'P0001';
  end if;

  v_total := public.judging_total(v_stream.criteria, p_scores);
  select sum((c ->> 'max')::numeric) into v_max
    from jsonb_array_elements(v_stream.criteria) c;

  insert into public.judging_scores (judge_id, team_id, stream_id, scores, comment, total, max_total)
  values (p_judge_id, p_team_id, v_stream.id, p_scores,
          nullif(btrim(coalesce(p_comment, '')), ''), v_total, v_max)
  returning id into v_id;
  return v_id;
end $$;

revoke execute on function public.judging_code_ok(text) from public;
revoke execute on function public.judging_check(uuid, text) from public;
revoke execute on function public.judging_total(jsonb, jsonb) from public;
grant execute on function public.judging_judges() to anon, authenticated;
grant execute on function public.judging_open(uuid, text) to anon, authenticated;
grant execute on function public.judging_streams_list(uuid, text) to anon, authenticated;
grant execute on function public.judging_teams(uuid, text) to anon, authenticated;
grant execute on function public.judging_team_scores(uuid, text, uuid) to anon, authenticated;
grant execute on function public.judging_save(uuid, text, uuid, text, jsonb, text) to anon, authenticated;

-- --------------------------------------------------------------- admin ----
create or replace function public.admin_judging_overview()
returns table (
  score_id uuid, judge_id uuid, judge_name text, team_id uuid, team_name text,
  stream_key text, stream_name text, criteria jsonb, scores jsonb, comment text,
  total numeric, max_total numeric, submitted_at timestamptz, edited_by_admin_at timestamptz
)
language plpgsql stable security definer set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  return query
  select sc.id, j.id, j.full_name, t.id, t.name, st.key, st.name, st.criteria,
         sc.scores, sc.comment, sc.total, sc.max_total, sc.submitted_at, sc.edited_by_admin_at
  from public.judging_scores sc
  join public.judges j on j.id = sc.judge_id
  join public.teams t on t.id = sc.team_id
  join public.judging_streams st on st.id = sc.stream_id
  order by t.name, st.sort, j.full_name;
end $$;

create or replace function public.admin_judging_update(p_score_id uuid, p_scores jsonb, p_comment text)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_criteria jsonb; v_total numeric;
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  select st.criteria into v_criteria
    from public.judging_scores sc join public.judging_streams st on st.id = sc.stream_id
   where sc.id = p_score_id;
  if v_criteria is null then
    raise exception 'That score no longer exists.' using errcode = 'P0001';
  end if;
  v_total := public.judging_total(v_criteria, p_scores);
  update public.judging_scores
     set scores = p_scores,
         comment = nullif(btrim(coalesce(p_comment, '')), ''),
         total = v_total,
         edited_by_admin_at = now()
   where id = p_score_id;
end $$;

create or replace function public.admin_judging_settings(p_code text default null, p_is_open boolean default null)
returns table (access_code text, is_open boolean)
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  update public.judging_settings s
     set access_code = coalesce(nullif(btrim(coalesce(p_code, '')), ''), s.access_code),
         is_open = coalesce(p_is_open, s.is_open)
   where s.id;
  return query select s.access_code, s.is_open from public.judging_settings s where s.id;
end $$;

create or replace function public.admin_judging_add_judge(p_full_name text, p_title text default null)
returns uuid
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  if btrim(coalesce(p_full_name, '')) = '' then
    raise exception 'Give the judge a name.' using errcode = 'P0001';
  end if;
  insert into public.judges (full_name, title)
  values (btrim(p_full_name), nullif(btrim(coalesce(p_title, '')), ''))
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.admin_judging_set_judge_active(p_judge_id uuid, p_active boolean)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  update public.judges set is_active = p_active where id = p_judge_id;
end $$;

create or replace function public.admin_judging_judges()
returns table (id uuid, full_name text, title text, is_active boolean, saved integer)
language plpgsql stable security definer set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  return query
  select j.id, j.full_name, j.title, j.is_active,
         (select count(*)::int from public.judging_scores sc where sc.judge_id = j.id)
  from public.judges j order by j.sort, j.full_name;
end $$;

create or replace function public.admin_judging_code()
returns table (access_code text, is_open boolean)
language plpgsql stable security definer set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  return query select s.access_code, s.is_open from public.judging_settings s where s.id;
end $$;

revoke execute on function public.admin_judging_overview() from public, anon;
revoke execute on function public.admin_judging_update(uuid, jsonb, text) from public, anon;
revoke execute on function public.admin_judging_settings(text, boolean) from public, anon;
revoke execute on function public.admin_judging_add_judge(text, text) from public, anon;
revoke execute on function public.admin_judging_set_judge_active(uuid, boolean) from public, anon;
revoke execute on function public.admin_judging_judges() from public, anon;
revoke execute on function public.admin_judging_code() from public, anon;
grant execute on function public.admin_judging_overview() to authenticated;
grant execute on function public.admin_judging_update(uuid, jsonb, text) to authenticated;
grant execute on function public.admin_judging_settings(text, boolean) to authenticated;
grant execute on function public.admin_judging_add_judge(text, text) to authenticated;
grant execute on function public.admin_judging_set_judge_active(uuid, boolean) to authenticated;
grant execute on function public.admin_judging_judges() to authenticated;
grant execute on function public.admin_judging_code() to authenticated;
