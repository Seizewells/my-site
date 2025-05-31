export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  rating: number;
  description?: string;
  specifications?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
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