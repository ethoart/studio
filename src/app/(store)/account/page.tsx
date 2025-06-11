import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, ShoppingBag, Heart, LogOut, Edit } from 'lucide-react';
import Link from 'next/link';

// Placeholder user data
const user = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  joinDate: 'January 15, 2023',
};

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">My Account</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Account Details */}
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
              <p className="text-lg">{user.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
              <p className="text-lg">{user.joinDate}</p>
            </div>
            <Separator />
            <div className="flex space-x-4">
                <Button variant="outline"><Edit className="mr-2 h-4 w-4" />Edit Profile</Button>
                <Button variant="outline">Change Password</Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
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
                <Button variant="outline" className="w-full">View Wishlist</Button>
              </Link>
            </CardContent>
          </Card>
          <Button variant="destructive" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
