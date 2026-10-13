-- Each judge gets their own code, so a judge can only open the portal as
-- themselves. The shared judging code no longer opens anything.
--
-- The first three statements are already applied to the live database. The
-- rest change the admin page's reads, which is why this file exists.

alter table public.judges add column if not exists access_code text;

create or replace function public.judging_new_code()
returns text language sql volatile as $$
  select string_agg(substr('ACDEFGHJKLMNPQRTUVWXY34679', 1 + floor(random()*26)::int, 1), '')
  from generate_series(1, 6)
$$;
revoke all on function public.judging_new_code() from public, anon;

update public.judges j
set access_code = (
  select string_agg(substr('ACDEFGHJKLMNPQRTUVWXY34679', 1 + floor(random()*26)::int, 1), '')
  from generate_series(1, 6) g
  where g.g is not null and j.id is not null
)
where j.access_code is null;

create unique index if not exists judges_access_code_key
  on public.judges (upper(btrim(access_code)));
alter table public.judges alter column access_code set not null;

-- A code now proves which judge you are, not that you are a judge.
create or replace function public.judging_code_ok(p_code text)
returns boolean language sql stable security definer
set search_path to 'public', 'pg_temp' as $$
  select exists (
    select 1 from public.judges j
    where j.is_active and btrim(upper(p_code)) = btrim(upper(j.access_code))
  )
$$;

create or replace function public.judging_check(p_judge_id uuid, p_code text)
returns void language plpgsql stable security definer
set search_path to 'public', 'pg_temp' as $$
begin
  if not exists (
    select 1 from public.judges j
    where j.id = p_judge_id and j.is_active
      and btrim(upper(j.access_code)) = btrim(upper(coalesce(p_code, '')))
  ) then
    raise exception 'That code does not match the name you picked.' using errcode = '42501';
  end if;
end $$;

-- The admin page reads the codes, so Minhaj can hand each judge their own.
drop function if exists public.admin_judging_judges();
create function public.admin_judging_judges()
returns table(id uuid, full_name text, title text, is_active boolean, saved integer, access_code text)
language plpgsql stable security definer
set search_path to 'public', 'pg_temp' as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  return query
  select j.id, j.full_name, j.title, j.is_active,
         (select count(*)::int from public.judging_scores sc where sc.judge_id = j.id),
         j.access_code
  from public.judges j order by j.sort, j.full_name;
end $$;
revoke all on function public.admin_judging_judges() from public, anon;
grant execute on function public.admin_judging_judges() to authenticated;

-- Roll one judge's code, for a code that was read out to the wrong person.
create or replace function public.admin_judging_regenerate_code(p_judge_id uuid)
returns text language plpgsql volatile security definer
set search_path to 'public', 'pg_temp' as $$
declare v_code text;
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  loop
    v_code := public.judging_new_code();
    exit when not exists (
      select 1 from public.judges where upper(btrim(access_code)) = upper(v_code)
    );
  end loop;
  update public.judges set access_code = v_code where id = p_judge_id;
  if not found then
    raise exception 'No such judge.' using errcode = 'P0001';
  end if;
  return v_code;
end $$;
revoke all on function public.admin_judging_regenerate_code(uuid) from public, anon;
grant execute on function public.admin_judging_regenerate_code(uuid) to authenticated;

-- A judge added later gets a code of their own straight away.
create or replace function public.admin_judging_add_judge(p_full_name text, p_title text default null)
returns uuid language plpgsql security definer
set search_path to 'public', 'pg_temp' as $$
declare v_id uuid; v_code text;
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  if btrim(coalesce(p_full_name, '')) = '' then
    raise exception 'Give the judge a name.' using errcode = 'P0001';
  end if;
  loop
    v_code := public.judging_new_code();
    exit when not exists (
      select 1 from public.judges where upper(btrim(access_code)) = upper(v_code)
    );
  end loop;
  insert into public.judges (full_name, title, access_code)
  values (btrim(p_full_name), nullif(btrim(coalesce(p_title, '')), ''), v_code)
  returning id into v_id;
  return v_id;
end $$;

select full_name, title, access_code, is_active from public.judges order by sort, full_name;
