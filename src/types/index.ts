
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

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type Order = {
  id: string; // Firestore document ID
  userId?: string; // UID of the user who placed the order
  customerName: string;
  customerEmail: string;
  items: CartItem[]; // Store denormalized item details or references
  totalAmount: number;
  status: OrderStatus;
  orderDate: Timestamp | string; // Firestore Timestamp or ISO string for mock
  shippingAddress: string;
  // You might add other fields like paymentIntentId, trackingNumber, etc.
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

