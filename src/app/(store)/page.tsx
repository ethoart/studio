
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ImageGallery } from '@/components/store/image-gallery';
import { ProductCard } from '@/components/store/product-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ShoppingBag, Shirt, Zap, ShieldCheck } from 'lucide-react'; 
import type { Product, HomepageFeatureItem } from '@/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';

const WHY_CHOOSE_US_PATH = "site_settings/homepage/featureItems";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [whyChooseUsItems, setWhyChooseUsItems] = useState<HomepageFeatureItem[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);
  const [loadingWhyChooseUs, setLoadingWhyChooseUs] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoadingFeatured(true);
      try {
        const productsRef = collection(db, "products");
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
          let createdAt = data.createdAt;
          if (createdAt && !(createdAt instanceof Timestamp) && typeof createdAt.toDate === 'function') {
             createdAt = createdAt.toDate();
          } else if (typeof createdAt === 'string') {
             createdAt = new Date(createdAt);
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

    const fetchWhyChooseUsItems = async () => {
      setLoadingWhyChooseUs(true);
      try {
        const itemsRef = collection(db, WHY_CHOOSE_US_PATH);
        const q = query(itemsRef, orderBy("createdAt", "asc"), limit(3));
        const querySnapshot = await getDocs(q);
        const items: HomepageFeatureItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as HomepageFeatureItem);
        });
        setWhyChooseUsItems(items);
      } catch (error) {
        console.error("Error fetching 'Why Choose Us' items:", error);
      } finally {
        setLoadingWhyChooseUs(false);
      }
    };

    fetchFeaturedProducts();
    fetchNewArrivals();
    fetchWhyChooseUsItems();
  }, []);

  const ProductListSkeleton = () => (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3 p-2 border border-transparent rounded-lg">
          <Skeleton className="h-[350px] w-full sm:h-[400px] md:h-[450px] rounded-md" />
          <Skeleton className="h-5 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto" />
        </div>
      ))}
    </div>
  );

  const WhyChooseUsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6 text-center">
          <Skeleton className="h-10 w-10 mx-auto mb-4 rounded-full" />
          <Skeleton className="h-6 w-3/4 mb-3 mx-auto" />
          <Skeleton className="h-4 w-full mb-1 mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </div>
      ))}
    </div>
  );

  const featureIcons = [Shirt, Zap, ShieldCheck];

  return (
    <div className="space-y-20 md:space-y-28 lg:space-y-36"> {/* Increased base spacing */}
      <ImageGallery />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"> {/* Added vertical padding */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">Featured Collection</h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Handpicked styles that define elegance and quality. Discover your next favorite piece.
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
        <div className="mt-12 md:mt-16 text-center">
          <Link href="/shop">
            <Button size="lg" variant="outline" className="group text-base px-8 py-3 rounded-md border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Shop All Products <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-secondary/30 py-16 md:py-24"> {/* Adjusted background opacity */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-12 md:mb-16">
            Why Choose ARO Bazzar?
          </h2>
          {loadingWhyChooseUs ? (
            <WhyChooseUsSkeleton />
          ) : whyChooseUsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {whyChooseUsItems.map((item, index) => {
                const IconComponent = featureIcons[index % featureIcons.length] || Shirt; 
                return (
                  <div key={item.id} className="p-6 text-center">
                    <IconComponent className="h-10 w-10 mx-auto mb-5 text-primary" strokeWidth={1.5}/>
                    <h3 className="font-headline text-xl lg:text-2xl font-medium mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          ) : (
             <div className="p-6">
              <h3 className="font-headline text-xl font-semibold mb-2">Configure in CMS</h3>
              <p className="text-muted-foreground text-sm">
                Add items to the &quot;Why Choose Us&quot; section from the admin panel under Storefront Settings &gt; Homepage Features.
              </p>
            </div>
          )}
        </div>
      </section>
      
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">New Arrivals</h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            The latest trends and timeless pieces, freshly added to our curated collection.
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
