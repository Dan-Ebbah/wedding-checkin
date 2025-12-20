-- Wedding Guest Check-in Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Create the guests table
CREATE TABLE IF NOT EXISTS guests (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  table_number TEXT DEFAULT 'Unassigned',
  checked_in BOOLEAN DEFAULT FALSE,
  vip BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(name);
CREATE INDEX IF NOT EXISTS idx_guests_checked_in ON guests(checked_in);
CREATE INDEX IF NOT EXISTS idx_guests_vip ON guests(vip);

-- Enable Row Level Security (RLS)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust for your security needs)
-- For a public guest check-in app, you might want to restrict this
CREATE POLICY "Allow all operations on guests" ON guests
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Insert sample data
INSERT INTO guests (name, table_number, checked_in, vip) VALUES
  ('Lady Sarah Montgomery', '1', true, true),
  ('Mr. Michael Chen', '2', false, false),
  ('Countess Emily Davis', '1', false, true),
  ('Lord James Wilson', '3', true, true),
  ('Ms. Olivia Brown', '2', false, false),
  ('Duke of Cambridge', '1', false, true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
