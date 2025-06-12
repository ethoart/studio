
"use client";

import Link from 'next/link';
import Image from 'next/image';
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
  const [isSearchOpen, setIsSearchOpen] = React.useState(false); // Mobile search
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = React.useState(false);

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
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm opacity-100">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Trigger (Left) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[320px] p-6 bg-card">
            <nav className="flex flex-col space-y-3 pt-6">
              {navLinks.map((link) => (
                 <SheetClose asChild key={link.href}>
                  <Link                   
                    href={link.href}
                    className={cn(
                      "text-base font-medium transition-colors hover:text-primary pb-2 border-b border-transparent hover:border-primary/50",
                      pathname === link.href ? "text-primary border-primary/50" : "text-foreground/80"
                    )}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              <div className="mt-6 border-t pt-6 space-y-3">
                 <SheetClose asChild>
                   <Button variant="ghost" onClick={() => { setIsSearchOpen(true); }} className="w-full justify-start text-base text-foreground/80 hover:text-primary">
                     <Search className="mr-2 h-5 w-5" /> Search
                   </Button>
                 </SheetClose>
                {!loading && firebaseUser && (
                  <>
                    <SheetClose asChild>
                      <Link href="/account" className="flex items-center p-2 text-base font-medium text-foreground/80 hover:text-primary">
                        <User className="mr-2 h-5 w-5" /> Account
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-base text-red-600 hover:text-red-700 font-medium">
                        <LogOut className="mr-2 h-5 w-5" /> Logout
                      </Button>
                    </SheetClose>
                  </>
                )}
                 {!loading && !firebaseUser && (
                   <SheetClose asChild>
                      <Link href="/login" className="flex items-center p-2 text-base font-medium text-foreground/80 hover:text-primary">
                        <User className="mr-2 h-5 w-5" /> Login/Register
                      </Link>
                    </SheetClose>
                 )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo (Centered on mobile, Left on desktop) */}
        <div className="flex-1 md:flex-none">
          <Link href="/" className="flex items-center justify-center md:justify-start">
            <Image
              src="https://raw.githubusercontent.com/ethoart/ARO-Bazzar-NEXT-JS/main/logo%20pngs/Untitled-2.png"
              alt="ARO Bazzar Logo"
              width={123} 
              height={40} 
              className="object-contain" 
              style={{ objectFit: 'contain', width: 'auto', height: '40px' }} 
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation (Centered) */}
        <nav className="hidden md:flex flex-1 justify-center items-center space-x-6 lg:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-foreground/70"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Icons (Right) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="ghost" size="icon" onClick={() => setIsDesktopSearchOpen(!isDesktopSearchOpen)} className="hidden md:inline-flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Link href="/cart" aria-label="Shopping Cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          
          {!loading && firebaseUser ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="My Account">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card">
                <DropdownMenuLabel>Hi, {user?.name?.split(' ')[0] || 'User'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/account"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
                <Link href="/account/orders"><DropdownMenuItem>Orders</DropdownMenuItem></Link>
                {isAdminUser && (
                    <Link href="/admin"><DropdownMenuItem className="text-primary font-semibold"><Shield className="mr-2 h-4 w-4" />Admin Panel</DropdownMenuItem></Link>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50/50">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !loading ? (
            <Link href="/login" aria-label="Login or Register">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
             <Button variant="ghost" size="icon" disabled>
                <User className="h-5 w-5 animate-pulse" />
             </Button>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay - Solid Background */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-background md:hidden" onClick={() => setIsSearchOpen(false)}>
          <div className="absolute top-1/4 left-1/2 w-[90%] max-w-md -translate-x-1/2 p-4 bg-card border shadow-xl rounded-lg" onClick={(e) => e.stopPropagation()}>
            <Input type="search" placeholder="Search products..." className="w-full h-12 text-lg bg-input" autoFocus />
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setIsSearchOpen(false)}> <LogOut className="rotate-180" /> </Button>
          </div>
        </div>
      )}
      {/* Desktop Search Dropdown */}
      {isDesktopSearchOpen && (
         <div className="hidden md:block absolute top-full left-0 w-full bg-card border-t shadow-lg z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center">
                <Input type="search" placeholder="Search products..." className="w-full max-w-lg h-11 bg-input" autoFocus onBlur={() => setIsDesktopSearchOpen(false)}/>
            </div>
         </div>
      )}
    </header>
  );
}
