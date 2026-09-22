-- The phone migration added a defaulted argument, which creates a second
-- function rather than replacing the first. Two candidates make a call with
-- the old argument list ambiguous, so the superseded ones go.
drop function if exists public.complete_registration(text, text, smallint, public.school_choice, text, text, boolean);
drop function if exists public.complete_event_details(text, boolean);
