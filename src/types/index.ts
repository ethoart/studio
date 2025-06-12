
import type { Timestamp } from 'firebase/firestore';

export type Product = {
  id: string; // Firestore document ID
  name: string;
  price: number;
  description: string;
  category: string; // This might become categoryId or categoryName after refactor
  categoryId?: string; // To link to a category document
  categoryName?: string; // Denormalized category name for display
  imageUrl: string;
  images?: string[]; // Array of image URLs
  sizes: string[];   // Array of strings
  colors: string[];  // Array of strings
  stock?: number;
  slug?: string; // URL-friendly identifier
  sku?: string; // Stock Keeping Unit
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
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
  createdAt?: Timestamp; // For ordering
};

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type Order = {
  id: string; // Firestore document ID
  userId?: string; // UID of the user who placed the order
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: Timestamp | string;
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
  createdAt?: Timestamp | string;
  id?: string; // Legacy from mock, can be phased out
};

export type Category = {
  id: string; // Firestore document ID
  name: string;
  slug: string; // URL-friendly identifier
  createdAt?: Timestamp;
};
