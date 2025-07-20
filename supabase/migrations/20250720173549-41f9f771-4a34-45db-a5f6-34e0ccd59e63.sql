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
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  in_stock BOOLEAN NOT NULL DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

-- Create policies for products (public read)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (user_id = auth.uid()::text);

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES
('Laptops', 'High-performance laptops for work and gaming'),
('Smartphones', 'Latest smartphones with cutting-edge technology'),
('Tablets', 'Portable tablets for productivity and entertainment'),
('Audio', 'Premium headphones, speakers, and audio equipment'),
('Accessories', 'Essential tech accessories and gadgets'),
('Furniture', 'Modern furniture for your living space');

-- Insert sample products with reasonable prices
INSERT INTO public.products (name, description, price, image_url, category_id, stock_quantity) 
SELECT 
  'MacBook Pro 14"', 
  'Powerful laptop with M3 chip, perfect for professionals and creators', 
  1999.99, 
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
  c.id,
  15
FROM public.categories c WHERE c.name = 'Laptops';

INSERT INTO public.products (name, description, price, image_url, category_id, stock_quantity) 
SELECT 
  'iPhone 15 Pro', 
  'Latest iPhone with titanium design and advanced camera system', 
  999.99, 
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
  c.id,
  25
FROM public.categories c WHERE c.name = 'Smartphones';

INSERT INTO public.products (name, description, price, image_url, category_id, stock_quantity) 
SELECT 
  'iPad Air', 
  'Versatile tablet with M2 chip for creativity and productivity', 
  599.99, 
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
  c.id,
  20
FROM public.categories c WHERE c.name = 'Tablets';

INSERT INTO public.products (name, description, price, image_url, category_id, stock_quantity) 
SELECT 
  'AirPods Pro 2', 
  'Wireless earbuds with active noise cancellation', 
  249.99, 
  'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500',
  c.id,
  30
FROM public.categories c WHERE c.name = 'Audio';

INSERT INTO public.products (name, description, price, image_url, category_id, stock_quantity) 
SELECT 
  'Samsung Galaxy S24', 
  'Android flagship with AI-powered features and excellent camera', 
  899.99, 
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500',
  c.id,
  18
FROM public.categories c WHERE c.name = 'Smartphones';

INSERT INTO public.products (name, description, price, image_url, category_id, stock_quantity) 
SELECT 
  'Dell XPS 13', 
  'Ultra-portable laptop with stunning display and long battery life', 
  1299.99, 
  'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500',
  c.id,
  12
FROM public.categories c WHERE c.name = 'Laptops';

INSERT INTO public.products (name, description, price, image_url, category_id, stock_quantity) 
SELECT 
  'Sony WH-1000XM5', 
  'Industry-leading noise canceling wireless headphones', 
  399.99, 
  'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
  c.id,
  22
FROM public.categories c WHERE c.name = 'Audio';

INSERT INTO public.products (name, description, price, image_url, category_id, stock_quantity) 
SELECT 
  'Modern Office Chair', 
  'Ergonomic office chair with lumbar support and premium materials', 
  449.99, 
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
  c.id,
  8
FROM public.categories c WHERE c.name = 'Furniture';

INSERT INTO public.products (name, description, price, image_url, category_id, stock_quantity) 
SELECT 
  'Wireless Charging Pad', 
  'Fast wireless charging for all Qi-enabled devices', 
  39.99, 
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
  c.id,
  45
FROM public.categories c WHERE c.name = 'Accessories';

INSERT INTO public.products (name, description, price, image_url, category_id, stock_quantity) 
SELECT 
  'Standing Desk', 
  'Height-adjustable standing desk for better health and productivity', 
  699.99, 
  'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500',
  c.id,
  6
FROM public.categories c WHERE c.name = 'Furniture';