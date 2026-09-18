-- Move the March 2026 edition out of the way without losing any of it.
-- Nothing is dropped: the tables keep their rows, constraints and policies,
-- they just stop living in the API-exposed public schema.
create schema if not exists archive_march_2026;

alter table public.join_requests  set schema archive_march_2026;
alter table public.team_members   set schema archive_march_2026;
alter table public.teams          set schema archive_march_2026;
alter table public.individuals    set schema archive_march_2026;
alter table public.announcements  set schema archive_march_2026;
alter table public.profiles       set schema archive_march_2026;

-- The March signup trigger wrote (id, email, full_name) into public.profiles on
-- every auth.users insert. The ThunderHacks II profile needs programme, year and
-- school, and is created explicitly by complete_registration() after signup, so
-- this trigger would only ever fail the insert and break signup.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
