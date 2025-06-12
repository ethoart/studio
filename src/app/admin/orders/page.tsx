
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, FileDown, MoreHorizontal, Loader2, AlertTriangle, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Order, OrderStatus } from "@/types";
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, type Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';


export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const ordersCollectionRef = collection(db, "orders");
        // Ensure you have an index on orderDate desc for this query
        const q = query(ordersCollectionRef, orderBy("orderDate", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedOrders.push({
            id: doc.id,
            customerName: data.customerName || 'N/A',
            customerEmail: data.customerEmail || 'N/A',
            items: data.items || [],
            totalAmount: data.totalAmount || 0,
            status: data.status as OrderStatus || 'Pending',
            orderDate: data.orderDate as Timestamp, // Firestore typically returns Timestamp
            shippingAddress: data.shippingAddress || 'N/A',
            userId: data.userId || undefined,
            paymentMethod: data.paymentMethod || 'N/A',
            createdBy: data.createdBy || undefined,
          });
        });
        setOrders(fetchedOrders);
      } catch (err: any) {
        console.error("Detailed error fetching orders:", err); 
        let detailedErrorMessage = "Failed to fetch orders. Please ensure you have an 'orders' collection in Firestore and appropriate security rules.";
        if (err.code === 'failed-precondition' && err.message.includes('index')) {
          detailedErrorMessage += " The query requires an index. Please check the Firestore console for a link to create it (usually involving the 'orderDate' field sorted descending).";
        } else if (err.code) { 
          detailedErrorMessage += ` Firebase error details: Code: ${err.code}. Message: ${err.message}`;
        } else {
          detailedErrorMessage += ` Details: ${err.message || 'Unknown error'}`;
        }
        setError(detailedErrorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'default'; 
      case 'Shipped': return 'secondary';
      case 'Processing': return 'outline'; 
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDate = (dateValue: Timestamp | undefined) => {
    if (!dateValue) return 'N/A';
    try {
        // Check if it's a Firestore Timestamp and has the toDate method
        if (dateValue && typeof dateValue.toDate === 'function') {
         return format(dateValue.toDate(), 'MMM dd, yyyy, p'); // Added time
        }
        // Fallback for string dates (e.g., from manual entry or older data)
        if (typeof dateValue === 'string') {
          const parsedDate = new Date(dateValue);
          if (!isNaN(parsedDate.getTime())) {
            return format(parsedDate, 'MMM dd, yyyy, p');
          }
        }
    } catch (e) {
      console.warn("Could not format date:", dateValue, e);
    }
    return String(dateValue); // Fallback if not a recognized Timestamp or valid date string
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="space-y-6">
         <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Order Management</h1>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Orders</AlertTitle>
          <AlertDescription>
            {error}
            <br />
            Please check your browser's developer console for more specific Firebase error details.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Order Management</h1>
        <div className="flex gap-2">
          <Link href="/admin/orders/new">
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Manual Order</Button>
          </Link>
          <Button disabled> 
            <FileDown className="mr-2 h-4 w-4" /> Export Orders
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage all customer orders. Displaying {orders.length} orders.</CardDescription>
        </CardHeader>
        <CardContent>
           {orders.length === 0 && !loading && (
             <div className="text-center py-10">
                <p className="text-muted-foreground">No orders found.</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Ensure orders are being placed through the storefront or added manually.
                </p>
            </div>
           )}
          {orders.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0,7)}...</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{formatDate(order.orderDate as Timestamp | undefined)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">LKR {order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                            <DropdownMenuItem disabled>Update Status</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

