-- Updated orders table for checkout flow
-- Run this to update your existing orders table with new fields

-- Add new columns if they don't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_reference VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS shipping_address TEXT,
ADD COLUMN IF NOT EXISTS delivery_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS order_items JSONB,
ADD COLUMN IF NOT EXISTS shipping_fee DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS tax DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS order_notes TEXT,
ADD COLUMN IF NOT EXISTS paystack_reference VARCHAR(100),
ADD COLUMN IF NOT EXISTS paystack_access_code VARCHAR(100),
ADD COLUMN IF NOT EXISTS paystack_payment_data JSONB,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Create index on order_reference for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(order_reference);

-- Create index on paystack_reference
CREATE INDEX IF NOT EXISTS idx_orders_paystack_ref ON orders(paystack_reference);

-- Create index on customer_email for order lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Add CHECK constraint for status
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'));

-- Add CHECK constraint for payment_status
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check 
CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));

-- Create a view for recent orders
CREATE OR REPLACE VIEW recent_orders AS
SELECT 
  id,
  order_reference,
  customer_name,
  customer_email,
  customer_phone,
  status,
  payment_status,
  total,
  created_at,
  delivery_method
FROM orders
ORDER BY created_at DESC;

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert orders (for guest checkout)
CREATE POLICY "Allow public insert on orders" ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow users to read their own orders
CREATE POLICY "Users can read their own orders" ON orders
  FOR SELECT
  TO authenticated
  USING (customer_email = auth.jwt() ->> 'email');

-- Policy: Allow service role full access
CREATE POLICY "Service role has full access" ON orders
  FOR ALL
  TO service_role
  USING (true);

-- Comment the table and important columns
COMMENT ON TABLE orders IS 'Stores customer orders from checkout';
COMMENT ON COLUMN orders.order_reference IS 'Unique order reference shown to customers (e.g., FC-1234567890-ABC)';
COMMENT ON COLUMN orders.paystack_reference IS 'PayStack transaction reference for payment verification';
COMMENT ON COLUMN orders.order_items IS 'JSON array of ordered products with quantity, size, color, etc.';
COMMENT ON COLUMN orders.shipping_address IS 'Full shipping address as text';
COMMENT ON COLUMN orders.delivery_method IS 'Delivery method chosen (courierGuy or pepPexie)';

