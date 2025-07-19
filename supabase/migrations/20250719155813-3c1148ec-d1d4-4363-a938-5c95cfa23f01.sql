-- Add more products to the database
INSERT INTO public.categories (id, name, description) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Gaming', 'Gaming equipment and accessories'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Audio', 'Speakers, headphones, and audio equipment'),
('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'Kitchen', 'Kitchen appliances and cookware'),
('6ba7b812-9dad-11d1-80b4-00c04fd430c8', 'Outdoor', 'Outdoor furniture and equipment');

-- Get existing furniture category ID first
DO $$
DECLARE 
    furniture_category_id UUID;
BEGIN
    SELECT id INTO furniture_category_id FROM public.categories WHERE name = 'Furniture' LIMIT 1;
    
    -- Add many more tech products with correct category references
    INSERT INTO public.products (name, description, price, original_price, image_url, category_id, badge, rating, reviews_count) VALUES
    -- Gaming products
    ('Gaming Mouse Pad XXL', 'Extra large gaming mouse pad with RGB lighting', 39.99, 59.99, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Popular', 4.6, 892),
    ('Mechanical Gaming Keyboard', 'RGB backlit mechanical keyboard with blue switches', 129.99, 179.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Best Seller', 4.8, 1245),
    ('Gaming Chair Pro', 'Ergonomic gaming chair with lumbar support', 299.99, 399.99, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Hot', 4.7, 567),
    ('VR Headset Ultra', 'Next-gen virtual reality headset with 4K display', 599.99, 799.99, 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'New', 4.9, 234),
    ('Gaming Controller Wireless', 'Professional wireless gaming controller', 79.99, 99.99, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', null, 4.5, 1123),
    
    -- Audio products
    ('Wireless Earbuds Pro', 'Noise-cancelling wireless earbuds with case', 199.99, 249.99, 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Popular', 4.6, 2341),
    ('Studio Monitor Speakers', 'Professional studio monitor speakers', 449.99, 599.99, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Best Seller', 4.8, 456),
    ('USB Microphone', 'Professional USB condenser microphone', 149.99, 199.99, 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', null, 4.7, 789),
    ('Bluetooth Speaker Portable', 'Waterproof portable Bluetooth speaker', 89.99, 119.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Hot', 4.5, 1567),
    ('Headphone Stand', 'Premium wooden headphone stand with cable management', 34.99, 49.99, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', null, 4.3, 234),
    
    -- More furniture using existing furniture category
    ('Coffee Table Glass', 'Modern glass coffee table with metal legs', 299.99, 399.99, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', furniture_category_id, 'New', 4.6, 145),
    ('Bookshelf Tall', '6-tier tall bookshelf with adjustable shelves', 189.99, 249.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', furniture_category_id, null, 4.4, 567),
    ('Desk Lamp LED', 'Adjustable LED desk lamp with USB charging port', 69.99, 89.99, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500', furniture_category_id, 'Popular', 4.7, 892),
    ('Storage Ottoman', 'Foldable storage ottoman with fabric cover', 79.99, 99.99, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', furniture_category_id, null, 4.2, 234),
    ('Wall Mirror Large', 'Large decorative wall mirror with gold frame', 159.99, 199.99, 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=500', furniture_category_id, 'Hot', 4.8, 345),
    
    -- Kitchen products
    ('Stand Mixer Pro', 'Professional stand mixer with multiple attachments', 349.99, 449.99, 'https://images.unsplash.com/photo-1585515656639-5a529c4e2e90?w=500', '6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'Best Seller', 4.9, 1234),
    ('Coffee Machine Espresso', 'Automatic espresso coffee machine', 599.99, 799.99, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', '6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'Popular', 4.7, 678),
    ('Knife Set Professional', '12-piece professional knife set with block', 199.99, 279.99, 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500', '6ba7b811-9dad-11d1-80b4-00c04fd430c8', null, 4.6, 456),
    ('Blender High Speed', 'High-speed blender with multiple settings', 249.99, 319.99, 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500', '6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'New', 4.5, 789),
    ('Cutting Board Set', 'Bamboo cutting board set with different sizes', 49.99, 69.99, 'https://images.unsplash.com/photo-1556908114-f6e7ad7d3136?w=500', '6ba7b811-9dad-11d1-80b4-00c04fd430c8', null, 4.3, 234),
    
    -- Outdoor products
    ('Patio Set', '4-piece outdoor patio furniture set', 799.99, 999.99, 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500', '6ba7b812-9dad-11d1-80b4-00c04fd430c8', 'Popular', 4.6, 123),
    ('Outdoor Umbrella', 'Large outdoor umbrella with tilt mechanism', 159.99, 199.99, 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=500', '6ba7b812-9dad-11d1-80b4-00c04fd430c8', null, 4.4, 234),
    ('Fire Pit', 'Portable fire pit with spark screen', 299.99, 399.99, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500', '6ba7b812-9dad-11d1-80b4-00c04fd430c8', 'Hot', 4.7, 345),
    ('Garden Bench', 'Wooden garden bench with weather protection', 199.99, 249.99, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500', '6ba7b812-9dad-11d1-80b4-00c04fd430c8', null, 4.5, 456),
    ('Outdoor Lighting Set', 'Solar-powered outdoor string lights', 79.99, 99.99, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500', '6ba7b812-9dad-11d1-80b4-00c04fd430c8', 'New', 4.2, 567);
END $$;

-- Create OTP verification table
CREATE TABLE public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for OTP table
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies for OTP verification
CREATE POLICY "Users can verify their own OTP" 
ON public.otp_verifications 
FOR SELECT 
USING (TRUE);

CREATE POLICY "System can insert OTP records" 
ON public.otp_verifications 
FOR INSERT 
WITH CHECK (TRUE);

CREATE POLICY "System can update OTP records" 
ON public.otp_verifications 
FOR UPDATE 
USING (TRUE);