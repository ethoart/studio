
"use client";

import { useEffect } from 'react'; // Removed useState as cartItems come from context
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/context/cart-context'; // Import useCart

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, loading: cartLoading } = useCart();

  const subtotal = getCartTotal();
  // Example shipping and tax, adjust as needed or make dynamic
  const shippingEstimate = cartItems.length > 0 ? 5.00 : 0; 
  const taxEstimate = subtotal * 0.08; 
  const total = subtotal + shippingEstimate + taxEstimate;

  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="font-headline text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link href="/shop">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-8 text-center">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul role="list" className="divide-y divide-border border-b border-t">
            {cartItems.map((item) => ( // Renamed product to item for clarity from context
              <li key={item.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border sm:h-32 sm:w-32">
                  <Image
                    // Use item.productId for linking if item.id is composite, or product.slug if available
                    src={item.imageUrl || 'https://placehold.co/128x128.png'}
                    alt={item.name}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover object-center"
                    data-ai-hint="cart item"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                  <div>
                    <div className="flex justify-between text-base font-medium">
                      <h3 className="font-headline text-lg">
                        {/* Use item.productId for linking if item.id is composite */}
                        <Link href={`/product/${item.slug || item.productId || item.id}`}>{item.name}</Link>
                      </h3>
                      <p className="ml-4">LKR {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.selectedColor} / {item.selectedSize}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">Unit Price: LKR {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm mt-4">
                    <div className="flex items-center">
                      <Label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity</Label>
                      <Input
                        id={`quantity-${item.id}`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="w-20 h-9 p-1.5 text-center"
                        min="1"
                      />
                    </div>
                    <Button variant="ghost" type="button" onClick={() => removeFromCart(item.id)} className="font-medium text-primary hover:text-primary/80">
                      <Trash2 className="mr-1 h-4 w-4" /> Remove
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order summary */}
        <div className="rounded-lg border bg-card p-6 shadow-sm lg:col-span-1 h-fit sticky top-24">
          <h2 className="font-headline text-xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>LKR {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping estimate</span>
              <span>LKR {shippingEstimate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax estimate</span>
              <span>LKR {taxEstimate.toFixed(2)}</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between text-base font-bold">
              <span>Order total</span>
              <span>LKR {total.toFixed(2)}</span>
            </div>
          </div>
          <Link href="/checkout" className="mt-6 block">
            <Button size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>
          <p className="mt-4 text-center text-sm">
            <Link href="/shop" className="font-medium text-primary hover:text-primary/80">
              or Continue Shopping
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
