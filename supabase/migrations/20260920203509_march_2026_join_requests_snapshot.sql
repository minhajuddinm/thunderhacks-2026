-- join_requests cascades from profiles, which cascades from auth.users, so it
-- would disappear with the accounts. It already carries the requester's name
-- and email, so a flat copy loses nothing.
create table archive_march_2026.march_2026_join_requests (
  id              integer generated always as identity primary key,
  team_name       text,
  requester_name  text,
  requester_email text,
  message         text,
  status          text,
  requested_at    timestamptz,
  archived_at     timestamptz not null default now()
);

comment on table archive_march_2026.march_2026_join_requests is
  'Flat record of ThunderHacks I join requests, taken before the login accounts were deleted. No foreign keys by design.';

insert into archive_march_2026.march_2026_join_requests
  (team_name, requester_name, requester_email, message, status, requested_at)
select t.team_name, r.requester_name, r.requester_email, r.message,
       r.status::text, r.created_at
from archive_march_2026.join_requests r
left join archive_march_2026.teams t on t.id = r.team_id;
