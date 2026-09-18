-- All writes go through SECURITY DEFINER functions, which run as the owner.
-- Nothing reaching PostgREST needs direct write privileges on these tables.
revoke insert, update, delete, truncate, references, trigger
  on public.event_settings, public.profiles, public.teams,
     public.team_members, public.team_requests
  from anon, authenticated;

revoke insert, update, delete, truncate, references, trigger
  on public.participants, public.teams_overview
  from anon, authenticated;

-- anon keeps only what the public site legitimately reads.
revoke select on public.participants, public.teams_overview from anon;
