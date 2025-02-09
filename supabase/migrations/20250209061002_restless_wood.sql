-- Add tutorial tracking to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tutorial_completed boolean DEFAULT false;

-- Create function to award welcome bonus
CREATE OR REPLACE FUNCTION award_welcome_bonus(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    available_points = available_points + 5000,
    total_earnings = total_earnings + 5000
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;