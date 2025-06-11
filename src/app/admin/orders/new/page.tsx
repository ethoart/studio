
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import type { OrderStatus, CartItem } from "@/types";

const orderFormSchema = z.object({
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  shippingAddress: z.string().min(10, "Shipping address must be at least 10 characters"),
  itemsSummary: z.string().min(10, "Please describe the items in the order"), // Simple summary for now
  totalAmount: z.coerce.number().positive("Total amount must be a positive number"),
  status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], {
    required_error: "Please select an order status.",
  }),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

const defaultValues: Partial<OrderFormValues> = {
  customerName: "",
  customerEmail: "",
  shippingAddress: "",
  itemsSummary: "",
  totalAmount: 0,
  status: "Pending",
};

export default function NewOrderPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = auth.currentUser; // Get current Firebase auth user

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: OrderFormValues) => {
    setIsLoading(true);
    if (!currentUser) {
        toast({ title: "Authentication Error", description: "Admin user not found. Please re-login.", variant: "destructive" });
        setIsLoading(false);
        return;
    }
    try {
      // For manually added items, we'll store them as a descriptive string.
      // In a more advanced system, you'd link to actual product IDs.
      const orderItems: CartItem[] = [{
        id: 'manual',
        name: 'Manually Added Items',
        description: data.itemsSummary,
        price: data.totalAmount, // Assuming totalAmount covers these items
        quantity: 1,
        selectedSize: 'N/A',
        selectedColor: 'N/A',
        category: 'Manual Entry',
        imageUrl: 'https://placehold.co/48x48.png', // Placeholder
        // sizes and colors arrays can be empty for this manual item
        sizes: [],
        colors: [],
      }];

      const orderData = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        shippingAddress: data.shippingAddress,
        items: orderItems, // Store the manually described items
        totalAmount: data.totalAmount,
        status: data.status as OrderStatus,
        orderDate: serverTimestamp(),
        // For manually created orders, userId might be the admin's UID or null if it's for a non-registered customer
        userId: null, // Or potentially admin's UID: currentUser.uid
        // You might want to add a field like 'createdBy: currentUser.uid' to track who created it
        createdBy: currentUser.uid,
        paymentMethod: 'Manual/Offline'
      };

      await addDoc(collection(db, "orders"), orderData);
      toast({
        title: "Order Created",
        description: `Order for ${data.customerName} has been successfully added.`,
      });
      router.push("/admin/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Could not create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="outline" size="icon" aria-label="Back to orders">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="font-headline text-3xl font-bold">Add Manual Order</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Fill in the details for the new manual order.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl><Input {...field} placeholder="John Doe" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Email</FormLabel>
                      <FormControl><Input type="email" {...field} placeholder="john.doe@example.com" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="shippingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Address</FormLabel>
                    <FormControl><Textarea rows={3} {...field} placeholder="123 Main St, Anytown, USA 12345" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="itemsSummary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Items Summary</FormLabel>
                    <FormControl><Textarea rows={4} {...field} placeholder="e.g., 1x Red T-Shirt (L) - LKR 1500&#10;2x Blue Jeans (32) - LKR 3000 each" /></FormControl>
                    <FormDescription>Describe the items, quantities, and prices.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount (LKR)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Order
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
