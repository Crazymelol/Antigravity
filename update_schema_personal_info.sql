-- Add personal info columns to athletes table
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS parent_name TEXT;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS parent_email TEXT;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS parent_phone TEXT;

-- Create coaches table
CREATE TABLE IF NOT EXISTS coaches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for coaches
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;

-- Allow access policy
CREATE POLICY "Allow all for development" ON coaches FOR ALL USING (true);
