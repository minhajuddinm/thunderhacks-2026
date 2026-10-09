-- Removing a judge from the list. Refused while they still have saved scores,
-- so a delete can never take judging data with it: clear their scores first,
-- or just turn the judge off.
create or replace function public.admin_judging_delete_judge(p_judge_id uuid)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_n integer; v_name text;
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  select full_name into v_name from public.judges where id = p_judge_id;
  if v_name is null then
    raise exception 'That judge is already gone.' using errcode = 'P0001';
  end if;
  select count(*) into v_n from public.judging_scores where judge_id = p_judge_id;
  if v_n > 0 then
    raise exception '% has % saved %. Clear them first, or turn the judge off instead.',
      v_name, v_n, case when v_n = 1 then 'score' else 'scores' end using errcode = 'P0001';
  end if;
  delete from public.judges where id = p_judge_id;
end $$;

revoke execute on function public.admin_judging_delete_judge(uuid) from public, anon;
grant  execute on function public.admin_judging_delete_judge(uuid) to authenticated;
