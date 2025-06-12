
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react'; // Removed Twitter

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-headline text-xl font-semibold text-primary">ARO Bazzar</h3>
            <p className="mt-2 text-sm text-foreground/70">
              Discover the latest trends in fashion. Quality clothing for every occasion.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold uppercase tracking-wider text-foreground/80">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/shop" className="text-foreground/70 hover:text-primary">Shop All</Link></li>
              <li><Link href="/contact" className="text-foreground/70 hover:text-primary">Contact Us</Link></li>
              {/* Removed FAQ and Shipping & Returns links */}
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold uppercase tracking-wider text-foreground/80">Connect</h4>
            <div className="mt-4 flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              {/* Removed Twitter link */}
            </div>
            <p className="mt-4 text-sm text-foreground/70">
              Subscribe to our newsletter for updates and special offers.
            </p>
            {/* Newsletter form placeholder */}
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-foreground/60">
          <p>&copy; {currentYear} ARO Bazzar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
