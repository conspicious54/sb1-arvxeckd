/*
  # Add New Gift Card Rewards
  
  1. New Rewards
    - Best Buy Gift Card
    - Walmart Gift Card
    - PlayStation Store Card
    - Xbox Gift Card
    - Nintendo eShop Card
  
  2. Options
    - Standard denominations: $25, $50, $100
    - Special gaming cards: $10, $20, $60 options
    - Double points for Best Buy (featured)
*/

-- Add new gift cards
INSERT INTO public.rewards (name, description, image_url, category, popular, featured, new, coming_soon)
VALUES
  (
    'Best Buy Gift Card',
    'Shop electronics, games, and more at Best Buy',
    'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1000',
    'giftcard',
    true,
    true,
    false,
    false
  ),
  (
    'Walmart Gift Card',
    'Redeem at Walmart stores or online',
    'https://images.unsplash.com/photo-1608991156162-3c55b3ff2379?auto=format&fit=crop&q=80&w=1000',
    'giftcard',
    true,
    false,
    false,
    false
  ),
  (
    'PlayStation Store Card',
    'For games, DLC, and subscriptions',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=1000',
    'gaming',
    false,
    false,
    true,
    false
  ),
  (
    'Xbox Gift Card',
    'For games and content on Xbox and Windows',
    'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&q=80&w=1000',
    'gaming',
    false,
    false,
    true,
    false
  ),
  (
    'Nintendo eShop Card',
    'For Nintendo Switch games and content',
    'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=80&w=1000',
    'gaming',
    false,
    false,
    true,
    false
  );

-- Add standard options for retail gift cards
INSERT INTO public.reward_options (reward_id, amount, points, double_points, limited_time)
SELECT 
  id as reward_id,
  unnest(ARRAY[25, 50, 100]) as amount,
  unnest(ARRAY[25000, 50000, 100000]) as points,
  CASE 
    WHEN name = 'Best Buy Gift Card' THEN true 
    ELSE false 
  END as double_points,
  CASE 
    WHEN name = 'Best Buy Gift Card' THEN true 
    ELSE false 
  END as limited_time
FROM public.rewards
WHERE name IN ('Best Buy Gift Card', 'Walmart Gift Card');

-- Add gaming-specific denominations
INSERT INTO public.reward_options (reward_id, amount, points, double_points, limited_time)
SELECT 
  id as reward_id,
  unnest(ARRAY[10, 20, 60]) as amount,
  unnest(ARRAY[10000, 20000, 60000]) as points,
  false as double_points,
  false as limited_time
FROM public.rewards
WHERE name IN ('PlayStation Store Card', 'Xbox Gift Card', 'Nintendo eShop Card');