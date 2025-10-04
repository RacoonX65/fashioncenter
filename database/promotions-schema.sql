-- ============================================
-- PROMOTIONS & MARKETING SYSTEM
-- Discount Codes, Referrals, Campaigns
-- ============================================

-- 1. DISCOUNT CODES TABLE
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount', 'free_shipping'
  value NUMERIC(10, 2) NOT NULL, -- 10 for 10%, or 50 for R50 off
  description TEXT,
  
  -- Usage limits
  usage_limit INTEGER, -- null = unlimited
  usage_count INTEGER DEFAULT 0,
  per_customer_limit INTEGER DEFAULT 1,
  
  -- Minimum requirements
  minimum_purchase NUMERIC(10, 2), -- null = no minimum
  applicable_to VARCHAR(20) DEFAULT 'all', -- 'all', 'specific_products', 'category'
  applicable_ids TEXT[], -- product IDs or category names
  
  -- Validity
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  
  -- Source tracking
  source VARCHAR(50), -- 'review', 'referral', 'campaign', 'manual'
  campaign_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. DISCOUNT CODE USAGE TABLE
CREATE TABLE discount_code_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discount_code_id UUID REFERENCES discount_codes(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  customer_id UUID,
  customer_email VARCHAR(255) NOT NULL,
  discount_amount NUMERIC(10, 2) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REFERRAL PROGRAM TABLE
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID, -- Customer who refers
  referrer_email VARCHAR(255) NOT NULL,
  referrer_code VARCHAR(50) UNIQUE NOT NULL, -- Unique referral code
  
  referee_id UUID, -- Customer who was referred
  referee_email VARCHAR(255),
  
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'rewarded'
  
  -- Rewards
  referrer_discount_code VARCHAR(50), -- Code given to referrer
  referee_discount_code VARCHAR(50), -- Code given to referee
  
  -- Tracking
  referred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE, -- When referee makes first purchase
  rewarded_at TIMESTAMP WITH TIME ZONE, -- When referrer gets reward
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PROMO CAMPAIGNS TABLE
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- 'flash_sale', 'seasonal', 'clearance', 'bundle', 'bogo'
  
  -- Discount details
  discount_type VARCHAR(20), -- 'percentage', 'fixed_amount', 'bundle_deal'
  discount_value NUMERIC(10, 2),
  
  -- Applicable to
  applies_to VARCHAR(20) DEFAULT 'all', -- 'all', 'category', 'specific_products'
  product_ids TEXT[],
  category_names TEXT[],
  
  -- Campaign period
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  -- Display settings
  banner_image VARCHAR(500),
  banner_text TEXT,
  show_on_homepage BOOLEAN DEFAULT false,
  
  -- Auto-generate codes
  auto_code VARCHAR(50), -- e.g., 'SUMMER25'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. REVIEW REWARDS TABLE
CREATE TABLE review_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  customer_email VARCHAR(255) NOT NULL,
  discount_code VARCHAR(50) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT false
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_discount_codes_code ON discount_codes(code);
CREATE INDEX idx_discount_codes_active ON discount_codes(is_active);
CREATE INDEX idx_discount_codes_expires ON discount_codes(expires_at);
CREATE INDEX idx_discount_code_usage_customer ON discount_code_usage(customer_email);
CREATE INDEX idx_referrals_referrer_code ON referrals(referrer_code);
CREATE INDEX idx_referrals_referrer_email ON referrals(referrer_email);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_campaigns_active ON campaigns(is_active);
CREATE INDEX idx_campaigns_dates ON campaigns(starts_at, ends_at);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update discount code usage count
CREATE OR REPLACE FUNCTION increment_discount_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE discount_codes
  SET usage_count = usage_count + 1
  WHERE id = NEW.discount_code_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_discount_usage
AFTER INSERT ON discount_code_usage
FOR EACH ROW
EXECUTE FUNCTION increment_discount_usage();

-- Auto-deactivate expired codes
CREATE OR REPLACE FUNCTION deactivate_expired_codes()
RETURNS void AS $$
BEGIN
  UPDATE discount_codes
  SET is_active = false
  WHERE expires_at < NOW() AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- Discount code performance
CREATE VIEW discount_performance AS
SELECT 
  dc.code,
  dc.type,
  dc.value,
  dc.usage_count,
  dc.usage_limit,
  COUNT(dcu.id) as total_uses,
  SUM(dcu.discount_amount) as total_discount_given,
  dc.created_at,
  dc.expires_at
FROM discount_codes dc
LEFT JOIN discount_code_usage dcu ON dc.id = dcu.discount_code_id
GROUP BY dc.id;

-- Referral program stats
CREATE VIEW referral_stats AS
SELECT 
  r.referrer_email,
  r.referrer_code,
  COUNT(CASE WHEN r.status = 'pending' THEN 1 END) as pending_referrals,
  COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_referrals,
  COUNT(CASE WHEN r.status = 'rewarded' THEN 1 END) as rewarded_referrals,
  r.created_at as joined_program_at
FROM referrals r
GROUP BY r.referrer_email, r.referrer_code, r.created_at;

-- Campaign performance
CREATE VIEW campaign_performance AS
SELECT 
  c.id,
  c.name,
  c.type,
  c.discount_value,
  c.starts_at,
  c.ends_at,
  COUNT(o.id) as orders_count,
  SUM(o.total) as total_revenue
FROM campaigns c
LEFT JOIN orders o ON o.created_at BETWEEN c.starts_at AND c.ends_at
WHERE c.is_active = true
GROUP BY c.id;

-- ============================================
-- SAMPLE DATA (FOR TESTING)
-- ============================================

-- Welcome discount for new customers
INSERT INTO discount_codes (code, type, value, description, usage_limit, per_customer_limit, minimum_purchase, expires_at, source)
VALUES ('WELCOME10', 'percentage', 10, 'Welcome discount for new customers', NULL, 1, 500, NOW() + INTERVAL '1 year', 'campaign');

-- Free shipping promo
INSERT INTO discount_codes (code, type, value, description, minimum_purchase, expires_at, source)
VALUES ('FREESHIP', 'free_shipping', 0, 'Free shipping on orders over R1000', 1000, NOW() + INTERVAL '6 months', 'campaign');

-- Flash sale
INSERT INTO campaigns (name, description, type, discount_type, discount_value, starts_at, ends_at, show_on_homepage, auto_code)
VALUES (
  'Weekend Flash Sale',
  '25% off everything this weekend only!',
  'flash_sale',
  'percentage',
  25,
  NOW(),
  NOW() + INTERVAL '3 days',
  true,
  'WEEKEND25'
);

