-- security_invoker means these run with the caller's RLS, not the owner's, so a
-- view cannot become a way around the policies above.

create view public.participants with (security_invoker = true) as
select
  p.id,
  p.full_name,
  p.program,
  p.year_of_study,
  p.school,
  p.created_at,
  tm.team_id,
  t.name as team_name
from public.profiles p
left join public.team_members tm on tm.profile_id = p.id
left join public.teams t on t.id = tm.team_id;

create view public.teams_overview with (security_invoker = true) as
select
  t.id,
  t.name,
  t.created_at,
  t.leader_id,
  lp.full_name as leader_name,
  count(tm.profile_id)::int as member_count,
  (select s.max_team_size from public.event_settings s where s.id) as max_team_size,
  count(tm.profile_id)::int < (select s.max_team_size from public.event_settings s where s.id) as has_space
from public.teams t
join public.profiles lp on lp.id = t.leader_id
left join public.team_members tm on tm.team_id = t.id
group by t.id, t.name, t.created_at, t.leader_id, lp.full_name;

grant select on public.participants   to authenticated;
grant select on public.teams_overview to authenticated;
