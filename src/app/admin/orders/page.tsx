
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, FileDown, MoreHorizontal, Loader2, AlertTriangle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Order, OrderStatus } from "@/types";
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, type Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


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
            orderDate: data.orderDate, 
            shippingAddress: data.shippingAddress || 'N/A',
            userId: data.userId || undefined,
          });
        });
        setOrders(fetchedOrders);
      } catch (err: any) {
        console.error("Detailed error fetching orders:", err); // Log the actual Firebase error object
        let detailedErrorMessage = "Failed to fetch orders. Please ensure you have an 'orders' collection in Firestore and appropriate security rules.";
        if (err.code) { 
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

  const formatDate = (dateValue: Timestamp | string | undefined) => {
    if (!dateValue) return 'N/A';
    try {
      if (typeof dateValue === 'string') {
        return format(new Date(dateValue), 'MMM dd, yyyy');
      }
      if (dateValue && typeof (dateValue as Timestamp).toDate === 'function') {
        return format((dateValue as Timestamp).toDate(), 'MMM dd, yyyy');
      }
    } catch (e) {
      console.warn("Could not format date:", dateValue, e);
    }
    return String(dateValue); 
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
            Please check your browser's developer console for more specific Firebase error details. Ensure your Firestore Security Rules allow admin access to the 'orders' collection and that the collection exists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (orders.length === 0 && !loading) {
     return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Order Management</h1>
           <Button disabled>
            <FileDown className="mr-2 h-4 w-4" /> Export Orders
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>View and manage all customer orders.</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground">No orders found.</p>
            <p className="text-sm text-muted-foreground mt-2">
                If you have placed orders, ensure you have an 'orders' collection in Firestore with appropriate data and security rules.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Order Management</h1>
        <Button disabled> 
          <FileDown className="mr-2 h-4 w-4" /> Export Orders
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage all customer orders. Displaying {orders.length} orders.</CardDescription>
        </CardHeader>
        <CardContent>
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
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}
