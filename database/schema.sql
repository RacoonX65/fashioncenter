-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  bulk_price DECIMAL(10, 2) NOT NULL,
  bulk_threshold INTEGER NOT NULL DEFAULT 5,
  stock INTEGER NOT NULL DEFAULT 0,
  images JSONB,
  sizes JSONB,
  colors JSONB,
  featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  on_sale BOOLEAN DEFAULT false,
  sale_price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  default_shipping_address JSONB,
  default_billing_address JSONB,
  is_guest BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) NOT NULL UNIQUE,
  customer_id UUID REFERENCES customers(id),
  status VARCHAR(50) NOT NULL DEFAULT 'processing',
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  shipping_method VARCHAR(50) NOT NULL,
  shipping_cost DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  courier VARCHAR(50),
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_statuses table for tracking status changes
CREATE TABLE order_statuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create banners table for homepage
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index on products.category
CREATE INDEX idx_products_category ON products(category);

-- Add index on orders.status
CREATE INDEX idx_orders_status ON orders(status);

-- Add index on orders.customer_id
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_customers_modtime
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_banners_modtime
BEFORE UPDATE ON banners
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

