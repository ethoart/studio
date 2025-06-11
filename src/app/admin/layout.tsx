
"use client";

import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseUser, isAdminUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!firebaseUser) {
        // Not logged in, redirect to login
        router.push('/login');
      } else if (!isAdminUser) {
        // Logged in but not an admin, redirect to homepage
        // You could also redirect to a specific "access denied" page
        router.push('/');
      }
    }
  }, [firebaseUser, isAdminUser, loading, router]);

  if (loading || !firebaseUser || !isAdminUser) {
    // Show a loading spinner or a minimal message while checking auth/redirecting
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted/40">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If user is an admin, render the admin layout
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <AdminSidebar />
        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
