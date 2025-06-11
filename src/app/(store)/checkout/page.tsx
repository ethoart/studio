
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CheckoutPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, this would submit the form data and create an order
    toast({
      title: "Order Placed (Demo)",
      description: "Your order has been received. Please follow offline payment instructions.",
    });
    // Potentially redirect or clear cart
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-10 text-center">Checkout</h1>
      
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Shipping Information Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="font-headline text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" type="text" required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" type="text" required />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" type="text" required />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" type="text" required />
              </div>
              <div>
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" name="state" type="text" required />
              </div>
              <div>
                <Label htmlFor="zip">ZIP / Postal Code</Label>
                <Input id="zip" name="zip" type="text" required />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="mt-4">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" name="phone" type="tel" />
            </div>
          </div>
          
          <Separator />

          <div>
            <h2 className="font-headline text-xl font-semibold mb-4">Order Notes</h2>
            <Label htmlFor="notes" className="sr-only">Order Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Any special instructions for your order?" />
          </div>
          
          <Button type="submit" size="lg" className="w-full">Place Order</Button>
        </form>

        {/* Offline Payment Instructions */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="font-headline text-xl font-semibold mb-4">Offline Payment Instructions</h2>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important!</AlertTitle>
            <AlertDescription>
              This is an offline payment method. After placing your order, please follow the instructions below to complete your payment.
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 space-y-4 text-sm text-muted-foreground">
            <p>
              Thank you for your order! To complete your purchase, please make a payment to the following bank account:
            </p>
            <ul className="list-disc list-inside space-y-1 bg-secondary p-4 rounded-md">
              <li><strong>Bank Name:</strong> ARO Bazzar Bank</li>
              <li><strong>Account Name:</strong> ARO Bazzar Store</li>
              <li><strong>Account Number:</strong> 123-456-7890</li>
              <li><strong>Reference:</strong> Please use your Order ID as the payment reference.</li>
            </ul>
            <p>
              Once your payment is confirmed, we will process and ship your order. You will receive an email confirmation.
            </p>
            <p>
              If you have any questions, please contact us at <a href="mailto:support@arobazzar.com" className="text-primary hover:underline">support@arobazzar.com</a>.
            </p>
          </div>
          
          {/* Placeholder for order summary if needed, or this can be on cart page */}
          <div className="mt-6 border-t pt-6">
             <h3 className="font-semibold mb-2">Your Order Total:</h3>
             <p className="text-2xl font-bold text-primary">LKR XXX.XX</p>
             <p className="text-xs text-muted-foreground">(This is a placeholder. Actual total will be confirmed.)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
