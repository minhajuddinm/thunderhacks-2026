-- ThunderHacks II registration portal: tables.
--
-- Writes go through SECURITY DEFINER functions (next migration) so the
-- invariants (one team per person, four members max, only the leader approves)
-- live in one place. RLS therefore grants SELECT only; there are deliberately
-- no INSERT/UPDATE/DELETE policies on these tables.

create table public.event_settings (
  id                    boolean primary key default true,
  registration_opens_at timestamptz not null,
  max_team_size         smallint    not null default 4,
  constraint event_settings_single_row check (id)
);

-- Registration opens 8:00am Eastern on 21 September 2026. Held in the database
-- so an early POST straight at the API cannot get in ahead of it.
insert into public.event_settings (id, registration_opens_at, max_team_size)
values (true, '2026-09-21 08:00:00-04:00', 4);

create type public.school_choice  as enum ('algoma', 'sault_college', 'both');
create type public.request_kind   as enum ('request', 'invite');
create type public.request_status as enum ('pending', 'accepted', 'declined', 'cancelled');

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text     not null,
  program       text     not null,
  year_of_study smallint not null,
  school        public.school_choice not null,
  created_at    timestamptz not null default now(),
  constraint profiles_full_name_len check (char_length(btrim(full_name)) between 2 and 80),
  constraint profiles_program_len   check (char_length(btrim(program))   between 2 and 80),
  constraint profiles_year_range    check (year_of_study between 1 and 7)
);

create table public.teams (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  leader_id  uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint teams_name_len check (char_length(btrim(name)) between 2 and 40)
);

-- Case-insensitive uniqueness, so "Thunder" and "thunder" cannot both exist.
create unique index teams_name_unique on public.teams (lower(btrim(name)));
create index teams_leader_idx on public.teams (leader_id);

create table public.team_members (
  team_id    uuid not null references public.teams(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (team_id, profile_id)
);

-- One team per person, enforced by the database rather than by hope.
create unique index team_members_one_team_per_profile on public.team_members (profile_id);

create table public.team_requests (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid not null references public.teams(id) on delete cascade,
  profile_id   uuid not null references public.profiles(id) on delete cascade,
  kind         public.request_kind   not null,
  status       public.request_status not null default 'pending',
  created_at   timestamptz not null default now(),
  responded_at timestamptz
);

-- At most one live thread between a given team and a given person.
create unique index team_requests_single_pending
  on public.team_requests (team_id, profile_id) where status = 'pending';
create index team_requests_team_idx    on public.team_requests (team_id);
create index team_requests_profile_idx on public.team_requests (profile_id);
