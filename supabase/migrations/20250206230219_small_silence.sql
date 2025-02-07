/*
  # Create conversions tracking table

  1. New Tables
    - `conversions`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `offer_id` (integer)
      - `offer_name` (text)
      - `payout` (decimal)
      - `ip` (text)
      - `affiliate_id` (text)
      - `source` (text)
      - `aff_sub4` (text) - For storing user email or other custom data
      - `aff_sub5` (text) - For additional custom tracking data
  
  2. Security
    - Enable RLS on `conversions` table
    - Add policy for authenticated users to read their own conversions
*/

CREATE TABLE IF NOT EXISTS conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  offer_id integer NOT NULL,
  offer_name text,
  payout decimal(10,2),
  ip text,
  affiliate_id text,
  source text,
  aff_sub4 text,
  aff_sub5 text
);

ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own conversions"
  ON conversions
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = affiliate_id);