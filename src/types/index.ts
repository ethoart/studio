
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
  link?: string; // Optional link for the gallery image/slide
  title?: string; // Optional title for the banner slide text
  subtitle?: string; // Optional subtitle for the banner slide text
  dataAiHint?: string;
  createdAt?: Timestamp;
};

export type HomepageFeatureItem = {
  id: string;
  title: string;
  description: string;
  createdAt?: Timestamp; // For ordering
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
  createdBy?: string; // Admin who created the order, if applicable
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

// Theme Customization Types
export type HSLColor = {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  l: number; // Lightness (0-100)
};

export interface ColorSetting {
  name: string; // e.g., "Background"
  variableName: keyof ThemeSettings['colors']; // e.g., "background"
  hsl: HSLColor;
}

export type ThemeSettings = {
  id?: string; // Should be a fixed ID like 'default_theme_config'
  colors: {
    background: HSLColor;
    foreground: HSLColor;
    primary: HSLColor;
    primaryForeground: HSLColor;
    secondary: HSLColor;
    secondaryForeground: HSLColor;
    muted: HSLColor;
    mutedForeground: HSLColor;
    accent: HSLColor;
    accentForeground: HSLColor;
    border: HSLColor;
    ring: HSLColor;
    // Card and Popover often mirror background or have slight adjustments.
    // Destructive is usually a fixed red. Input often mirrors border.
    // For simplicity, we are starting with these main ones.
  };
  fonts: {
    bodyFamily: string; // e.g., 'Inter'
    headlineFamily: string; // e.g., 'Playfair Display'
  };
  updatedAt?: Timestamp;
};

export type FontOption = {
  name: string; // User-friendly name, e.g., "Inter"
  value: string; // Font family name for CSS, e.g., "Inter"
  weights?: string; // For Google Fonts URL, e.g., "400;700"
  googleFontName?: string; // For Google Fonts URL, e.g., "Inter" or "Playfair+Display"
};

