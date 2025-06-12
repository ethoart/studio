
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
  averageRating?: number; // Optional: Can be calculated or stored
  reviewCount?: number;   // Optional: Can be calculated or stored
  rating?: number; // Kept for compatibility if used elsewhere, prefer averageRating
};

export type CartItem = Omit<Product, 'id'> & {
  id: string;
  productId: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};


export type HomepageGalleryImage = {
  id:string;
  src: string;
  alt: string;
  dataAiHint?: string;
  createdAt?: Timestamp;
};

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
export type PaymentMethod = 'Offline/Bank Transfer' | 'Cash on Delivery';

export type Order = {
  id: string; // Firestore document ID
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  codCharge?: number;
  totalAmount: number;
  status: OrderStatus;
  orderDate: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
  shippingAddress: string;
  paymentMethod?: PaymentMethod | string;
  createdBy?: string;
};

export type UserRole = 'customer' | 'admin' | 'super admin';

export type User = {
  uid: string;
  email: string | null;
  name?: string | null;
  role: UserRole;
  createdAt?: Timestamp | string | Date;
  id?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt?: Timestamp;
};

export interface ResolvedPageParams {
  slug: string;
}
export interface ProductDetailPageParams {
  params: Promise<ResolvedPageParams>;
}

export type Review = {
  id?: string; // Firestore document ID
  productId: string;
  userId: string;
  userName: string; // Denormalized user name
  rating: number; // 1-5
  text: string;
  createdAt: Timestamp;
};
