-- One reversible selection per registered team; never delete registrations or scores.
alter table public.teams
  add column if not exists judging_enabled boolean not null default false;

-- Initial roster explicitly requested by the organizer. Future selections use IDs.
update public.teams set judging_enabled = true
where name in ('Don''t join my team', 'GHG', 'Team Rocket');

create or replace function public.admin_judging_teams()
returns table (
  team_id uuid, team_name text, campus text, members text, judging_enabled boolean
)
language plpgsql stable security definer set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null or public.is_admin() is distinct from true then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  return query
  select t.id, t.name,
    (select p.campus from public.profiles p where p.id = t.leader_id),
    (select string_agg(p.full_name, ', ' order by m.joined_at)
       from public.team_members m join public.profiles p on p.id = m.profile_id
      where m.team_id = t.id),
    t.judging_enabled
  from public.teams t order by t.judging_enabled desc, t.name;
end $$;
revoke all on function public.admin_judging_teams() from public, anon;
grant execute on function public.admin_judging_teams() to authenticated;

create or replace function public.admin_set_judging_team(p_team_id uuid, p_enabled boolean)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null or public.is_admin() is distinct from true then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  if p_enabled is null then
    raise exception 'Choose whether the team can be judged.' using errcode = '22004';
  end if;
  update public.teams set judging_enabled = p_enabled where id = p_team_id;
  if not found then
    raise exception 'That team no longer exists.' using errcode = 'P0001';
  end if;
end $$;
revoke all on function public.admin_set_judging_team(uuid, boolean) from public, anon;
grant execute on function public.admin_set_judging_team(uuid, boolean) to authenticated;

-- Keep the existing judge-code check, fields and scores; filter only availability.
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
    (select string_agg(p.full_name, ', ' order by m.joined_at)
       from public.team_members m join public.profiles p on p.id = m.profile_id
      where m.team_id = t.id),
    (select string_agg(st.name, ', ' order by st.sort)
       from public.judging_scores sc join public.judging_streams st on st.id = sc.stream_id
      where sc.team_id = t.id and sc.judge_id = p_judge_id),
    exists (select 1 from public.judging_scores sc join public.judging_streams st on st.id = sc.stream_id
             where sc.team_id = t.id and sc.judge_id = p_judge_id and st.is_main)
  from public.teams t where t.judging_enabled
  order by t.name;
end $$;

-- A disabled team must also reject an already-open form or direct RPC call.
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
  -- Share lock serializes saving with an admin removing the team.
  perform 1 from public.teams t where t.id = p_team_id and t.judging_enabled for share;
  if not found then
    raise exception 'This team is not currently in judging.' using errcode = 'P0001';
  end if;
  select * into v_stream from public.judging_streams where key = p_stream_key;
  if v_stream.id is null then
    raise exception 'Unknown stream.' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.judging_scores
              where judge_id = p_judge_id and team_id = p_team_id and stream_id = v_stream.id) then
    raise exception 'You have already saved this one.' using errcode = 'P0001';
  end if;
  v_total := public.judging_total(v_stream.criteria, p_scores);
  select sum((c ->> 'max')::numeric) into v_max from jsonb_array_elements(v_stream.criteria) c;
  insert into public.judging_scores (judge_id, team_id, stream_id, scores, comment, total, max_total)
  values (p_judge_id, p_team_id, v_stream.id, p_scores,
          nullif(btrim(coalesce(p_comment, '')), ''), v_total, v_max)
  returning id into v_id;
  return v_id;
end $$;
