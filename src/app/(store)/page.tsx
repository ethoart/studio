import { ImageGallery } from '@/components/store/image-gallery';
import { ProductCard } from '@/components/store/product-card';
import { Button } from '@/components/ui/button';
import { mockHomepageGalleryImages, mockProducts } from '@/lib/mock-data';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const featuredProducts = mockProducts.slice(0, 4); // Show first 4 products as featured

  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      <ImageGallery images={mockHomepageGalleryImages} />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight">Featured Collection</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our handpicked selection of must-have items.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/shop">
            <Button size="lg" variant="outline" className="group">
              Shop All Products <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            Why Choose ARO Bazzar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-background rounded-lg shadow-sm">
              <h3 className="font-headline text-xl font-semibold mb-2">Exclusive Designs</h3>
              <p className="text-muted-foreground text-sm">
                Unique pieces you won&apos;t find anywhere else, crafted with attention to detail.
              </p>
            </div>
            <div className="p-6 bg-background rounded-lg shadow-sm">
              <h3 className="font-headline text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground text-sm">
                We use high-quality materials to ensure comfort, durability, and lasting style.
              </p>
            </div>
            <div className="p-6 bg-background rounded-lg shadow-sm">
              <h3 className="font-headline text-xl font-semibold mb-2">Sustainable Fashion</h3>
              <p className="text-muted-foreground text-sm">
                Committed to ethical practices and sustainable sourcing for a better future.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight">New Arrivals</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Check out the latest additions to our collection.
          </p>
        </div>
         <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {mockProducts.slice(4, 8).map((product) => ( // Show next 4 products as new arrivals
            <ProductCard key={product.id} product={{...product, category: 'New Arrival'}} />
          ))}
        </div>
      </section>

    </div>
  );
}
