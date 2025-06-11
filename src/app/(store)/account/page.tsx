
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, ShoppingBag, Heart, LogOut, Edit, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns'; // For formatting date if available

export default function AccountPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: "Logout Failed", description: "Could not log out. Please try again.", variant: "destructive" });
    }
  };

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Format join date if available and valid
  let joinDateDisplay = 'N/A';
  if (user.createdAt) {
    try {
      if (typeof user.createdAt === 'string') {
        joinDateDisplay = format(new Date(user.createdAt), 'MMMM dd, yyyy');
      } else if (user.createdAt && typeof (user.createdAt as any).toDate === 'function') { // Firestore Timestamp
        joinDateDisplay = format((user.createdAt as any).toDate(), 'MMMM dd, yyyy');
      }
    } catch (e) {
      console.warn("Could not format createdAt date:", user.createdAt, e);
    }
  }


  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">My Account</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <User className="mr-3 h-7 w-7 text-primary" />
              Account Details
            </CardTitle>
            <CardDescription>Manage your personal information and settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
              <p className="text-lg">{user.name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
              <p className="text-lg">{user.email || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
              <p className="text-lg">{joinDateDisplay}</p>
            </div>
            <Separator />
            <div className="flex space-x-4">
                <Button variant="outline" disabled><Edit className="mr-2 h-4 w-4" />Edit Profile</Button>
                <Button variant="outline" disabled>Change Password</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                My Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">View your order history and track current orders.</p>
              <Link href="/account/orders">
                <Button variant="outline" className="w-full">View Orders</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Heart className="mr-2 h-5 w-5 text-primary" />
                My Wishlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">See items you've saved for later.</p>
              <Link href="/account/wishlist">
                <Button variant="outline" className="w-full" disabled>View Wishlist</Button>
              </Link>
            </CardContent>
          </Card>
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
