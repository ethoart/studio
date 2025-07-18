
"use client";

import { use, useEffect, useState } from 'react'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, AlertTriangle, Package, Phone, Receipt, Mail } from "lucide-react";
import type { Order, OrderStatus, CartItem } from "@/types";
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { sendOrderStatusUpdateEmail, type OrderStatusUpdateEmailInput } from '@/ai/flows/send-order-update-email-flow';


const orderStatusOptions: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params: paramsPromise }: OrderDetailPageProps) {
  const params = use(paramsPromise);
  const orderIdFromParams = params.id; 

  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>(undefined);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderIdFromParams) { 
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const orderDocRef = doc(db, "orders", orderIdFromParams); 
        const orderSnap = await getDoc(orderDocRef);

        if (orderSnap.exists()) {
          const orderData = orderSnap.data() as Order;
          setOrder({ ...orderData, id: orderSnap.id });
          setSelectedStatus(orderData.status);
        } else {
          setError("Order not found.");
          toast({ title: "Error", description: "Order not found.", variant: "destructive" });
        }
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(`Failed to fetch order details: ${err.message}`);
        toast({ title: "Error", description: "Could not fetch order details.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    
    if (orderIdFromParams) {
        fetchOrder();
    }
  }, [orderIdFromParams, toast]); 

  const handleUpdateStatus = async () => {
    if (!order || !selectedStatus) {
      toast({ title: "Error", description: "No order or status selected.", variant: "destructive" });
      return;
    }
    setIsUpdatingStatus(true);
    try {
      const orderDocRef = doc(db, "orders", order.id);
      await updateDoc(orderDocRef, { status: selectedStatus, updatedAt: Timestamp.now() }); 
      
      const updatedOrder = { ...order, status: selectedStatus, updatedAt: Timestamp.now() };
      setOrder(updatedOrder as Order); // Cast as Order because Timestamp.now() is compatible
      toast({ title: "Status Updated", description: `Order status changed to ${selectedStatus}.` });

      // Trigger email notification (stub)
      if (updatedOrder.customerEmail && selectedStatus !== order.status) { // Only send if status actually changed
        const itemsSummary = updatedOrder.items.length > 0
          ? `${updatedOrder.items[0].name}${updatedOrder.items.length > 1 ? ` and ${updatedOrder.items.length - 1} other item(s)` : ''}`
          : 'Your recent order';
        
        const emailInput: OrderStatusUpdateEmailInput = {
          orderId: updatedOrder.id,
          customerEmail: updatedOrder.customerEmail,
          customerName: updatedOrder.customerName,
          newStatus: selectedStatus,
          itemsSummary: itemsSummary,
          totalAmount: updatedOrder.totalAmount,
          // trackingLink: selectedStatus === 'Shipped' ? 'https://example.com/track/' + updatedOrder.id : undefined, // Placeholder
          // orderLink: `https://yourstore.com/account/orders/${updatedOrder.id}` // Placeholder
        };
        
        try {
            const emailResult = await sendOrderStatusUpdateEmail(emailInput);
            if (emailResult.success) {
                toast({ title: "Customer Notified (Simulated)", description: `An email simulation for status '${selectedStatus}' was successful.`});
            } else {
                toast({ title: "Notification Failed (Simulated)", description: emailResult.message, variant: "destructive" });
            }
        } catch (emailError: any) {
            toast({ title: "Notification Error (Simulated)", description: `Could not simulate email: ${emailError.message}`, variant: "destructive" });
        }
      }

    } catch (err: any) {
      console.error("Error updating status:", err);
      toast({ title: "Error", description: `Could not update status: ${err.message}`, variant: "destructive" });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatDate = (dateValue: Timestamp | undefined | string | Date) => {
    if (!dateValue) return 'N/A';
    try {
      if (dateValue instanceof Timestamp) {
        return format(dateValue.toDate(), 'PPP p');
      }
      if (dateValue instanceof Date) {
        return format(dateValue, 'PPP p');
      }
      const parsedDate = new Date(dateValue as string);
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, 'PPP p');
      }
    } catch (e) {
      console.warn("Could not format date:", dateValue, e);
    }
    return String(dateValue);
  };

  const getStatusBadgeVariant = (status?: OrderStatus) => {
    if (!status) return 'outline';
    switch (status) {
      case 'Delivered': return 'default';
      case 'Shipped': return 'secondary';
      case 'Processing': return 'outline';
      case 'Pending': return 'outline';
      case 'Returned': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon" aria-label="Back to orders"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="font-headline text-3xl font-bold">Order Details</h1>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Order</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon" aria-label="Back to orders"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="font-headline text-3xl font-bold">Order Details</h1>
        </div>
        <p className="text-muted-foreground text-center py-10">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon" aria-label="Back to orders">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-headline text-2xl md:text-3xl font-bold">Order #{order.id.substring(0, 7)}...</h1>
        </div>
        <Badge variant={getStatusBadgeVariant(order.status)} className="text-sm px-3 py-1 self-start sm:self-center">
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {order.items && order.items.length > 0 ? (
                <ul className="divide-y divide-border">
                  {order.items.map((item, index) => (
                    <li key={`${item.productId}-${index}`} className="flex items-start gap-4 py-4">
                      <Image
                        src={item.imageUrl || "https://placehold.co/64x64.png"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover border"
                        data-ai-hint="product order"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                          {item.selectedColor && item.selectedSize && ", "}
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                        </p>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">LKR {(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="mx-auto h-12 w-12 mb-2" />
                  <p>No items found in this order.</p>
                </div>
              )}
            </CardContent>
             <CardFooter className="border-t pt-4">
                <div className="w-full space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>LKR {order.subtotal?.toFixed(2) || order.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>LKR {order.shipping?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>LKR {order.tax?.toFixed(2) || '0.00'}</span>
                    </div>
                    {order.codCharge && order.codCharge > 0 && (
                        <div className="flex justify-between">
                            <span>COD Charge:</span>
                            <span>LKR {order.codCharge.toFixed(2)}</span>
                        </div>
                    )}
                    <Separator className="my-1"/>
                    <div className="flex justify-between font-bold text-base">
                        <span>Order Total:</span>
                        <span>LKR {order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
             </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Customer & Shipping</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <Label className="font-medium">Customer</Label>
                <p>{order.customerName}</p>
                <p className="text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{order.customerEmail}</p>
              </div>
               {order.customerPhone && (
                <div>
                  <Label className="font-medium flex items-center"><Phone className="mr-2 h-4 w-4" /> Phone</Label>
                  <p className="text-muted-foreground">{order.customerPhone}</p>
                </div>
              )}
              <div>
                <Label className="font-medium">Shipping Address</Label>
                <p className="whitespace-pre-line">{order.shippingAddress}</p>
              </div>
              {order.userId && (
                <div>
                  <Label className="font-medium">User ID</Label>
                  <p className="text-muted-foreground">{order.userId}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Order Information</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <Label className="font-medium">Order Date</Label>
                <p>{formatDate(order.orderDate)}</p>
              </div>
              <div>
                <Label className="font-medium">Last Updated</Label>
                <p>{formatDate(order.updatedAt)}</p>
              </div>
              <div>
                <Label className="font-medium flex items-center"><Receipt className="mr-2 h-4 w-4" />Payment Method</Label>
                <p>{order.paymentMethod || 'N/A'}</p>
              </div>
              {order.createdBy && (
                <div>
                  <Label className="font-medium">Created By (Admin)</Label>
                  <p className="text-muted-foreground">{order.createdBy}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="orderStatus">Order Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
                  disabled={isUpdatingStatus}
                >
                  <SelectTrigger id="orderStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateStatus} disabled={isUpdatingStatus || selectedStatus === order.status} className="w-full">
                {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

