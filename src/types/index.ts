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
  categories?: {
    id: number;
    name: string;
    slug: string;
  };
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
  id: number;
  product_id: number;
  user_id: string;
  comment: string;
  rating: number;
  created_at: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
  author?: {
    username: string | null;
    avatar_url: string | null;
  };
}