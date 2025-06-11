
"use client";

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact Us' },
  // { href: '/about', label: 'About Us' }, // Example additional link
];

// Placeholder for user authentication state
const useUser = () => ({ user: null, isAdmin: false }); // Replace with actual auth logic

export function Header() {
  const pathname = usePathname();
  const { user, isAdmin } = useUser(); // Placeholder

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <span className="font-headline text-2xl font-bold text-primary">ARO Bazzar</span>
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

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="hidden md:inline-flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </Link>
          <Link href={user ? "/account" : "/login"}>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
          {isAdmin && (
             <Link href="/admin">
              <Button variant="ghost" size="icon" title="Admin Panel">
                <Shield className="h-5 w-5" />
                <span className="sr-only">Admin Panel</span>
              </Button>
            </Link>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 pt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary" : "text-foreground/70"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 border-t pt-4">
                   <Button variant="ghost" onClick={() => setIsSearchOpen(!isSearchOpen)} className="w-full justify-start text-lg">
                     <Search className="mr-2 h-5 w-5" /> Search
                   </Button>
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
         <div className="hidden md:block absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-background border-b shadow-md">
            <Input type="search" placeholder="Search products..." className="w-full" />
         </div>
      )}
    </header>
  );
}
