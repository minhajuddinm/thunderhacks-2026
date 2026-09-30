-- A team leader can take someone out of their own team. Leaders cannot remove
-- themselves here: leaving or disbanding is what leave_team() is for.
create or replace function public.remove_team_member(p_profile_id uuid)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_uid uuid := (select auth.uid()); v_team uuid;
begin
  if v_uid is null then
    raise exception 'You must be signed in.' using errcode = '42501';
  end if;

  select id into v_team from public.teams where leader_id = v_uid;
  if v_team is null then
    raise exception 'Only a team leader can remove someone.' using errcode = '42501';
  end if;
  if p_profile_id = v_uid then
    raise exception 'Use leave team to step away from your own team.' using errcode = 'P0001';
  end if;
  if not exists (
    select 1 from public.team_members where team_id = v_team and profile_id = p_profile_id
  ) then
    raise exception 'That person is not in your team.' using errcode = 'P0001';
  end if;

  delete from public.team_members where team_id = v_team and profile_id = p_profile_id;

  -- Any live thread between that person and this team is moot now.
  update public.team_requests set status = 'cancelled', responded_at = now()
   where team_id = v_team and profile_id = p_profile_id and status = 'pending';
end $$;

revoke execute on function public.remove_team_member(uuid) from public, anon;
grant  execute on function public.remove_team_member(uuid) to authenticated;
