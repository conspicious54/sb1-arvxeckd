/*
  # Add reviews functionality

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `rating` (integer, 1-5)
      - `content` (text)
      - `helpful_count` (integer)
      - `reply_count` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `reviews` table
    - Add policies for authenticated users to read all reviews
    - Add policies for users to create their own reviews
    - Add policies for users to update their own reviews

  3. Functions
    - Add function to increment helpful count
    - Add function to increment reply count
*/

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL,
  helpful_count integer DEFAULT 0,
  reply_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add constraint to ensure one review per user
  CONSTRAINT one_review_per_user UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read reviews"
  ON public.reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own review"
  ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own review"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment helpful count
CREATE OR REPLACE FUNCTION increment_review_helpful(review_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.reviews
  SET helpful_count = helpful_count + 1
  WHERE id = review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment reply count
CREATE OR REPLACE FUNCTION increment_review_replies(review_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.reviews
  SET reply_count = reply_count + 1
  WHERE id = review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helpful_reviews table to track which users found which reviews helpful
CREATE TABLE IF NOT EXISTS public.helpful_reviews (
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  review_id uuid REFERENCES public.reviews(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, review_id)
);

-- Enable RLS on helpful_reviews
ALTER TABLE public.helpful_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for helpful_reviews
CREATE POLICY "Users can mark reviews as helpful"
  ON public.helpful_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can see which reviews they marked helpful"
  ON public.helpful_reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create review_replies table
CREATE TABLE IF NOT EXISTS public.review_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on review_replies
ALTER TABLE public.review_replies ENABLE ROW LEVEL SECURITY;

-- Create policies for review_replies
CREATE POLICY "Anyone can read replies"
  ON public.review_replies
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create replies"
  ON public.review_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies"
  ON public.review_replies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updated_at on replies
CREATE TRIGGER update_review_replies_updated_at
  BEFORE UPDATE ON public.review_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();