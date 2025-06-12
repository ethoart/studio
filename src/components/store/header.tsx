
"use client";

import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import { ShoppingCart, User, Search, Menu, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context'; 
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact Us' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, firebaseUser, isAdminUser, loading: authLoading } = useAuth();
  const { cartItems, loading: cartContextLoading } = useCart(); 
  const { toast } = useToast();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const loading = authLoading || cartContextLoading; 

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

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="https://raw.githubusercontent.com/ethoart/ARO-Bazzar-NEXT-JS/main/logo%20pngs/Untitled-2.png"
            alt="ARO Bazzar Logo"
            width={60} 
            height={20} 
            className="object-contain" 
            style={{ objectFit: 'contain' }} // Added explicit style
            priority
          />
        </Link>

        <nav className="hidden items-center space-x-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-foreground/70"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-1 sm:space-x-3">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="hidden md:inline-flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </Link>
          
          {!loading && firebaseUser ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">My Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hi, {user?.name?.split(' ')[0] || 'User'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/account"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
                <Link href="/account/orders"><DropdownMenuItem>Orders</DropdownMenuItem></Link>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !loading ? (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Login</span>
              </Button>
            </Link>
          ) : (
             <Button variant="ghost" size="icon" disabled>
                <User className="h-5 w-5 animate-pulse" />
             </Button>
          )}

          {isAdminUser && (
             <Link href="/admin">
              <Button variant="ghost" size="icon" title="Admin Panel">
                <Shield className="h-5 w-5" />
                <span className="sr-only">Admin Panel</span>
              </Button>
            </Link>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 pt-6">
                {navLinks.map((link) => (
                   <SheetClose asChild key={link.href}>
                    <Link                   
                      href={link.href}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary" : "text-foreground/70"
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="mt-4 border-t pt-4 space-y-2">
                   <SheetClose asChild>
                     <Button variant="ghost" onClick={() => { setIsSearchOpen(!isSearchOpen); setIsMobileMenuOpen(false); }} className="w-full justify-start text-lg">
                       <Search className="mr-2 h-5 w-5" /> Search
                     </Button>
                   </SheetClose>
                  {!loading && firebaseUser && (
                    <>
                      <SheetClose asChild>
                        <Link href="/account" className="flex items-center p-2 text-lg font-medium text-foreground/70 hover:text-primary">
                          <User className="mr-2 h-5 w-5" /> Account
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-lg text-red-600 hover:text-red-700">
                          <LogOut className="mr-2 h-5 w-5" /> Logout
                        </Button>
                      </SheetClose>
                    </>
                  )}
                   {!loading && !firebaseUser && (
                     <SheetClose asChild>
                        <Link href="/login" className="flex items-center p-2 text-lg font-medium text-foreground/70 hover:text-primary">
                          <User className="mr-2 h-5 w-5" /> Login/Register
                        </Link>
                      </SheetClose>
                   )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full border-b bg-background p-4 shadow-md md:hidden">
          <Input type="search" placeholder="Search products..." className="w-full" />
        </div>
      )}
      {isSearchOpen && (
         <div className="hidden md:block absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-background border-t shadow-md z-40">
            <Input type="search" placeholder="Search products..." className="w-full" />
         </div>
      )}
    </header>
  );
}
