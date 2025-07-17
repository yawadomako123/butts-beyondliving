-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  badge TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

-- Create policies for products (public read)
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON public.orders FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for order_items
CREATE POLICY "Users can view their order items" 
ON public.order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create order items for their orders" 
ON public.order_items FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert categories
INSERT INTO public.categories (name, description) VALUES
('Tech', 'Latest technology gadgets and electronics'),
('Furniture', 'Modern furniture for your home and office'),
('Audio', 'High-quality audio equipment and accessories'),
('Gaming', 'Gaming laptops, consoles, and accessories'),
('Office', 'Office furniture and equipment'),
('Living Room', 'Comfortable living room furniture'),
('Bedroom', 'Bedroom furniture and accessories'),
('Kitchen', 'Kitchen appliances and gadgets');

-- Insert tech products
INSERT INTO public.products (name, description, price, original_price, image_url, category_id, rating, reviews_count, badge) 
SELECT 
  'MacBook Pro 16-inch M3 Pro',
  'Powerful laptop with M3 Pro chip, 18GB RAM, 512GB SSD for professional workflows',
  2499.99,
  2699.99,
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
  id,
  4.8,
  124,
  'Bestseller'
FROM public.categories WHERE name = 'Tech';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, reviews_count) 
SELECT 
  'iPhone 15 Pro Max 256GB',
  'Latest iPhone with titanium design and advanced camera system',
  1199.99,
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
  id,
  4.7,
  89
FROM public.categories WHERE name = 'Tech';

INSERT INTO public.products (name, description, price, original_price, image_url, category_id, rating, reviews_count, badge) 
SELECT 
  'Sony WH-1000XM5 Headphones',
  'Industry-leading noise canceling wireless headphones with premium sound quality',
  349.99,
  399.99,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  id,
  4.9,
  256,
  'Sale'
FROM public.categories WHERE name = 'Audio';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, reviews_count) 
SELECT 
  'iPad Air 11-inch M2',
  'Powerful and versatile tablet with M2 chip and stunning display',
  799.99,
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
  id,
  4.6,
  67
FROM public.categories WHERE name = 'Tech';

-- Insert more tech products
INSERT INTO public.products (name, description, price, original_price, image_url, category_id, rating, reviews_count, badge) 
SELECT 
  'Gaming Laptop RTX 4080',
  'High-performance gaming laptop with RTX 4080 GPU and 32GB RAM',
  2299.99,
  2499.99,
  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
  id,
  4.7,
  92,
  'Gaming Beast'
FROM public.categories WHERE name = 'Gaming';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, reviews_count) 
SELECT 
  'Samsung 4K Monitor 32"',
  'Ultra-wide 4K monitor perfect for productivity and entertainment',
  599.99,
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
  id,
  4.5,
  134
FROM public.categories WHERE name = 'Tech';

INSERT INTO public.products (name, description, price, original_price, image_url, category_id, rating, reviews_count, badge) 
SELECT 
  'Wireless Charging Pad',
  'Fast wireless charging for all Qi-enabled devices',
  49.99,
  69.99,
  'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
  id,
  4.3,
  287,
  'Deal'
FROM public.categories WHERE name = 'Tech';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, reviews_count) 
SELECT 
  'Smart Watch Series 9',
  'Advanced fitness tracking and health monitoring smartwatch',
  399.99,
  'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
  id,
  4.6,
  445
FROM public.categories WHERE name = 'Tech';

-- Insert furniture products
INSERT INTO public.products (name, description, price, original_price, image_url, category_id, rating, reviews_count, badge) 
SELECT 
  'Modern Sectional Sofa',
  'Comfortable L-shaped sectional sofa in premium fabric',
  1299.99,
  1599.99,
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
  id,
  4.8,
  76,
  'Comfort Plus'
FROM public.categories WHERE name = 'Living Room';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, reviews_count) 
SELECT 
  'Executive Office Chair',
  'Ergonomic office chair with lumbar support and adjustable height',
  449.99,
  'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
  id,
  4.7,
  156
FROM public.categories WHERE name = 'Office';

INSERT INTO public.products (name, description, price, original_price, image_url, category_id, rating, reviews_count, badge) 
SELECT 
  'Oak Dining Table Set',
  'Solid oak dining table with 6 matching chairs',
  899.99,
  1199.99,
  'https://images.unsplash.com/photo-1549497538-303791108f95?w=400',
  id,
  4.9,
  83,
  'Best Value'
FROM public.categories WHERE name = 'Furniture';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, reviews_count) 
SELECT 
  'King Size Platform Bed',
  'Minimalist platform bed frame with built-in nightstands',
  679.99,
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
  id,
  4.6,
  234
FROM public.categories WHERE name = 'Bedroom';

INSERT INTO public.products (name, description, price, original_price, image_url, category_id, rating, reviews_count, badge) 
SELECT 
  'Standing Desk Electric',
  'Height-adjustable standing desk with memory presets',
  699.99,
  899.99,
  'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400',
  id,
  4.8,
  167,
  'Productivity'
FROM public.categories WHERE name = 'Office';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, reviews_count) 
SELECT 
  'Coffee Table Glass Top',
  'Modern glass-top coffee table with chrome legs',
  329.99,
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
  id,
  4.4,
  98
FROM public.categories WHERE name = 'Living Room';

INSERT INTO public.products (name, description, price, original_price, image_url, category_id, rating, reviews_count, badge) 
SELECT 
  'Bookshelf Wall Unit',
  'Tall bookshelf unit perfect for home office or living room',
  249.99,
  329.99,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  id,
  4.5,
  127,
  'Storage'
FROM public.categories WHERE name = 'Furniture';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, reviews_count) 
SELECT 
  'Recliner Chair Leather',
  'Premium leather recliner with massage function',
  1199.99,
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
  id,
  4.7,
  145
FROM public.categories WHERE name = 'Living Room';

-- Insert more tech products
INSERT INTO public.products (name, description, price, original_price, image_url, category_id, rating, reviews_count, badge) 
SELECT 
  'Bluetooth Speaker Pro',
  'Portable wireless speaker with 360-degree sound',
  129.99,
  159.99,
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
  id,
  4.6,
  312,
  'Portable'
FROM public.categories WHERE name = 'Audio';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, reviews_count) 
SELECT 
  'Mechanical Keyboard RGB',
  'Gaming mechanical keyboard with customizable RGB lighting',
  149.99,
  'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
  id,
  4.8,
  189
FROM public.categories WHERE name = 'Gaming';

INSERT INTO public.products (name, description, price, original_price, image_url, category_id, rating, reviews_count, badge) 
SELECT 
  'Webcam 4K Ultra HD',
  'Professional 4K webcam with auto-focus and noise reduction',
  199.99,
  249.99,
  'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
  id,
  4.5,
  76,
  'Pro Quality'
FROM public.categories WHERE name = 'Tech';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, reviews_count) 
SELECT 
  'Smart Home Hub',
  'Central control hub for all your smart home devices',
  99.99,
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
  id,
  4.4,
  203
FROM public.categories WHERE name = 'Tech';