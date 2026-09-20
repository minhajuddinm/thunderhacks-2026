-- A flat, self-contained record of the March 2026 edition.
--
-- It lives in archive_march_2026 rather than public on purpose: public is
-- exposed through PostgREST, and this table holds names, email addresses and
-- phone numbers. The archive schema already has its grants revoked from anon
-- and authenticated, so nothing reaches it over the API.
--
-- Nothing in here references auth.users or any other table. It is a record,
-- not a live relation, which is the point: the login accounts were deleted
-- straight after this was taken.
create table archive_march_2026.march_2026_registration (
  id                      integer generated always as identity primary key,
  full_name               text,
  email                   text,
  phone                   text,
  dietary_restrictions    text,
  skills                  text,
  team_name               text,
  was_team_owner          boolean not null default false,
  questionnaire_completed boolean,
  registered_at           timestamptz,
  account_created_at      timestamptz,
  last_signed_in_at       timestamptz,
  email_confirmed_at      timestamptz,
  had_login_account       boolean not null default false,
  archived_at             timestamptz not null default now()
);

comment on table archive_march_2026.march_2026_registration is
  'Flat record of everyone who registered for ThunderHacks I (March 2026), taken before their login accounts were deleted. No foreign keys by design.';

-- Teams a person owned, folded to one row per person so the join cannot
-- multiply anybody. Somebody who created two teams gets one row listing both.
with owned as (
  select owner_id,
         count(*)                                        as teams_owned,
         string_agg(team_name, '; ' order by created_at) as teams_owned_names
  from archive_march_2026.teams
  where owner_id is not null
  group by owner_id
)
insert into archive_march_2026.march_2026_registration (
  full_name, email, phone, dietary_restrictions, skills, team_name,
  was_team_owner, questionnaire_completed, registered_at,
  account_created_at, last_signed_in_at, email_confirmed_at, had_login_account
)
-- A full outer join because some accounts never completed a profile, and the
-- record should hold both cases.
select
  p.full_name,
  coalesce(p.email, u.email),
  p.phone,
  p.dietary_restrictions,
  p.skills,
  nullif(concat_ws(' / ', t.team_name,
         case when o.owner_id is not null then 'owned: ' || o.teams_owned_names end), ''),
  (o.owner_id is not null),
  p.questionnaire_completed,
  p.created_at,
  u.created_at,
  u.last_sign_in_at,
  u.email_confirmed_at,
  (u.id is not null)
from archive_march_2026.profiles p
full outer join auth.users u on u.id = p.id
left join archive_march_2026.teams t on t.id = p.team_id
left join owned o on o.owner_id = p.id;
