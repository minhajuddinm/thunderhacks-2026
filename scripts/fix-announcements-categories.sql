-- Drop the existing constraint and add a new one with correct categories
ALTER TABLE public.announcements DROP CONSTRAINT IF EXISTS announcements_category_check;
ALTER TABLE public.announcements ADD CONSTRAINT announcements_category_check 
  CHECK (category IN ('general', 'update', 'urgent', 'event'));
