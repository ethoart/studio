
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ImageGallery } from '@/components/store/image-gallery';
import { ProductCard } from '@/components/store/product-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoadingFeatured(true);
      try {
        const productsRef = collection(db, "products");
        // Placeholder for "featured": fetch first 4 products by name.
        // A proper "featured" system would involve a flag in Firestore.
        const q = query(productsRef, orderBy("name", "asc"), limit(4));
        const querySnapshot = await getDocs(q);
        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() } as Product);
        });
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    const fetchNewArrivals = async () => {
      setLoadingNewArrivals(true);
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, orderBy("createdAt", "desc"), limit(4));
        const querySnapshot = await getDocs(q);
        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Ensure createdAt is a Firestore Timestamp before converting
          let createdAt = data.createdAt;
          if (createdAt && !(createdAt instanceof Timestamp) && typeof createdAt.toDate === 'function') {
             createdAt = createdAt.toDate(); // Convert if it's a Firestore-like object but not instance of Timestamp
          } else if (typeof createdAt === 'string') {
             createdAt = new Date(createdAt); // Convert if string
          }
          products.push({ id: doc.id, ...data, createdAt } as Product);
        });
        setNewArrivals(products);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoadingNewArrivals(false);
      }
    };

    fetchFeaturedProducts();
    fetchNewArrivals();
  }, []);

  const ProductListSkeleton = () => (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-[300px] w-full sm:h-[350px] md:h-[400px]" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      {/* ImageGallery fetches its own images from Firestore */}
      <ImageGallery />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight">Featured Collection</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our handpicked selection of must-have items.
          </p>
        </div>
        {loadingFeatured ? (
          <ProductListSkeleton />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No featured products available at the moment.</p>
          </div>
        )}
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
        {loadingNewArrivals ? (
          <ProductListSkeleton />
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
           <div className="text-center py-10">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No new arrivals to display right now.</p>
          </div>
        )}
      </section>
    </div>
  );
}
