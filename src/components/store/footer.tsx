
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          <div>
            <h4 className="font-headline text-xl font-semibold mb-4 text-foreground">ARO Bazzar</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Timeless fashion for the modern individual.
            </p>
          </div>

          <div>
            <h4 className="font-headline text-base font-semibold mb-4 uppercase tracking-wider text-foreground">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 inline-block origin-left">All Products</Link></li>
              <li><Link href="/shop?category=new-arrivals" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 inline-block origin-left">New Arrivals</Link></li>
              <li><Link href="/shop?category=best-sellers" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 inline-block origin-left">Best Sellers</Link></li>
              <li><Link href="/shop?category=sale" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 inline-block origin-left">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-headline text-base font-semibold mb-4 uppercase tracking-wider text-foreground">Customer Care</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 inline-block origin-left">Contact Us</Link></li>
              <li><Link href="/shipping-returns" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 inline-block origin-left">Shipping & Returns</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-base font-semibold mb-4 uppercase tracking-wider text-foreground">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Stay updated with our latest.
            </p>
            <form className="flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-background border-input placeholder:text-muted-foreground/80 text-sm focus:border-primary" />
              <Button type="submit" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform duration-200 hover:scale-105">
                Subscribe
              </Button>
            </form>
            <div className="mt-8 flex space-x-5">
              <a href="https://web.facebook.com/profile.php?id=100076276321366" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-transform duration-200 hover:scale-125" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/arobazzar/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-transform duration-200 hover:scale-125" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

        </div>
        <div className="mt-16 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">&copy; {currentYear} ARO Bazzar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
