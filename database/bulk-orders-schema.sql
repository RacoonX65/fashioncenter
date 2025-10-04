-- ============================================
-- BULK ORDER / WHOLESALE SYSTEM
-- Small Business, Medium Business, Resellers
-- ============================================

-- 1. BULK ORDER TIERS TABLE
CREATE TABLE bulk_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  discount_percentage INTEGER NOT NULL,
  minimum_items INTEGER NOT NULL,
  maximum_items INTEGER,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tiers
INSERT INTO bulk_tiers (name, discount_percentage, minimum_items, maximum_items, description) VALUES
('Small Business', 15, 5, 19, '15% OFF for orders of 5-19 items. Perfect for small boutiques and startups.'),
('Medium Business', 20, 20, 49, '20% OFF for orders of 20-49 items. Ideal for growing businesses and retailers.'),
('Reseller', 25, 50, NULL, '25% OFF for orders of 50+ items. Exclusive pricing for resellers and wholesalers.');

-- 2. BULK ORDER REQUESTS TABLE
CREATE TABLE bulk_order_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier_id UUID REFERENCES bulk_tiers(id) NOT NULL,
  
  -- Business Information
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100), -- 'boutique', 'online_store', 'retail_shop', 'reseller', 'other'
  business_registration VARCHAR(100), -- Optional registration number
  tax_number VARCHAR(100), -- VAT number
  
  -- Contact Information
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  
  -- Address
  business_address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100),
  postal_code VARCHAR(20),
  
  -- Additional Info
  estimated_monthly_orders INTEGER,
  product_categories TEXT[], -- What they want to buy
  how_did_you_hear VARCHAR(255),
  additional_notes TEXT,
  
  -- Status & Approval
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Generated wholesale code
  wholesale_code VARCHAR(50) UNIQUE,
  code_generated_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. WHOLESALE CUSTOMERS TABLE
CREATE TABLE wholesale_customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bulk_request_id UUID REFERENCES bulk_order_requests(id),
  tier_id UUID REFERENCES bulk_tiers(id) NOT NULL,
  
  business_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  
  wholesale_code VARCHAR(50) UNIQUE NOT NULL,
  discount_percentage INTEGER NOT NULL,
  
  -- Usage tracking
  total_orders INTEGER DEFAULT 0,
  total_revenue NUMERIC(10, 2) DEFAULT 0,
  last_order_date TIMESTAMP WITH TIME ZONE,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. WHOLESALE ORDER TRACKING
CREATE TABLE wholesale_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wholesale_customer_id UUID REFERENCES wholesale_customers(id) NOT NULL,
  order_id UUID REFERENCES orders(id) NOT NULL,
  items_count INTEGER NOT NULL,
  original_total NUMERIC(10, 2) NOT NULL,
  discount_applied NUMERIC(10, 2) NOT NULL,
  final_total NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_bulk_requests_status ON bulk_order_requests(status);
CREATE INDEX idx_bulk_requests_email ON bulk_order_requests(email);
CREATE INDEX idx_wholesale_customers_code ON wholesale_customers(wholesale_code);
CREATE INDEX idx_wholesale_customers_email ON wholesale_customers(email);
CREATE INDEX idx_wholesale_orders_customer ON wholesale_orders(wholesale_customer_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update wholesale customer stats when order placed
CREATE OR REPLACE FUNCTION update_wholesale_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE wholesale_customers
  SET 
    total_orders = total_orders + 1,
    total_revenue = total_revenue + NEW.final_total,
    last_order_date = NEW.created_at
  WHERE id = NEW.wholesale_customer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_wholesale_order_insert
AFTER INSERT ON wholesale_orders
FOR EACH ROW
EXECUTE FUNCTION update_wholesale_customer_stats();

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- Bulk request statistics
CREATE VIEW bulk_request_stats AS
SELECT 
  bt.name as tier_name,
  COUNT(bor.id) as total_requests,
  COUNT(CASE WHEN bor.status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN bor.status = 'approved' THEN 1 END) as approved,
  COUNT(CASE WHEN bor.status = 'rejected' THEN 1 END) as rejected,
  AVG(EXTRACT(EPOCH FROM (bor.approved_at - bor.created_at))/3600) as avg_approval_hours
FROM bulk_tiers bt
LEFT JOIN bulk_order_requests bor ON bt.id = bor.tier_id
GROUP BY bt.id, bt.name;

-- Wholesale customer performance
CREATE VIEW wholesale_performance AS
SELECT 
  wc.business_name,
  wc.email,
  bt.name as tier,
  wc.total_orders,
  wc.total_revenue,
  wc.last_order_date,
  EXTRACT(EPOCH FROM (NOW() - wc.created_at))/86400 as days_active
FROM wholesale_customers wc
JOIN bulk_tiers bt ON wc.tier_id = bt.id
ORDER BY wc.total_revenue DESC;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE bulk_order_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE wholesale_customers ENABLE ROW LEVEL SECURITY;

-- Public can submit requests
CREATE POLICY "Anyone can submit bulk order requests" ON bulk_order_requests
  FOR INSERT WITH CHECK (true);

-- Only own requests visible
CREATE POLICY "Users can view their own requests" ON bulk_order_requests
  FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Wholesale customers can view their own info
CREATE POLICY "Wholesale customers can view their info" ON wholesale_customers
  FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

