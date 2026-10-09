-- An ALCOMS role: read the admin page, read the leaderboard order, change nothing.
--
-- public.admins gains a role. 'admin' is the full thing (Minhaj). 'alcoms' can
-- only read. is_admin() narrows to role = 'admin', so every write function
-- already in the database refuses an alcoms member without being touched.
-- is_staff() is the new, wider check used by the read functions.

alter table public.admins add column if not exists role text not null default 'admin';
alter table public.admins drop constraint if exists admins_role_check;
alter table public.admins add constraint admins_role_check check (role in ('admin', 'alcoms'));

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path to 'public', 'pg_temp'
as $$
  select exists (
    select 1 from public.admins
    where user_id = (select auth.uid()) and role = 'admin'
  )
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer
set search_path to 'public', 'pg_temp'
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()))
$$;

-- 'admin', 'alcoms' or null. The pages use it to decide what to render.
create or replace function public.staff_role()
returns text
language sql stable security definer
set search_path to 'public', 'pg_temp'
as $$
  select role from public.admins where user_id = (select auth.uid())
$$;

revoke all on function public.is_staff() from public, anon;
revoke all on function public.staff_role() from public, anon;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.staff_role() to authenticated;

-- The two read functions behind the participants page open up to both roles.
create or replace function public.admin_list_participants()
returns table(
  id uuid, full_name text, email text, phone text, program text,
  year_of_study smallint, school text, school_other text, campus text,
  media_consent_at timestamptz, status text, is_admin boolean,
  team_id uuid, team_name text, is_leader boolean, registered_at timestamptz
)
language plpgsql stable security definer
set search_path to 'public', 'auth', 'pg_temp'
as $$
begin
  if not public.is_staff() then
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

create or replace function public.admin_list_removed()
returns setof removed_participants
language plpgsql stable security definer
set search_path to 'public', 'pg_temp'
as $$
begin
  if not public.is_staff() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  return query select * from public.removed_participants order by removed_at desc;
end $$;

-- The leaderboard. Order only: no totals, no per judge rows, no comments.
-- The order is the average of total / max_total on the Overall stream, which
-- keeps a team judged by four judges comparable with one judged by six. Teams
-- nobody has scored yet come back with scored = false and no position.
create or replace function public.staff_leaderboard()
returns table(
  place int, team_id uuid, team_name text, campus text,
  members text, scored boolean
)
language plpgsql stable security definer
set search_path to 'public', 'pg_temp'
as $$
begin
  if not public.is_staff() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  return query
  with mainstream as (
    select id from public.judging_streams where is_main limit 1
  ),
  roster as (
    select tm.team_id,
           string_agg(p.full_name, ', ' order by p.full_name) as names,
           count(distinct p.campus) filter (where p.campus is not null) as campuses,
           min(p.campus) as one_campus
    from public.team_members tm
    join public.profiles p on p.id = tm.profile_id
    group by tm.team_id
  ),
  ranked as (
    select t.id,
           t.name,
           case
             when r.campuses = 1 then r.one_campus
             when r.campuses > 1 then 'mixed'
             else null
           end as campus,
           r.names,
           avg(sc.total / nullif(sc.max_total, 0)) as share
    from public.teams t
    left join roster r on r.team_id = t.id
    left join public.judging_scores sc
           on sc.team_id = t.id
          and sc.stream_id = (select id from mainstream)
    group by t.id, t.name, r.campuses, r.one_campus, r.names
  )
  select case when share is null then null
              else (rank() over (order by share desc nulls last))::int
         end,
         id, name, campus, names, share is not null
  from ranked
  order by share desc nulls last, name;
end $$;

revoke all on function public.staff_leaderboard() from public, anon;
grant execute on function public.staff_leaderboard() to authenticated;

-- Minhaj can hand out and take back the alcoms role from the admin page.
-- It can never touch a full admin row, so nobody can demote the admin here.
create or replace function public.admin_set_role(p_profile_id uuid, p_role text)
returns void
language plpgsql volatile security definer
set search_path to 'public', 'pg_temp'
as $$
declare v_current text;
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  if p_role not in ('alcoms', 'none') then
    raise exception 'Role has to be alcoms or none.';
  end if;
  if not exists (select 1 from public.profiles where id = p_profile_id) then
    raise exception 'No such person.';
  end if;

  select role into v_current from public.admins where user_id = p_profile_id;
  if v_current = 'admin' then
    raise exception 'That is a full admin. Change that in the database.';
  end if;

  if p_role = 'alcoms' then
    insert into public.admins (user_id, role) values (p_profile_id, 'alcoms')
    on conflict (user_id) do update set role = 'alcoms';
    -- Staff do not hold one of the 65 spots, so take them off the waitlist.
    update public.profiles set status = 'confirmed'
    where id = p_profile_id and status = 'waitlist';
  else
    delete from public.admins where user_id = p_profile_id and role = 'alcoms';
  end if;
end $$;

revoke all on function public.admin_set_role(uuid, text) from public, anon;
grant execute on function public.admin_set_role(uuid, text) to authenticated;

-- Who currently holds the alcoms role, for the panel on the admin page.
create or replace function public.admin_alcoms_list()
returns table(user_id uuid, full_name text, email text)
language plpgsql stable security definer
set search_path to 'public', 'auth', 'pg_temp'
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  return query
  select a.user_id, p.full_name, u.email::text
  from public.admins a
  join public.profiles p on p.id = a.user_id
  join auth.users u on u.id = a.user_id
  where a.role = 'alcoms'
  order by p.full_name;
end $$;

revoke all on function public.admin_alcoms_list() from public, anon;
grant execute on function public.admin_alcoms_list() to authenticated;
