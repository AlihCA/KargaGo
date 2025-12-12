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
      user_profiles: {
        Row: {
          id: string
          user_id: string
          role: string
          full_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: string
          full_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          full_name?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image_url: string
          category: string
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image_url: string
          category: string
          stock?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image_url?: string
          category?: string
          stock?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          total: number
          status: string
          customer_name: string
          customer_email: string
          shipping_address: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          total: number
          status?: string
          customer_name: string
          customer_email: string
          shipping_address: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          total?: number
          status?: string
          customer_name?: string
          customer_email?: string
          shipping_address?: string
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
    }
  }
}
