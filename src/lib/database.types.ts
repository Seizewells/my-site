export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: number
          title: string
          slug: string
          content: string
          image_url: string | null
          published: boolean
          created_at: string
          updated_at: string
          author_id: string
        }
        Insert: {
          id?: number
          title: string
          slug: string
          content: string
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
          author_id: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          content?: string
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
          author_id?: string
        }
      }
      cart_items: {
        Row: {
          id: number
          user_id: string
          product_id: number
          quantity: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          product_id: number
          quantity: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          product_id?: number
          quantity?: number
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: number
          user_id: string
          product_id: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          product_id: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          product_id?: number
          created_at?: string
        }
      }
      products: {
        Row: {
          id: number
          name: string
          description: string
          price: number
          old_price: number | null
          inventory: number
          category_id: number
          image_url: string | null
          featured: boolean
          is_new: boolean
          is_bestseller: boolean
          rating: number
          specifications: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          price: number
          old_price?: number | null
          inventory: number
          category_id: number
          image_url?: string | null
          featured?: boolean
          is_new?: boolean
          is_bestseller?: boolean
          rating?: number
          specifications?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          price?: number
          old_price?: number | null
          inventory?: number
          category_id?: number
          image_url?: string | null
          featured?: boolean
          is_new?: boolean
          is_bestseller?: boolean
          rating?: number
          specifications?: Json
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          created_at?: string | null
        }
      }
    }
  }
}