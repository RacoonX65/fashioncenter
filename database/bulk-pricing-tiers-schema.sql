-- ============================================
-- BULK PRICING TIERS - Volume Discounts
-- Quantity-based pricing for wholesale
-- ============================================

-- 1. PRODUCT BULK PRICING TABLE
-- Different prices based on quantity purchased
CREATE TABLE product_bulk_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER, -- NULL means unlimited
  discount_percentage NUMERIC(5, 2) NOT NULL,
  fixed_price NUMERIC(10, 2), -- Optional: Set specific price instead of discount
  tier_name VARCHAR(50), -- e.g., "5-9 items", "10-19 items", "20-49 items", "50+ items"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, min_quantity)
);

-- 2. NEW PRODUCT NOTIFICATIONS TABLE
-- Track which wholesale customers were notified about new products
CREATE TABLE wholesale_product_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL,
  wholesale_customer_id UUID REFERENCES wholesale_customers(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) DEFAULT 'new_product', -- 'new_product', 'restock', 'price_drop'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  ordered BOOLEAN DEFAULT FALSE,
  UNIQUE(product_id, wholesale_customer_id, notification_type)
);

-- 3. WHOLESALE BULK ORDERS TABLE
-- Separate from regular orders - for bulk/wholesale purchases
CREATE TABLE wholesale_bulk_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  wholesale_customer_id UUID REFERENCES wholesale_customers(id),
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL, -- Price per item after all discounts
  wholesale_discount_applied NUMERIC(10, 2) NOT NULL, -- Discount from tier (15%, 20%, 25%)
  bulk_discount_applied NUMERIC(10, 2) DEFAULT 0, -- Additional volume discount
  total_discount NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DEFAULT BULK PRICING TIERS
-- Apply these to all products by default
-- ============================================

-- Example: Standard bulk pricing tiers
-- These can be overridden per product

INSERT INTO product_bulk_pricing (product_id, min_quantity, max_quantity, discount_percentage, tier_name) VALUES
-- For demo purposes - apply to a test product
-- In practice, you'll add these when creating products
('00000000-0000-0000-0000-000000000000', 5, 9, 5.00, '5-9 items: Extra 5% OFF'),
('00000000-0000-0000-0000-000000000000', 10, 19, 10.00, '10-19 items: Extra 10% OFF'),
('00000000-0000-0000-0000-000000000000', 20, 49, 15.00, '20-49 items: Extra 15% OFF'),
('00000000-0000-0000-0000-000000000000', 50, NULL, 20.00, '50+ items: Extra 20% OFF');

-- Note: These discounts STACK with wholesale tier discounts!
-- Example: Medium Business (20% OFF) + Buy 20 items (15% extra) = 35% total OFF

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_bulk_pricing_product ON product_bulk_pricing(product_id);
CREATE INDEX idx_bulk_pricing_quantity ON product_bulk_pricing(min_quantity);
CREATE INDEX idx_wholesale_notifications_customer ON wholesale_product_notifications(wholesale_customer_id);
CREATE INDEX idx_wholesale_notifications_product ON wholesale_product_notifications(product_id);
CREATE INDEX idx_wholesale_bulk_items_order ON wholesale_bulk_order_items(order_id);
CREATE INDEX idx_wholesale_bulk_items_customer ON wholesale_bulk_order_items(wholesale_customer_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to calculate bulk price for a product
CREATE OR REPLACE FUNCTION calculate_bulk_price(
  p_product_id UUID,
  p_quantity INTEGER,
  p_base_price NUMERIC(10, 2),
  p_wholesale_discount_percentage NUMERIC(5, 2) DEFAULT 0
)
RETURNS TABLE (
  final_price NUMERIC(10, 2),
  wholesale_discount NUMERIC(10, 2),
  bulk_discount NUMERIC(10, 2),
  total_discount NUMERIC(10, 2),
  savings NUMERIC(10, 2)
) AS $$
DECLARE
  v_bulk_discount_percentage NUMERIC(5, 2) := 0;
  v_wholesale_discount NUMERIC(10, 2);
  v_bulk_discount NUMERIC(10, 2);
  v_total_discount NUMERIC(10, 2);
  v_final_price NUMERIC(10, 2);
  v_savings NUMERIC(10, 2);
BEGIN
  -- Get applicable bulk discount based on quantity
  SELECT discount_percentage INTO v_bulk_discount_percentage
  FROM product_bulk_pricing
  WHERE product_id = p_product_id
    AND p_quantity >= min_quantity
    AND (max_quantity IS NULL OR p_quantity <= max_quantity)
  ORDER BY min_quantity DESC
  LIMIT 1;
  
  -- If no bulk pricing found, default to 0
  IF v_bulk_discount_percentage IS NULL THEN
    v_bulk_discount_percentage := 0;
  END IF;
  
  -- Calculate discounts
  v_wholesale_discount := p_base_price * (p_wholesale_discount_percentage / 100);
  v_bulk_discount := (p_base_price - v_wholesale_discount) * (v_bulk_discount_percentage / 100);
  v_total_discount := v_wholesale_discount + v_bulk_discount;
  v_final_price := p_base_price - v_total_discount;
  v_savings := p_base_price - v_final_price;
  
  RETURN QUERY SELECT 
    v_final_price,
    v_wholesale_discount,
    v_bulk_discount,
    v_total_discount,
    v_savings;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- View: Product notification performance
CREATE VIEW product_notification_stats AS
SELECT 
  wpn.product_id,
  COUNT(DISTINCT wpn.wholesale_customer_id) as customers_notified,
  COUNT(CASE WHEN wpn.opened_at IS NOT NULL THEN 1 END) as emails_opened,
  COUNT(CASE WHEN wpn.clicked_at IS NOT NULL THEN 1 END) as links_clicked,
  COUNT(CASE WHEN wpn.ordered THEN 1 END) as resulted_in_order,
  ROUND(
    COUNT(CASE WHEN wpn.opened_at IS NOT NULL THEN 1 END)::NUMERIC / 
    NULLIF(COUNT(DISTINCT wpn.wholesale_customer_id), 0) * 100, 2
  ) as open_rate,
  ROUND(
    COUNT(CASE WHEN wpn.ordered THEN 1 END)::NUMERIC / 
    NULLIF(COUNT(DISTINCT wpn.wholesale_customer_id), 0) * 100, 2
  ) as conversion_rate
FROM wholesale_product_notifications wpn
GROUP BY wpn.product_id;

-- View: Bulk pricing effectiveness
CREATE VIEW bulk_pricing_performance AS
SELECT 
  wboi.product_id,
  COUNT(*) as orders_count,
  SUM(wboi.quantity) as total_quantity_sold,
  AVG(wboi.quantity) as avg_quantity_per_order,
  SUM(wboi.wholesale_discount_applied + wboi.bulk_discount_applied) as total_discounts_given,
  SUM(wboi.subtotal) as total_revenue
FROM wholesale_bulk_order_items wboi
GROUP BY wboi.product_id;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bulk_pricing_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_bulk_pricing_modtime
BEFORE UPDATE ON product_bulk_pricing
FOR EACH ROW
EXECUTE FUNCTION update_bulk_pricing_timestamp();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE product_bulk_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE wholesale_product_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wholesale_bulk_order_items ENABLE ROW LEVEL SECURITY;

-- Public can view bulk pricing
CREATE POLICY "Bulk pricing is viewable by everyone" ON product_bulk_pricing
  FOR SELECT USING (true);

-- Wholesale customers can view their notifications
CREATE POLICY "Customers can view their notifications" ON wholesale_product_notifications
  FOR SELECT USING (
    wholesale_customer_id IN (
      SELECT id FROM wholesale_customers 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Wholesale customers can view their bulk orders
CREATE POLICY "Customers can view their bulk orders" ON wholesale_bulk_order_items
  FOR SELECT USING (
    wholesale_customer_id IN (
      SELECT id FROM wholesale_customers 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- ============================================
-- EXAMPLE QUERIES
-- ============================================

-- Get bulk pricing for a product
-- SELECT * FROM product_bulk_pricing WHERE product_id = 'your-product-id' ORDER BY min_quantity;

-- Calculate price for 15 items
-- SELECT * FROM calculate_bulk_price('product-id', 15, 100.00, 20);

-- Get notification stats
-- SELECT * FROM product_notification_stats WHERE product_id = 'your-product-id';

-- Get bulk pricing performance
-- SELECT * FROM bulk_pricing_performance ORDER BY total_revenue DESC;

