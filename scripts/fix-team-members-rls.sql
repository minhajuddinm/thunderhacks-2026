-- Drop the restrictive RLS policy and replace with a public read policy
DROP POLICY IF EXISTS "team_members_select_for_team_members" ON team_members;
DROP POLICY IF EXISTS "Allow public read access to team_members" ON team_members;

-- Allow anyone to view team members (for browsing teams)
CREATE POLICY "Allow public read access to team_members" 
ON team_members FOR SELECT 
USING (true);
