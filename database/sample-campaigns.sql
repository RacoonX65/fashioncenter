-- ============================================
-- SAMPLE MARKETING CAMPAIGNS & DISCOUNT CODES
-- Run this to get started with pre-built campaigns!
-- ============================================

-- 1. WELCOME DISCOUNT (Always Active)
INSERT INTO discount_codes (code, type, value, description, per_customer_limit, minimum_purchase, expires_at, source, is_active)
VALUES 
('WELCOME10', 'percentage', 10, '🎉 Welcome! 10% OFF your first order', 1, 500, NOW() + INTERVAL '1 year', 'campaign', true);

-- 2. FREE SHIPPING (Always Active)
INSERT INTO discount_codes (code, type, value, description, minimum_purchase, expires_at, source, is_active)
VALUES 
('FREESHIP', 'free_shipping', 0, '🚚 FREE Shipping on orders over R1000', 1000, NOW() + INTERVAL '6 months', 'campaign', true);

-- 3. BULK ORDER DISCOUNT
INSERT INTO discount_codes (code, type, value, description, minimum_purchase, expires_at, source, is_active)
VALUES 
('BULK20', 'percentage', 20, '💰 20% OFF Bulk Orders (5+ items)', 3000, NOW() + INTERVAL '1 year', 'campaign', true);

-- 4. WEEKEND FLASH SALE
INSERT INTO campaigns (
  name, description, type, 
  discount_type, discount_value, 
  applies_to, starts_at, ends_at, 
  show_on_homepage, auto_code, is_active
) VALUES (
  'Weekend Flash Sale', 
  '⚡ 30% OFF EVERYTHING! This weekend only!', 
  'flash_sale',
  'percentage', 
  30,
  'all', 
  NOW(), 
  NOW() + INTERVAL '3 days',
  true, 
  'WEEKEND30', 
  true
);

-- Create the discount code for Weekend Flash Sale
INSERT INTO discount_codes (code, type, value, description, expires_at, source, is_active)
VALUES 
('WEEKEND30', 'percentage', 30, '⚡ Weekend Flash Sale - 30% OFF Everything!', NOW() + INTERVAL '3 days', 'campaign', true);

-- 5. SPRING COLLECTION
INSERT INTO campaigns (
  name, description, type, 
  discount_type, discount_value, 
  applies_to, starts_at, ends_at, 
  show_on_homepage, auto_code, is_active
) VALUES (
  'Spring Collection 2025', 
  '🌸 New Spring Arrivals - 25% OFF!', 
  'seasonal',
  'percentage', 
  25,
  'category', 
  NOW(), 
  NOW() + INTERVAL '30 days',
  true, 
  'SPRING25', 
  true
);

-- Create the discount code for Spring Collection
INSERT INTO discount_codes (code, type, value, description, expires_at, source, is_active)
VALUES 
('SPRING25', 'percentage', 25, '🌸 Spring Collection - 25% OFF New Arrivals!', NOW() + INTERVAL '30 days', 'campaign', true);

-- 6. WINTER CLEARANCE
INSERT INTO campaigns (
  name, description, type, 
  discount_type, discount_value, 
  applies_to, starts_at, ends_at, 
  show_on_homepage, auto_code, is_active
) VALUES (
  'Winter Clearance', 
  '❄️ FINAL CLEARANCE! Up to 50% OFF Winter Items', 
  'clearance',
  'percentage', 
  50,
  'category', 
  NOW(), 
  NOW() + INTERVAL '14 days',
  true, 
  'WINTER50', 
  true
);

-- Create the discount code for Winter Clearance
INSERT INTO discount_codes (code, type, value, description, expires_at, source, is_active)
VALUES 
('WINTER50', 'percentage', 50, '❄️ Winter Clearance - 50% OFF!', NOW() + INTERVAL '14 days', 'campaign', true);

-- 7. SOCIAL MEDIA PROMOS
INSERT INTO discount_codes (code, type, value, description, per_customer_limit, expires_at, source, is_active)
VALUES 
('INSTA25', 'percentage', 25, '📸 Instagram Exclusive - 25% OFF', 1, NOW() + INTERVAL '7 days', 'campaign', true),
('TIKTOK20', 'percentage', 20, '🎵 TikTok Special - 20% OFF', 1, NOW() + INTERVAL '7 days', 'campaign', true),
('FB15', 'percentage', 15, '👍 Facebook Friends - 15% OFF', 1, NOW() + INTERVAL '7 days', 'campaign', true);

-- 8. VIP CUSTOMER REWARDS (For testing)
INSERT INTO discount_codes (code, type, value, description, per_customer_limit, expires_at, source, is_active)
VALUES 
('VIP15', 'percentage', 15, '⭐ VIP Customer - 15% OFF Always!', NULL, NULL, 'manual', true),
('VIP20', 'percentage', 20, '💎 VIP Gold - 20% OFF Always!', NULL, NULL, 'manual', true);

-- 9. BOGO CAMPAIGN (Buy One Get One)
INSERT INTO campaigns (
  name, description, type, 
  discount_type, discount_value, 
  applies_to, starts_at, ends_at, 
  show_on_homepage, auto_code, is_active
) VALUES (
  'BOGO Jeans Sale', 
  '👖 Buy 2 Jeans, Get 50% OFF 2nd Pair!', 
  'bogo',
  'percentage', 
  50,
  'category', 
  NOW(), 
  NOW() + INTERVAL '7 days',
  true, 
  'BOGOJEANS', 
  true
);

-- Create the discount code for BOGO
INSERT INTO discount_codes (code, type, value, description, expires_at, source, is_active)
VALUES 
('BOGOJEANS', 'percentage', 50, '👖 BOGO Jeans - 50% OFF 2nd Pair!', NOW() + INTERVAL '7 days', 'campaign', true);

-- 10. PAYDAY SPECIAL (Monthly Recurring)
INSERT INTO campaigns (
  name, description, type, 
  discount_type, discount_value, 
  applies_to, starts_at, ends_at, 
  show_on_homepage, auto_code, is_active
) VALUES (
  'Payday Special', 
  '💰 Payday Treat - 20% OFF Everything!', 
  'flash_sale',
  'percentage', 
  20,
  'all', 
  NOW(), 
  NOW() + INTERVAL '5 days',
  true, 
  'PAYDAY20', 
  true
);

-- Create the discount code for Payday
INSERT INTO discount_codes (code, type, value, description, expires_at, source, is_active)
VALUES 
('PAYDAY20', 'percentage', 20, '💰 Payday Special - 20% OFF!', NOW() + INTERVAL '5 days', 'campaign', true);

-- ============================================
-- ANALYTICS: View campaign performance
-- ============================================

-- See all active campaigns
SELECT * FROM campaigns WHERE is_active = true AND starts_at <= NOW() AND ends_at >= NOW();

-- See all active discount codes
SELECT code, type, value, usage_count, description FROM discount_codes WHERE is_active = true;

-- Top performing codes
SELECT 
  dc.code, 
  dc.usage_count,
  COUNT(dcu.id) as total_uses,
  SUM(dcu.discount_amount) as total_discount_given
FROM discount_codes dc
LEFT JOIN discount_code_usage dcu ON dc.id = dcu.discount_code_id
GROUP BY dc.id
ORDER BY dc.usage_count DESC
LIMIT 10;

