/*
  # Create offer completions table

  1. New Tables
    - `offer_completions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `offer_id` (integer)
      - `offer_name` (text)
      - `points_earned` (integer)
      - `multiplier` (decimal)
      - `completed_at` (timestamptz)

  2. Security
    - Enable RLS on `offer_completions` table
    - Add policies for authenticated users
*/

-- Create offer_completions table
CREATE TABLE IF NOT EXISTS public.offer_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  offer_id integer NOT NULL,
  offer_name text NOT NULL,
  points_earned integer NOT NULL,
  multiplier decimal(3,1) DEFAULT 1.0,
  completed_at timestamptz DEFAULT now(),
  
  CONSTRAINT positive_points CHECK (points_earned > 0),
  CONSTRAINT valid_multiplier CHECK (multiplier >= 1.0 AND multiplier <= 10.0)
);

-- Enable RLS
ALTER TABLE public.offer_completions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view own offer completions" ON public.offer_completions;
    DROP POLICY IF EXISTS "Users can insert own offer completions" ON public.offer_completions;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- Create policies
CREATE POLICY "Users can view own offer completions"
  ON public.offer_completions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own offer completions"
  ON public.offer_completions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to update user points after offer completion
CREATE OR REPLACE FUNCTION public.update_user_points_after_completion()
RETURNS trigger AS $$
BEGIN
  -- Update user's total and available points
  UPDATE public.profiles
  SET 
    total_earnings = total_earnings + NEW.points_earned,
    available_points = available_points + NEW.points_earned,
    completed_offers = completed_offers + 1,
    last_offer_completion = NEW.completed_at
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS after_offer_completion ON public.offer_completions;

-- Trigger for updating points after offer completion
CREATE TRIGGER after_offer_completion
  AFTER INSERT ON public.offer_completions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_points_after_completion();