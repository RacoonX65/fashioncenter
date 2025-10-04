-- Add reviews table to your Supabase database
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL,
  order_id UUID REFERENCES orders(id) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create review requests table
CREATE TABLE review_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_email VARCHAR(255) NOT NULL,
  product_id UUID NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reminded_at TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  UNIQUE(order_id, product_id)
);

-- Add indexes for performance
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_review_requests_order_id ON review_requests(order_id);
CREATE INDEX idx_review_requests_completed ON review_requests(completed);

-- Add trigger to update updated_at
CREATE TRIGGER update_reviews_modtime
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create view for product ratings summary
CREATE VIEW product_ratings AS
SELECT 
  product_id,
  COUNT(*) as total_reviews,
  AVG(rating) as average_rating,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
FROM reviews
WHERE status = 'approved'
GROUP BY product_id;
