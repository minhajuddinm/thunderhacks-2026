-- Clearing scores, for test runs before the day. Admins only, and the
-- everything option needs the word RESET typed, so a stray click cannot wipe
-- real judging.
create or replace function public.admin_judging_delete_score(p_score_id uuid)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  delete from public.judging_scores where id = p_score_id;
end $$;

create or replace function public.admin_judging_reset_team(p_team_id uuid)
returns integer
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_n integer;
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  delete from public.judging_scores where team_id = p_team_id;
  get diagnostics v_n = row_count;
  return v_n;
end $$;

create or replace function public.admin_judging_reset_all(p_confirm text)
returns integer
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_n integer;
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  if btrim(upper(coalesce(p_confirm, ''))) <> 'RESET' then
    raise exception 'Type RESET to clear every score.' using errcode = 'P0001';
  end if;
  delete from public.judging_scores;
  get diagnostics v_n = row_count;
  return v_n;
end $$;

revoke execute on function public.admin_judging_delete_score(uuid) from public, anon;
revoke execute on function public.admin_judging_reset_team(uuid) from public, anon;
revoke execute on function public.admin_judging_reset_all(text) from public, anon;
grant  execute on function public.admin_judging_delete_score(uuid) to authenticated;
grant  execute on function public.admin_judging_reset_team(uuid) to authenticated;
grant  execute on function public.admin_judging_reset_all(text) to authenticated;
