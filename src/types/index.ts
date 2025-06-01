export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  old_price?: number | null;
  inventory: number;
  category_id: number;
  image_url: string | null;
  featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  rating: number;
  specifications: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}