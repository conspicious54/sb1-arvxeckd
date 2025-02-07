/*
  # Additional Tables for Rewards System

  1. New Tables
    - `offer_completions`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References profiles.id
      - `offer_id` (integer)
      - `offer_name` (text)
      - `points_earned` (integer)
      - `multiplier` (decimal)
      - `completed_at` (timestamptz)
      
    - `redemptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References profiles.id
      - `reward_type` (text)
      - `amount` (decimal)
      - `points_spent` (integer)
      - `status` (text)
      - `created_at` (timestamptz)
      - `processed_at` (timestamptz)
      
    - `referral_earnings`
      - `id` (uuid, primary key)
      - `referrer_id` (uuid) - References profiles.id
      - `referred_id` (uuid) - References profiles.id
      - `points_earned` (integer)
      - `earned_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create offer_completions table
CREATE TABLE IF NOT EXISTS offer_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  offer_id integer NOT NULL,
  offer_name text NOT NULL,
  points_earned integer NOT NULL,
  multiplier decimal(3,1) DEFAULT 1.0,
  completed_at timestamptz DEFAULT now(),
  
  CONSTRAINT positive_points CHECK (points_earned > 0),
  CONSTRAINT valid_multiplier CHECK (multiplier >= 1.0 AND multiplier <= 10.0)
);

-- Create redemptions table
CREATE TABLE IF NOT EXISTS redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reward_type text NOT NULL,
  amount decimal(10,2) NOT NULL,
  points_spent integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  CONSTRAINT positive_amount CHECK (amount > 0),
  CONSTRAINT positive_points CHECK (points_spent > 0)
);

-- Create referral_earnings table
CREATE TABLE IF NOT EXISTS referral_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referred_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  points_earned integer NOT NULL,
  earned_at timestamptz DEFAULT now(),
  
  CONSTRAINT positive_points CHECK (points_earned > 0)
);

-- Enable RLS
ALTER TABLE offer_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;

-- Policies for offer_completions
CREATE POLICY "Users can view own offer completions"
  ON offer_completions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own offer completions"
  ON offer_completions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for redemptions
CREATE POLICY "Users can view own redemptions"
  ON redemptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own redemptions"
  ON redemptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for referral_earnings
CREATE POLICY "Users can view own referral earnings"
  ON referral_earnings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id);

CREATE POLICY "Users can view earnings as referred user"
  ON referral_earnings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = referred_id);

-- Function to update user points after offer completion
CREATE OR REPLACE FUNCTION update_user_points_after_completion()
RETURNS trigger AS $$
BEGIN
  -- Update user's total and available points
  UPDATE profiles
  SET 
    total_earnings = total_earnings + NEW.points_earned,
    available_points = available_points + NEW.points_earned,
    completed_offers = completed_offers + 1,
    last_offer_completion = NEW.completed_at
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating points after offer completion
CREATE TRIGGER after_offer_completion
  AFTER INSERT ON offer_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_points_after_completion();

-- Function to update user points after redemption
CREATE OR REPLACE FUNCTION update_user_points_after_redemption()
RETURNS trigger AS $$
BEGIN
  -- Deduct points from user's available balance
  UPDATE profiles
  SET available_points = available_points - NEW.points_spent
  WHERE id = NEW.user_id
  AND available_points >= NEW.points_spent;
  
  -- If update failed (not enough points), raise exception
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient points for redemption';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating points after redemption
CREATE TRIGGER before_redemption
  BEFORE INSERT ON redemptions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_points_after_redemption();

-- Function to update referrer's earnings
CREATE OR REPLACE FUNCTION update_referral_earnings()
RETURNS trigger AS $$
BEGIN
  -- Update referrer's stats
  UPDATE profiles
  SET 
    referral_earnings = referral_earnings + NEW.points_earned,
    available_points = available_points + NEW.points_earned
  WHERE id = NEW.referrer_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating referral earnings
CREATE TRIGGER after_referral_earning
  AFTER INSERT ON referral_earnings
  FOR EACH ROW
  EXECUTE FUNCTION update_referral_earnings();