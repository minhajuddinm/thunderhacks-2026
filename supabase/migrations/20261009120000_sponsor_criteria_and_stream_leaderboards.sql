-- Two things.
--
-- 1. The OLG and CBN criteria come from the problem statements they sent, and
--    the game jam gets criteria that suit a game jam. Each criterion carries a
--    hint, which the judging form shows under the label.
-- 2. One leaderboard per stream, live from the first saved score.
--
-- The first version of staff_leaderboard was broken: its output parameter
-- "campus" had the same name as a column in the query, which plpgsql reads as
-- ambiguous and refuses at run time, so the page always came back empty. Every
-- reference below is qualified and no output parameter shares a column name.

update public.judging_streams
set blurb = 'Intelligent player protection and fraud detection. Judged against the four solution requirements in the OLG brief.',
    criteria = '[
      {"key":"detection","max":10,"label":"Detection of unusual activity",
       "hint":"Finds unusual, anomalous or potentially suspicious player activity in transaction and behavioural data."},
      {"key":"context","max":10,"label":"Contextual risk assessment",
       "hint":"Judges whether activity is reasonable against the player profile, their history, demographics or a peer group."},
      {"key":"prioritisation","max":10,"label":"Investigation prioritisation",
       "hint":"Surfaces the highest risk accounts, transactions or patterns, with risk scores an investigator can act on."},
      {"key":"experience","max":10,"label":"Investigator experience",
       "hint":"Explains why something was flagged and presents it through a dashboard, report or tool that supports a decision."},
      {"key":"bonus","max":5,"label":"Bonus work",
       "hint":"Optional extras from the brief: synthetic test data, detection rules validated against scenarios, automated recommendations, network analysis between players, a unified risk dashboard."}
    ]'::jsonb
where key = 'olg';

update public.judging_streams
set blurb = 'Casino style crash game. The rubric is the one in the CBN brief, out of 50.',
    criteria = '[
      {"key":"presentation_layer","max":10,"label":"Presentation layer",
       "hint":"Interface quality, responsiveness, a consistent theme, usable controls and clear gameplay feedback."},
      {"key":"backend_layer","max":10,"label":"Backend layer",
       "hint":"Game logic, account and balance handling, how the crash point is generated, security and reliability."},
      {"key":"modularity","max":10,"label":"Modularity and configurability",
       "hint":"Code quality, maintainability, extensibility, localisation and how easily it could be built on."},
      {"key":"creativity","max":20,"label":"Creativity and polish",
       "hint":"Innovation, visual appeal, player engagement and overall impact. Worth the most, so weigh it accordingly."}
    ]'::jsonb
where key = 'cbn';

update public.judging_streams
set blurb = 'A game made during the jam. Play it before you score it.',
    criteria = '[
      {"key":"fun","max":10,"label":"Fun to play",
       "hint":"Is it actually enjoyable in the first minute, and does it hold up after that."},
      {"key":"creativity","max":10,"label":"Creativity",
       "hint":"An idea or a twist you have not seen before, rather than a clone."},
      {"key":"art","max":10,"label":"Art and sound",
       "hint":"Visuals and audio that fit together and carry the game."},
      {"key":"technical","max":10,"label":"Technical execution",
       "hint":"Runs without breaking, controls respond, no bugs that stop play."},
      {"key":"complete","max":10,"label":"Finished and polished",
       "hint":"Playable start to finish, with menus, instructions and an ending rather than a demo."}
    ]'::jsonb
where key = 'gamejam';

drop function if exists public.staff_leaderboard();

create or replace function public.staff_leaderboard()
returns table(
  s_key text, s_name text, s_sort int, s_main boolean,
  place int, t_id uuid, t_name text, t_campus text, t_members text, t_judges int
)
language plpgsql stable security definer
set search_path to 'public', 'pg_temp'
as $$
begin
  if not public.is_staff() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  return query
  with roster as (
    select tm.team_id as rteam,
           string_agg(pr.full_name, ', ' order by pr.full_name) as rnames,
           count(distinct pr.campus) filter (where pr.campus is not null) as rcampuses,
           min(pr.campus) as rcampus
    from public.team_members tm
    join public.profiles pr on pr.id = tm.profile_id
    group by tm.team_id
  ),
  agg as (
    select sc.stream_id as astream,
           sc.team_id as ateam,
           avg(sc.total / nullif(sc.max_total, 0)) as ashare,
           count(*)::int as ajudges
    from public.judging_scores sc
    group by sc.stream_id, sc.team_id
  )
  select st.key,
         st.name,
         st.sort::int,
         st.is_main,
         (rank() over (partition by st.id order by a.ashare desc))::int,
         tm2.id,
         tm2.name,
         case
           when r.rcampuses = 1 then r.rcampus
           when r.rcampuses > 1 then 'mixed'
           else null
         end,
         r.rnames,
         a.ajudges
  from agg a
  join public.judging_streams st on st.id = a.astream
  join public.teams tm2 on tm2.id = a.ateam
  left join roster r on r.rteam = tm2.id
  order by st.sort, a.ashare desc, tm2.name;
end $$;

revoke all on function public.staff_leaderboard() from public, anon;
grant execute on function public.staff_leaderboard() to authenticated;

select key, name, jsonb_array_length(criteria) as lines,
       (select sum((c->>'max')::int) from jsonb_array_elements(criteria) c) as out_of
from public.judging_streams order by sort;
