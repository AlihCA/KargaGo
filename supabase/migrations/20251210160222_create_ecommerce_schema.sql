/*
  # E-commerce Database Schema for Philippine Goods Marketplace

  ## Overview
  Creates a complete e-commerce system with product management, orders, and user roles.

  ## New Tables
  
  ### `user_profiles`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `role` (text) - 'customer' or 'admin'
  - `full_name` (text)
  - `created_at` (timestamptz)
  
  ### `products`
  - `id` (uuid, primary key)
  - `name` (text) - Product name
  - `description` (text) - Detailed description
  - `price` (numeric) - Product price in PHP
  - `image_url` (text) - Product image URL
  - `category` (text) - Product category (handicrafts, food, textiles, etc.)
  - `stock` (integer) - Available quantity
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `orders`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `total` (numeric) - Order total amount
  - `status` (text) - Order status (pending, completed, cancelled)
  - `customer_name` (text)
  - `customer_email` (text)
  - `shipping_address` (text)
  - `created_at` (timestamptz)
  
  ### `order_items`
  - `id` (uuid, primary key)
  - `order_id` (uuid, references orders)
  - `product_id` (uuid, references products)
  - `quantity` (integer)
  - `price` (numeric) - Price at time of purchase
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Customers can view products and their own orders
  - Admins can manage products and view all orders
  - Public can view products (for browsing)
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role text DEFAULT 'customer' NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  stock integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  total numeric(10, 2) NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  shipping_address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL,
  price numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Products Policies
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Orders Policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order Items Policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample Philippine products
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
  ('Barong Tagalog', 'Traditional Filipino formal shirt made from pineapple fiber (piña) or abaca, featuring intricate embroidery. Perfect for weddings and formal occasions.', 3500.00, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', 'Clothing', 15),
  ('Inabel Blanket', 'Handwoven textile from the Ilocos region featuring vibrant patterns and colors. Made using traditional backstrap loom techniques passed down through generations.', 2800.00, 'https://images.pexels.com/photos/6969867/pexels-photo-6969867.jpeg', 'Textiles', 20),
  ('Dried Mangoes', 'Premium Philippine Cebu dried mangoes - naturally sweet, chewy, and made from the finest Carabao mangoes. No artificial preservatives. 500g pack.', 450.00, 'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg', 'Food', 100),
  ('Capiz Shell Chandelier', 'Elegant lighting fixture handcrafted from natural capiz shells. Creates beautiful ambient lighting with a tropical Filipino aesthetic.', 5500.00, 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg', 'Home Decor', 8),
  ('Bayong Bag', 'Eco-friendly woven bag made from buri palm or raffia. Features traditional Filipino patterns. Perfect for shopping or beach trips.', 650.00, 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', 'Accessories', 45),
  ('Adobo Seasoning Mix', 'Authentic Filipino adobo seasoning blend with soy sauce, garlic, vinegar, and spices. Makes cooking traditional adobo quick and easy. Set of 3 packs.', 280.00, 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg', 'Food', 80),
  ('Abaca Placemats', 'Set of 4 handwoven placemats made from Manila hemp (abaca). Durable, eco-friendly, and adds rustic charm to any dining table.', 890.00, 'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg', 'Home Decor', 30),
  ('Terno Dress', 'Modern interpretation of the traditional Filipino terno with iconic butterfly sleeves. Made from high-quality fabric with contemporary fit.', 4200.00, 'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg', 'Clothing', 10),
  ('Coconut Vinegar', 'Authentic Filipino sukang tuba made from fermented coconut sap. Essential ingredient for adobo, sinigang, and other Filipino dishes. 750ml bottle.', 180.00, 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg', 'Food', 60),
  ('Rattan Storage Basket', 'Handcrafted rattan basket with lid, perfect for storage or as decorative piece. Showcases traditional Filipino weaving craftsmanship.', 1250.00, 'https://images.pexels.com/photos/5591658/pexels-photo-5591658.jpeg', 'Home Decor', 25),
  ('Embroidered Barong', 'Premium barong Tagalog with intricate hand-embroidered designs. Made from finest Jusi fabric. A true masterpiece of Filipino craftsmanship.', 6800.00, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', 'Clothing', 5),
  ('Ube Halaya', 'Traditional Filipino purple yam jam - creamy, naturally sweet, and made from authentic purple yam. Perfect spread or dessert ingredient. 350g jar.', 320.00, 'https://images.pexels.com/photos/8474499/pexels-photo-8474499.jpeg', 'Food', 50);
