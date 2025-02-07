/*
  # Clean up duplicate reward options

  1. Changes
    - Remove duplicate reward options for Visa, Steam, Target, and PayPal cards
    - Keep only one entry per reward_id/amount combination
    - Preserves the entry with the lowest ID (first created)

  2. Affected Tables
    - reward_options
*/

-- Delete duplicate reward options while keeping the first entry for each reward_id/amount combination
DELETE FROM public.reward_options
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY reward_id, amount
             ORDER BY created_at ASC
           ) as row_num
    FROM public.reward_options
    WHERE reward_id IN (
      SELECT id 
      FROM public.rewards 
      WHERE name IN ('Visa Prepaid Card', 'Steam Wallet', 'Target Gift Card', 'PayPal Cash')
    )
  ) t
  WHERE t.row_num > 1
);