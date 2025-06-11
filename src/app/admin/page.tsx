
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, ShoppingCart, TrendingUp, Loader2 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import type { Order } from '@/types';

interface SalesDataPoint {
  name: string;
  sales: number;
}

interface DashboardStats {
  totalRevenue: number;
  newCustomers: number; // For now, total users
  totalOrders: number;
  conversionRate: string; // Placeholder
}

export default function AdminDashboardPage() {
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    // Generate random sales data for the chart (client-side)
    const generateSalesData = () => [
      { name: 'Jan', sales: Math.floor(Math.random() * 500000) + 100000 },
      { name: 'Feb', sales: Math.floor(Math.random() * 500000) + 100000 },
      { name: 'Mar', sales: Math.floor(Math.random() * 500000) + 100000 },
      { name: 'Apr', sales: Math.floor(Math.random() * 500000) + 100000 },
      { name: 'May', sales: Math.floor(Math.random() * 500000) + 100000 },
      { name: 'Jun', sales: Math.floor(Math.random() * 500000) + 100000 },
    ];
    setSalesData(generateSalesData());

    // Fetch dashboard statistics
    const fetchDashboardStats = async () => {
      setLoadingStats(true);
      try {
        // Fetch users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const totalUsers = usersSnapshot.size;

        // Fetch orders
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const totalOrders = ordersSnapshot.size;
        let totalRevenue = 0;
        ordersSnapshot.forEach(doc => {
          const order = doc.data() as Order;
          totalRevenue += order.totalAmount;
        });

        setStats({
          totalRevenue,
          newCustomers: totalUsers, // Using total users as "New Customers" for now
          totalOrders,
          conversionRate: "3.5%", // Placeholder
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Handle error display if needed
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">LKR {stats?.totalRevenue.toFixed(2) || '0.00'}</div>}
            <p className="text-xs text-muted-foreground">+20.1% from last month (demo)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">+{stats?.newCustomers || '0'}</div>}
            <p className="text-xs text-muted-foreground">+10.5% from last month (demo)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">+{stats?.totalOrders || '0'}</div>}
            <p className="text-xs text-muted-foreground">+5.2% from last month (demo)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.conversionRate || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">+0.2% from last month (demo)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Monthly sales performance (demo data).</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `LKR ${value/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [`LKR ${value.toFixed(2)}`, "Sales"]}
              />
              <Legend wrapperStyle={{ color: "hsl(var(--foreground))"}} />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Placeholder for Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Recent orders list will be displayed here (coming soon).</p>
        </CardContent>
      </Card>
    </div>
  );
}
