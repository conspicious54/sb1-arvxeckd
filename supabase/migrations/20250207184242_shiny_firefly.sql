/*
  # User System Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users
      - `email` (text, unique)
      - `total_earnings` (integer) - Total points earned
      - `available_points` (integer) - Current available points
      - `completed_offers` (integer) - Number of completed offers
      - `total_referrals` (integer) - Number of successful referrals
      - `pending_referrals` (integer) - Number of pending referrals
      - `referral_earnings` (integer) - Points earned from referrals
      - `referral_code` (text, unique) - Unique referral code
      - `referred_by` (uuid) - References profiles.id
      - `streak_count` (integer) - Current daily streak
      - `best_streak` (integer) - Best daily streak achieved
      - `last_offer_completion` (timestamptz) - Last offer completion timestamp
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  total_earnings integer DEFAULT 0,
  available_points integer DEFAULT 0,
  completed_offers integer DEFAULT 0,
  total_referrals integer DEFAULT 0,
  pending_referrals integer DEFAULT 0,
  referral_earnings integer DEFAULT 0,
  referral_code text UNIQUE,
  referred_by uuid REFERENCES profiles(id),
  streak_count integer DEFAULT 0,
  best_streak integer DEFAULT 0,
  last_offer_completion timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    encode(sha256(NEW.email::bytea || random()::text::bytea), 'hex')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();