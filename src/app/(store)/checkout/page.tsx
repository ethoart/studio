
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { OrderStatus, CartItem } from '@/types'; // Ensure OrderStatus is imported

export default function CheckoutPage() {
  const { toast } = useToast();
  const { cartItems, getCartTotal, clearCart, loading: cartLoading } = useCart();
  const { firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state for shipping details - simple state management for this example
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: '', // User's email, prefill if logged in?
    phone: '',
  });

  const subtotal = getCartTotal();
  const shippingEstimate = cartItems.length > 0 ? 5.00 : 0; // Example
  const taxEstimate = subtotal * 0.08; // Example
  const orderTotal = subtotal + shippingEstimate + taxEstimate;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cartItems.length === 0) {
      toast({ title: "Your cart is empty", description: "Please add items to your cart before checking out.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);

    try {
      const orderData = {
        userId: firebaseUser ? firebaseUser.uid : null,
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customerEmail: shippingInfo.email,
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}`,
        items: cartItems.map(item => ({ ...item })), // Create a deep copy of cart items
        totalAmount: orderTotal,
        status: 'Pending' as OrderStatus, // Default status
        orderDate: serverTimestamp(),
        paymentMethod: 'Offline/Bank Transfer', // Explicitly set payment method
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your Order ID is ${docRef.id}. Please follow payment instructions.`,
      });
      
      clearCart(); // Clear the cart after successful order
      // Optionally reset form: setShippingInfo({ firstName: '', ...});
      router.push('/'); // Redirect to homepage or an order success page

    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Order Placement Failed",
        description: "Could not place your order. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (cartLoading || authLoading) {
     return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-10 text-center">Checkout</h1>
      
      <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-5">
        {/* Shipping Information Form - takes 3/5 width on lg screens */}
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-3">
          <div>
            <h2 className="font-headline text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" type="text" required value={shippingInfo.firstName} onChange={handleInputChange} disabled={isProcessing} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" type="text" required value={shippingInfo.lastName} onChange={handleInputChange} disabled={isProcessing} />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" type="text" required value={shippingInfo.address} onChange={handleInputChange} disabled={isProcessing} />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" type="text" required value={shippingInfo.city} onChange={handleInputChange} disabled={isProcessing} />
              </div>
              <div>
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" name="state" type="text" required value={shippingInfo.state} onChange={handleInputChange} disabled={isProcessing} />
              </div>
              <div>
                <Label htmlFor="zip">ZIP / Postal Code</Label>
                <Input id="zip" name="zip" type="text" required value={shippingInfo.zip} onChange={handleInputChange} disabled={isProcessing} />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required value={shippingInfo.email} onChange={handleInputChange} disabled={isProcessing} />
            </div>
            <div className="mt-4">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" name="phone" type="tel" value={shippingInfo.phone} onChange={handleInputChange} disabled={isProcessing} />
            </div>
          </div>
          
          <Separator />

          <div>
            <h2 className="font-headline text-xl font-semibold mb-4">Order Notes</h2>
            <Label htmlFor="notes" className="sr-only">Order Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Any special instructions for your order?" disabled={isProcessing} />
          </div>
          
          <Button type="submit" size="lg" className="w-full" disabled={isProcessing || cartItems.length === 0}>
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isProcessing ? 'Processing Order...' : 'Place Order & Pay Offline'}
          </Button>
        </form>

        {/* Order Summary & Payment Instructions - takes 2/5 width on lg screens */}
        <div className="rounded-lg border bg-card p-6 shadow-sm lg:col-span-2 h-fit sticky top-24">
          <h2 className="font-headline text-xl font-semibold mb-6">Order Summary</h2>
          {cartItems.length > 0 ? (
            <ul className="mb-6 space-y-3 max-h-60 overflow-y-auto pr-2">
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between items-start text-sm">
                  <div className="flex-grow">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground block">
                      (Qty: {item.quantity}, {item.selectedSize}, {item.selectedColor})
                    </span>
                  </div>
                  <span className="flex-shrink-0">LKR {(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm mb-6">Your cart is empty.</p>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>LKR {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>LKR {shippingEstimate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>LKR {taxEstimate.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-base font-bold">
              <span>Order Total</span>
              <span>LKR {orderTotal.toFixed(2)}</span>
            </div>
          </div>

          <Separator className="my-6" />
          
          <h2 className="font-headline text-lg font-semibold mb-3">Offline Payment Instructions</h2>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important!</AlertTitle>
            <AlertDescription>
              This is an offline payment method. After placing your order, please use the details below to complete your payment.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>
              To complete your purchase, please make a payment to:
            </p>
            <ul className="list-disc list-inside space-y-1 bg-secondary p-3 rounded-md">
              <li><strong>Bank Name:</strong> ARO Bazzar Bank</li>
              <li><strong>Account Name:</strong> ARO Bazzar Store</li>
              <li><strong>Account Number:</strong> 123-456-7890</li>
              <li><strong>Reference:</strong> Your Order ID (will be provided after placing order).</li>
            </ul>
            <p>
              Once payment is confirmed, we'll process your order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

