-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Schedule', 'Food', 'Emergency'))
);

-- Enable Row Level Security
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Allow public read access to announcements
CREATE POLICY "Allow public read access to announcements" 
  ON public.announcements 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to insert announcements (admin check done in app)
CREATE POLICY "Allow authenticated insert to announcements" 
  ON public.announcements 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);
