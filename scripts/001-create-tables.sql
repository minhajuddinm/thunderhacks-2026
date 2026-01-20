-- Thunder Hacks Database Schema

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  lead_name VARCHAR(100) NOT NULL,
  lead_email VARCHAR(255) NOT NULL UNIQUE,
  lead_program VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table (includes the lead as a member)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  program VARCHAR(100) NOT NULL,
  is_lead BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual registrations (people without a team)
CREATE TABLE individuals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  program VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Join requests table
CREATE TABLE join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  individual_id UUID REFERENCES individuals(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, individual_id)
);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE individuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can view teams)
CREATE POLICY "Teams are viewable by everyone" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Team members are viewable by everyone" ON team_members
  FOR SELECT USING (true);

CREATE POLICY "Individuals are viewable by everyone" ON individuals
  FOR SELECT USING (true);

CREATE POLICY "Join requests are viewable by everyone" ON join_requests
  FOR SELECT USING (true);

-- Create policies for public insert access (for registration)
CREATE POLICY "Anyone can create a team" ON teams
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can add team members" ON team_members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can register as individual" ON individuals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create join requests" ON join_requests
  FOR INSERT WITH CHECK (true);

-- Create policies for update access
CREATE POLICY "Anyone can update join requests" ON join_requests
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete individuals" ON individuals
  FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_join_requests_team_id ON join_requests(team_id);
CREATE INDEX idx_join_requests_individual_id ON join_requests(individual_id);
CREATE INDEX idx_join_requests_status ON join_requests(status);
