-- ThunderHacks II is open to anyone, not only Algoma and Sault College
-- students, so the school question needs an answer for everybody else.
-- The value is added on its own because a new enum label cannot be used in
-- the same transaction that creates it.
alter type public.school_choice add value if not exists 'other';
