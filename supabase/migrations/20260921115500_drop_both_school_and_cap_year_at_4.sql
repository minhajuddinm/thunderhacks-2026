-- "Both" is no longer offered and years stop at 4. Enforced in the table as
-- well as the form, so a request straight at the API gets the same answer.
-- The enum keeps its 'both' label (Postgres cannot drop enum values); the
-- constraint is what stops it being used.
alter table public.profiles drop constraint if exists profiles_year_range;
alter table public.profiles
  add constraint profiles_year_range check (year_of_study between 1 and 4);

alter table public.profiles drop constraint if exists profiles_school_not_both;
alter table public.profiles
  add constraint profiles_school_not_both check (school <> 'both');
