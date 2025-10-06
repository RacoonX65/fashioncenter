-- Seed sample products for FashionCenter
-- Run this after creating the main schema

-- Clear existing products (optional - comment out if you have real data)
-- TRUNCATE products CASCADE;

-- Insert sample products
INSERT INTO products (name, description, category, price, sale_price, on_sale, bulk_price, bulk_threshold, stock, sizes, colors, featured, is_new) VALUES
-- Women's Collection
('Women''s Casual Crop Top', 'Trendy crop top perfect for summer. Made from soft cotton blend with a comfortable fit. Pairs well with high-waisted jeans or skirts.', 'Women', 299.99, 199.99, true, 180.00, 5, 50, 
 '["XS", "S", "M", "L", "XL"]'::jsonb,
 '[{"name":"White","hex":"#FFFFFF"},{"name":"Black","hex":"#000000"},{"name":"Pink","hex":"#FFC0CB"},{"name":"Blue","hex":"#87CEEB"}]'::jsonb,
 true, true),

('Women''s Summer Dress', 'Beautiful flowing summer dress with floral patterns. Perfect for casual outings or beach days. Light and breathable fabric.', 'Women', 499.99, null, false, 400.00, 5, 35,
 '["XS", "S", "M", "L", "XL"]'::jsonb,
 '[{"name":"Floral Blue","hex":"#4682B4"},{"name":"Floral Pink","hex":"#FFB6C1"},{"name":"Yellow","hex":"#FFD700"}]'::jsonb,
 true, true),

('Women''s High-Waist Jeans', 'Classic high-waist denim jeans with a modern fit. Comfortable stretch material that flatters all body types. Perfect for everyday wear.', 'Women', 549.99, 449.99, true, 360.00, 5, 60,
 '["26", "28", "30", "32", "34", "36"]'::jsonb,
 '[{"name":"Dark Blue","hex":"#1e3a8a"},{"name":"Light Blue","hex":"#93C5FD"},{"name":"Black","hex":"#000000"}]'::jsonb,
 true, false),

('Women''s Graphic T-Shirt', 'Stylish graphic tee with trendy prints. Made from 100% cotton. Perfect for casual days and pairs well with any bottom.', 'Women', 249.99, null, false, 200.00, 5, 80,
 '["XS", "S", "M", "L", "XL", "XXL"]'::jsonb,
 '[{"name":"White","hex":"#FFFFFF"},{"name":"Black","hex":"#000000"},{"name":"Gray","hex":"#6B7280"},{"name":"Navy","hex":"#1e3a8a"}]'::jsonb,
 false, false),

-- Men's Collection
('Men''s Premium Cotton T-Shirt', 'Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton. Breathable, soft, and designed to last.', 'Men', 299.99, null, false, 240.00, 5, 100,
 '["S", "M", "L", "XL", "XXL", "XXXL"]'::jsonb,
 '[{"name":"Black","hex":"#000000"},{"name":"White","hex":"#FFFFFF"},{"name":"Navy","hex":"#1e3a8a"},{"name":"Gray","hex":"#6B7280"},{"name":"Teal","hex":"#14b8a6"}]'::jsonb,
 true, false),

('Men''s Denim Jacket', 'Classic denim jacket with modern styling. Perfect for layering. Features functional pockets and durable construction.', 'Men', 749.99, 599.99, true, 480.00, 5, 45,
 '["S", "M", "L", "XL", "XXL"]'::jsonb,
 '[{"name":"Dark Blue","hex":"#1e3a8a"},{"name":"Light Blue","hex":"#93C5FD"},{"name":"Black","hex":"#000000"}]'::jsonb,
 true, true),

('Men''s Casual Polo Shirt', 'Smart casual polo shirt perfect for work or weekend. Made from breathable pique cotton with a modern fit.', 'Men', 349.99, null, false, 280.00, 5, 70,
 '["S", "M", "L", "XL", "XXL"]'::jsonb,
 '[{"name":"White","hex":"#FFFFFF"},{"name":"Navy","hex":"#1e3a8a"},{"name":"Black","hex":"#000000"},{"name":"Burgundy","hex":"#800020"}]'::jsonb,
 false, false),

('Men''s Jogger Pants', 'Comfortable jogger pants perfect for casual wear or light exercise. Features elastic waistband and ankle cuffs. Side pockets for convenience.', 'Men', 449.99, 349.99, true, 280.00, 5, 55,
 '["S", "M", "L", "XL", "XXL"]'::jsonb,
 '[{"name":"Black","hex":"#000000"},{"name":"Gray","hex":"#6B7280"},{"name":"Navy","hex":"#1e3a8a"},{"name":"Olive","hex":"#808000"}]'::jsonb,
 true, false),

-- Unisex Accessories
('Unisex Snapback Cap', 'Trendy snapback cap with adjustable strap. One size fits most. Perfect for sunny days and completing your street style look.', 'Accessories', 199.99, null, false, 160.00, 10, 120,
 '["One Size"]'::jsonb,
 '[{"name":"Black","hex":"#000000"},{"name":"White","hex":"#FFFFFF"},{"name":"Navy","hex":"#1e3a8a"},{"name":"Red","hex":"#DC2626"}]'::jsonb,
 false, true),

('Unisex Canvas Tote Bag', 'Eco-friendly canvas tote bag perfect for shopping or daily use. Durable and stylish. Features reinforced handles and spacious interior.', 'Accessories', 149.99, 99.99, true, 80.00, 10, 90,
 '["One Size"]'::jsonb,
 '[{"name":"Natural","hex":"#F5E6D3"},{"name":"Black","hex":"#000000"},{"name":"Navy","hex":"#1e3a8a"}]'::jsonb,
 false, false),

-- Kids Collection
('Kids Graphic T-Shirt', 'Fun graphic tee for kids with colorful designs. Made from soft, breathable cotton. Easy to wash and maintain.', 'Kids', 179.99, null, false, 144.00, 10, 65,
 '["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"]'::jsonb,
 '[{"name":"White","hex":"#FFFFFF"},{"name":"Blue","hex":"#3B82F6"},{"name":"Pink","hex":"#EC4899"},{"name":"Yellow","hex":"#FCD34D"}]'::jsonb,
 false, true),

('Kids Hoodie', 'Cozy hoodie for kids perfect for cooler days. Features kangaroo pocket and adjustable hood. Soft fleece interior.', 'Kids', 349.99, 299.99, true, 240.00, 10, 40,
 '["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"]'::jsonb,
 '[{"name":"Gray","hex":"#6B7280"},{"name":"Navy","hex":"#1e3a8a"},{"name":"Pink","hex":"#EC4899"},{"name":"Black","hex":"#000000"}]'::jsonb,
 false, false);

-- Verify insertion
SELECT 
  name, 
  category, 
  price, 
  sale_price,
  on_sale,
  stock,
  featured,
  is_new
FROM products
ORDER BY category, name;

-- Show summary
SELECT 
  category,
  COUNT(*) as product_count,
  SUM(stock) as total_stock,
  AVG(price)::numeric(10,2) as avg_price
FROM products
GROUP BY category
ORDER BY category;

