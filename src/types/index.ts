
import type { Timestamp } from 'firebase/firestore';

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  images?: string[];
  sizes: string[];
  colors: string[];
  stock?: number;
  slug?: string;
};

export type CartItem = Product & {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

export type HomepageGalleryImage = {
  id: string;
  src: string;
  alt: string;
  dataAiHint?: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string; // Consider using Timestamp for Firestore
  shippingAddress: string;
};

export type UserRole = 'customer' | 'admin' | 'super admin';

export type User = {
  uid: string; // Firebase Auth UID
  email: string | null;
  name?: string | null; // displayName from Auth or Firestore
  role: UserRole;
  createdAt?: Timestamp | string; // Firestore Timestamp or ISO string
  // Legacy fields, can be removed if not used by mock data consumers anymore
  id?: string; 
};
