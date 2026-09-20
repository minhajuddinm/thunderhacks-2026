-- The March 2026 login accounts are removed now that the two snapshot tables
-- above hold the record. Those snapshots have no foreign keys, so nothing
-- here touches them.
--
-- This cascades to archive_march_2026.profiles and, through it, to
-- archive_march_2026.join_requests. Both were copied flat first. The teams
-- table survives with its owner_id set to null.
--
-- Run only after confirming both snapshots are populated.
delete from auth.users;
