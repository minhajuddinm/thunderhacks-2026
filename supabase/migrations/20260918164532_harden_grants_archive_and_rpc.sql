-- 1. The archive holds March registrants' names, emails, phone numbers and
--    dietary notes. Nobody signed in or out needs API access to it; query it
--    from the SQL editor or with the service role if it is ever needed.
revoke all on all tables in schema archive_march_2026 from anon, authenticated;
revoke usage on schema archive_march_2026 from anon, authenticated;

-- 2. Signed-out visitors have no business reading the participant list, the
--    team list or anyone's profile. RLS already returns them nothing, but the
--    grant made the objects discoverable, so take the grant away too.
revoke select on public.profiles       from anon;
revoke select on public.teams          from anon;
revoke select on public.team_members   from anon;
revoke select on public.team_requests  from anon;
revoke select on public.participants   from anon;
revoke select on public.teams_overview from anon;

-- 3. Every mutation function already refuses when auth.uid() is null, but an
--    anon role should not be able to reach them at all.
revoke execute on function public.complete_registration(text, text, smallint, public.school_choice) from anon;
revoke execute on function public.create_team(text)                  from anon;
revoke execute on function public.request_to_join(uuid)              from anon;
revoke execute on function public.invite_to_team(uuid)               from anon;
revoke execute on function public.respond_to_request(uuid, boolean)  from anon;
revoke execute on function public.cancel_request(uuid)               from anon;
revoke execute on function public.leave_team()                       from anon;

-- registration_is_open() stays callable by anon: it returns one boolean and the
-- signup page needs it before anyone has an account.
