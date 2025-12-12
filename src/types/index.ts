export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  id: string;
  user_id: string;
  role: 'customer' | 'admin';
  full_name: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { products: Product })[];
}
