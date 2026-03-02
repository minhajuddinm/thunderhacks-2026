-- Allow anyone to read profile data needed for team member display
-- Drop existing select policy if it exists and recreate with proper permissions
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Public read access to profiles for teams" ON profiles;

-- Create a new policy that allows reading basic profile info for team display
CREATE POLICY "Public read access to profiles for teams"
ON profiles
FOR SELECT
USING (true);
