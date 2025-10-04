-- Add review images support
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add image tracking
CREATE TABLE IF NOT EXISTS review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_images_review_id ON review_images(review_id);

-- Review image limit (max 5 images per review)
CREATE OR REPLACE FUNCTION check_review_image_limit()
RETURNS TRIGGER AS $$
DECLARE
  image_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO image_count
  FROM review_images
  WHERE review_id = NEW.review_id;
  
  IF image_count >= 5 THEN
    RAISE EXCEPTION 'Cannot upload more than 5 images per review';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_review_image_limit
BEFORE INSERT ON review_images
FOR EACH ROW
EXECUTE FUNCTION check_review_image_limit();

