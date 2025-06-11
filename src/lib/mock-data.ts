import type { Product, HomepageGalleryImage, Order, User } from '@/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'classic-trench-coat',
    name: 'Classic Trench Coat',
    price: 189.99,
    description: 'A timeless trench coat made from water-resistant cotton gabardine. Features a double-breasted front, belted waist, and epaulets.',
    category: 'Outerwear',
    imageUrl: 'https://placehold.co/600x800/E2E2E2/333333.png',
    images: ['https://placehold.co/600x800/E2E2E2/333333.png', 'https://placehold.co/600x800/D1D1D1/333333.png', 'https://placehold.co/600x800/C0C0C0/333333.png'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Black', 'Navy'],
    stock: 25,
  },
  {
    id: '2',
    slug: 'silk-blend-blouse',
    name: 'Silk Blend Blouse',
    price: 79.50,
    description: 'Elegant silk blend blouse with a relaxed fit and concealed button placket. Perfect for office or evening wear.',
    category: 'Tops',
    imageUrl: 'https://placehold.co/600x800/F0F0F0/333333.png',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Ivory', 'Blush Pink', 'Black'],
    stock: 40,
  },
  {
    id: '3',
    slug: 'tailored-wool-trousers',
    name: 'Tailored Wool Trousers',
    price: 120.00,
    description: 'Expertly tailored trousers in a fine wool blend. Straight leg cut with a comfortable mid-rise waist.',
    category: 'Bottoms',
    imageUrl: 'https://placehold.co/600x800/DBDBDB/333333.png',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Charcoal', 'Navy'],
    stock: 15,
  },
  {
    id: '4',
    slug: 'cashmere-crew-neck-sweater',
    name: 'Cashmere Crew Neck Sweater',
    price: 150.00,
    description: 'Luxuriously soft 100% cashmere sweater with a classic crew neckline. A wardrobe essential.',
    category: 'Knitwear',
    imageUrl: 'https://placehold.co/600x800/E8E8E8/333333.png',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Grey Melange', 'Camel', 'Forest Green'],
    stock: 30,
  },
  {
    id: '5',
    slug: 'leather-ankle-boots',
    name: 'Leather Ankle Boots',
    price: 220.00,
    description: 'Chic ankle boots crafted from smooth genuine leather. Features a comfortable block heel and side zip fastening.',
    category: 'Shoes',
    imageUrl: 'https://placehold.co/600x800/D0D0D0/333333.png',
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['Black', 'Brown'],
    stock: 18,
  },
  {
    id: '6',
    slug: 'linen-midi-dress',
    name: 'Linen Midi Dress',
    price: 95.00,
    description: 'Breathable linen midi dress with a square neckline and A-line skirt. Ideal for warm weather.',
    category: 'Dresses',
    imageUrl: 'https://placehold.co/600x800/F5F5F5/333333.png',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Sky Blue', 'Terracotta'],
    stock: 22,
  },
   {
    id: '7',
    slug: 'denim-jacket-classic',
    name: 'Denim Jacket Classic',
    price: 89.99,
    description: 'A classic denim jacket with a slightly oversized fit, button front, and chest pockets.',
    category: 'Outerwear',
    imageUrl: 'https://placehold.co/600x800/C8C8C8/333333.png',
    sizes: ['S', 'M', 'L'],
    colors: ['Blue Wash', 'Black Wash'],
    stock: 35,
  },
  {
    id: '8',
    slug: 'striped-cotton-shirt',
    name: 'Striped Cotton Shirt',
    price: 65.00,
    description: 'Crisp cotton shirt with a timeless stripe pattern. Perfect for a smart-casual look.',
    category: 'Tops',
    imageUrl: 'https://placehold.co/600x800/EDEDED/333333.png',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue/White Stripe', 'Pink/White Stripe'],
    stock: 28,
  },
];

export const mockHomepageGalleryImages: HomepageGalleryImage[] = [
  { id: 'gallery1', src: 'https://placehold.co/1200x600/D3D3D3/333333.png', alt: 'Model wearing ARO Bazzar outfit 1', dataAiHint: 'fashion model' },
  { id: 'gallery2', src: 'https://placehold.co/1200x600/C0C0C0/333333.png', alt: 'Model wearing ARO Bazzar outfit 2', dataAiHint: 'elegant clothing' },
  { id: 'gallery3', src: 'https://placehold.co/1200x600/E0E0E0/333333.png', alt: 'ARO Bazzar accessories collection', dataAiHint: 'fashion accessories' },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'Alice Wonderland',
    customerEmail: 'alice@example.com',
    items: [
      { ...mockProducts[0], quantity: 1, selectedSize: 'M', selectedColor: 'Beige' },
      { ...mockProducts[1], quantity: 1, selectedSize: 'S', selectedColor: 'Ivory' },
    ],
    totalAmount: 269.49,
    status: 'Processing',
    orderDate: '2023-10-26',
    shippingAddress: '123 Rabbit Hole, Wonderland',
  },
  {
    id: 'ORD002',
    customerName: 'Bob The Builder',
    customerEmail: 'bob@example.com',
    items: [{ ...mockProducts[4], quantity: 1, selectedSize: '9', selectedColor: 'Black' }],
    totalAmount: 220.00,
    status: 'Shipped',
    orderDate: '2023-10-25',
    shippingAddress: '456 Fixit Ave, Builderville',
  },
];

export const mockUsers: User[] = [
  { id: 'USR001', name: 'Alice Wonderland', email: 'alice@example.com', role: 'customer', createdAt: '2023-01-15' },
  { id: 'USR002', name: 'Bob The Builder', email: 'bob@example.com', role: 'customer', createdAt: '2023-02-20' },
  { id: 'USR003', name: 'Admin User', email: 'admin@arobazzar.com', role: 'admin', createdAt: '2023-01-01' },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return mockProducts.find(p => p.slug === slug);
}
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id);
}

