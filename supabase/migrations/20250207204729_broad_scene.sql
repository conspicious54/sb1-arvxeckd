/*
  # Rewards Schema Update

  1. Changes
    - Safely drops existing triggers and policies
    - Creates/updates rewards and reward_options tables
    - Sets up RLS and policies
    - Inserts initial data

  2. Security
    - Enables RLS on both tables
    - Adds policies for authenticated users to read rewards and options
*/

-- Drop existing triggers and policies if they exist
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_rewards_updated_at ON public.rewards;
    DROP TRIGGER IF EXISTS update_reward_options_updated_at ON public.reward_options;
    DROP POLICY IF EXISTS "Authenticated users can read rewards" ON public.rewards;
    DROP POLICY IF EXISTS "Authenticated users can read reward options" ON public.reward_options;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- Create rewards table
CREATE TABLE IF NOT EXISTS public.rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  popular boolean DEFAULT false,
  featured boolean DEFAULT false,
  new boolean DEFAULT false,
  coming_soon boolean DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT valid_category CHECK (category IN ('giftcard', 'cash', 'gaming', 'travel'))
);

-- Create reward options table
CREATE TABLE IF NOT EXISTS public.reward_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id uuid REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  points integer NOT NULL,
  double_points boolean DEFAULT false,
  limited_time boolean DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT positive_amount CHECK (amount > 0),
  CONSTRAINT positive_points CHECK (points > 0)
);

-- Enable RLS
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_options ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read rewards"
  ON public.rewards
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read reward options"
  ON public.reward_options
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_reward_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_reward_updated_at();

CREATE TRIGGER update_reward_options_updated_at
  BEFORE UPDATE ON public.reward_options
  FOR EACH ROW
  EXECUTE FUNCTION update_reward_updated_at();

-- Insert initial rewards data
INSERT INTO public.rewards (name, description, image_url, category, popular, featured, new, coming_soon)
VALUES
  ('Amazon Gift Card', 'Redeem for Amazon.com credit', 'https://m.media-amazon.com/images/I/31x451MtRuL.jpg', 'giftcard', true, true, false, false),
  ('Visa Prepaid Card', 'Use anywhere Visa is accepted', 'https://www.giftcards.com/content/dam/bhn/live/nam/us/en/catalog-assets/product-images/07675022697/virtual-visa-gift-card.png', 'giftcard', false, true, false, false),
  ('PayPal Cash', 'Transfer directly to your PayPal account', 'https://www.paypalobjects.com/marketing/web23/us/en/ppe/homepage-consumer/meta_size-all_v1.jpg', 'cash', false, false, false, false),
  ('Steam Wallet', 'Add funds to your Steam account', 'https://community.fastly.steamstatic.com/public/shared/images/responsive/steam_share_image.jpg', 'gaming', false, false, true, false),
  ('Apple App Store', 'For apps, games, and more', 'https://developer.apple.com/news/images/og/app-store-og.png', 'giftcard', false, false, false, false),
  ('Target Gift Card', 'Shop at Target stores or online', 'https://static.nc-myus.com/images/pub/www/uploads/image/ef10804c9dc541ea82b4e1e02017dd65/TG1.png', 'giftcard', false, false, false, false),
  ('Airbnb Gift Card', 'Book your next stay anywhere', 'https://smdp.com/wp-content/uploads/sites/21/2024/07/Airbnb.jpeg', 'travel', false, false, false, true),
  ('Uber Cash', 'For rides and Uber Eats', 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/45/02/11/450211a0-182c-45b8-e22f-34dece34aa1d/AppIcon-0-0-1x_U007emarketing-0-8-0-sRGB-85-220.png/1200x630wa.png', 'giftcard', false, false, true, false);

-- Insert reward options
INSERT INTO public.reward_options (reward_id, amount, points, double_points, limited_time)
SELECT 
  id as reward_id,
  unnest(ARRAY[25, 50, 100]) as amount,
  unnest(ARRAY[25000, 50000, 100000]) as points,
  CASE WHEN featured THEN true ELSE false END as double_points,
  CASE WHEN featured THEN true ELSE false END as limited_time
FROM public.rewards
WHERE NOT coming_soon;

-- Add some special options for specific rewards
INSERT INTO public.reward_options (reward_id, amount, points, double_points, limited_time)
SELECT 
  id,
  15,
  15000,
  false,
  false
FROM public.rewards
WHERE name = 'Apple App Store';