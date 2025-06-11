
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
  orderDate: string;
  shippingAddress: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: string;
};
