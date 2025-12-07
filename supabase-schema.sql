-- ============================================
-- ANTIGRAVITY FENCING APP - DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CLUBS TABLE (Multi-tenancy)
-- ============================================
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ATHLETES TABLE
-- ============================================
CREATE TABLE athletes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  weapon TEXT NOT NULL CHECK (weapon IN ('Foil', 'Epee', 'Sabre')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COMPETITIONS TABLE
-- ============================================
CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  weapon TEXT NOT NULL,
  organizer TEXT,
  registration_closes DATE,
  map_url TEXT,
  events JSONB DEFAULT '[]',
  preregistrants JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  present BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(athlete_id, date)
);

-- ============================================
-- WELLNESS TABLE
-- ============================================
CREATE TABLE wellness (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sleep INTEGER CHECK (sleep BETWEEN 1 AND 10),
  fatigue INTEGER CHECK (fatigue BETWEEN 1 AND 10),
  soreness INTEGER CHECK (soreness BETWEEN 1 AND 10),
  stress INTEGER CHECK (stress BETWEEN 1 AND 10),
  mood INTEGER CHECK (mood BETWEEN 1 AND 10),
  avg DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(athlete_id, date)
);

-- ============================================
-- WORKLOAD TABLE
-- ============================================
CREATE TABLE workload (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  activity TEXT NOT NULL,
  duration INTEGER NOT NULL,
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  load INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ATHLETE STATUS TABLE
-- ============================================
CREATE TABLE athlete_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Injured', 'Resting', 'Inactive')),
  note TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(athlete_id)
);

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  author TEXT DEFAULT 'Coach',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- REFEREES TABLE
-- ============================================
CREATE TABLE referees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Regional', 'National', 'FIE')),
  email TEXT,
  phone TEXT,
  weapons TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INVENTORY TABLE
-- ============================================
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size TEXT,
  condition TEXT CHECK (condition IN ('Excellent', 'Good', 'Fair', 'Needs Repair')),
  notes TEXT,
  assigned_to UUID REFERENCES athletes(id),
  assigned_at TIMESTAMP WITH TIME ZONE,
  returned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LESSON BOOKINGS TABLE
-- ============================================
CREATE TABLE lesson_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL,
  focus TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INSERT DEFAULT CLUB
-- ============================================
INSERT INTO clubs (name, location) 
VALUES ('Default Club', 'Athens, Greece')
RETURNING id;

-- Save the club ID from above, you'll need it!

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness ENABLE ROW LEVEL SECURITY;
ALTER TABLE workload ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE referees ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_bookings ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (we'll add proper auth later)
CREATE POLICY "Allow all for development" ON athletes FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON competitions FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON attendance FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON wellness FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON workload FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON athlete_status FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON announcements FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON referees FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON inventory FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON lesson_bookings FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON clubs FOR ALL USING (true);
