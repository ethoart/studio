
import type { Timestamp } from 'firebase/firestore';

export type Product = {
  id: string; // Firestore document ID
  name: string;
  price: number;
  description: string;
  categoryId: string; // ID of the category this product belongs to
  categoryName: string; // Denormalized category name for display
  imageUrl: string;
  images?: string[]; // Array of image URLs
  sizes: string[];   // Array of strings
  colors: string[];  // Array of strings
  stock?: number;
  slug?: string; // URL-friendly identifier
  sku?: string; // Stock Keeping Unit
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  rating?: number; 
  reviewCount?: number; 
};

// CartItem specific fields
// It extends Product but 'id' in CartItem can be a composite ID (productId-color-size)
// while 'productId' would store the original product ID.
export type CartItem = Omit<Product, 'id'> & {
  id: string; // This will be the composite cart item ID e.g., 'product123-red-medium'
  productId: string; // Original product ID from Firestore
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};


export type HomepageGalleryImage = {
  id: string;
  src: string;
  alt: string;
  dataAiHint?: string;
  createdAt?: Timestamp; // For ordering
};

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';

export type Order = {
  id: string; // Firestore document ID
  userId?: string | null; // UID of the user who placed the order, null for guest
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: Timestamp | Date | string; // Allow more flexible date types for input/output
  shippingAddress: string;
  paymentMethod?: string;
  createdBy?: string; // UID of admin if manually created
};

export type UserRole = 'customer' | 'admin' | 'super admin';

export type User = {
  uid: string; // Firebase Auth UID
  email: string | null;
  name?: string | null;
  role: UserRole;
  createdAt?: Timestamp | string | Date; 
  id?: string; // Legacy from mock, can be phased out
};

export type Category = {
  id: string; // Firestore document ID
  name: string;
  slug: string; // URL-friendly identifier
  createdAt?: Timestamp;
};

// For product detail page params promise
export interface ResolvedPageParams {
  slug: string;
}
export interface ProductDetailPageParams {
  params: Promise<ResolvedPageParams>;
}

