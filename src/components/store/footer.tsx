
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react'; // Removed Youtube, Linkedin
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background text-foreground/80">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          <div>
            <h4 className="font-headline text-lg font-semibold mb-4">ARO Bazzar</h4>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Timeless fashion for the modern individual. Explore our curated collections of quality apparel and accessories.
            </p>
          </div>

          <div>
            <h4 className="font-headline text-md font-semibold mb-4 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="text-foreground/70 hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=new-arrivals" className="text-foreground/70 hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?category=best-sellers" className="text-foreground/70 hover:text-primary transition-colors">Best Sellers</Link></li>
              <li><Link href="/shop?category=sale" className="text-foreground/70 hover:text-primary transition-colors">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-headline text-md font-semibold mb-4 uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping-returns" className="text-foreground/70 hover:text-primary transition-colors">Shipping & Returns</Link></li>
              {/* Removed FAQ and Size Guide */}
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-md font-semibold mb-4 uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm text-foreground/70 mb-3">
              Stay updated with our latest collections, offers, and style tips.
            </p>
            <form className="flex gap-2">
              <Input type="email" placeholder="Enter your email" className="bg-background border-border placeholder:text-muted-foreground/70 text-sm" />
              <Button type="submit" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">Subscribe</Button>
            </form>
            <div className="mt-6 flex space-x-4">
              <a href="https://web.facebook.com/profile.php?id=100076276321366" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/arobazzar/" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              {/* Removed YouTube and LinkedIn */}
            </div>
          </div>

        </div>
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-xs text-foreground/60">&copy; {currentYear} ARO Bazzar. All rights reserved. Powered by Passion.</p>
        </div>
      </div>
    </footer>
  );
}
