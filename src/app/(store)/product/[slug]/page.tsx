
"use client";

import { use, useState, useEffect } from 'react'; // Import 'use'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/types';
import { Star, CheckCircle, Package, ShieldCheck, Heart, Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ProductCard } from '@/components/store/product-card';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, Timestamp } from 'firebase/firestore';

// Define the type for the resolved params object
interface ResolvedPageParams {
  slug: string;
}

// Update the props type: params prop for the page is a Promise that resolves to ResolvedPageParams
interface ProductDetailPageProps {
  params: Promise<ResolvedPageParams>;
}

export default function ProductDetailPage({ params: paramsPromise }: ProductDetailPageProps) {
  // Use React.use to resolve the params promise.
  // This will suspend rendering until the promise is resolved.
  const resolvedParams = use(paramsPromise);
  const { slug } = resolvedParams; // Destructure slug from the resolved params

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Still useful for the async fetch operation itself
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs after 'slug' is resolved and available.
    const fetchProductData = async () => {
      if (!slug) {
        console.warn("ProductDetailPage: Slug is not available, cannot fetch product data.");
        setProduct(null); // Ensure product is null if slug is missing
        setLoading(false);
        return;
      }

      setLoading(true);
      console.log(`ProductDetailPage: Fetching product with slug: "${slug}"`);

      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const fetchedProductData = { id: docSnap.id, ...docSnap.data() } as Product;
          console.log("ProductDetailPage: Product found:", fetchedProductData);
          setProduct(fetchedProductData);

          if (fetchedProductData.colors && fetchedProductData.colors.length > 0) {
            setSelectedColor(fetchedProductData.colors[0]);
          }
          if (fetchedProductData.sizes && fetchedProductData.sizes.length > 0) {
            setSelectedSize(fetchedProductData.sizes[0]);
          }

          if (fetchedProductData.categoryId) {
            const relatedQuery = query(
              productsRef,
              where("categoryId", "==", fetchedProductData.categoryId),
              where("id", "!=", fetchedProductData.id),
              limit(4)
            );
            const relatedSnapshot = await getDocs(relatedQuery);
            const fetchedRelatedProducts: Product[] = [];
            relatedSnapshot.forEach(doc => {
              fetchedRelatedProducts.push({ id: doc.id, ...doc.data() } as Product);
            });
            setRelatedProducts(fetchedRelatedProducts);
            console.log("ProductDetailPage: Related products fetched:", fetchedRelatedProducts.length);
          }
        } else {
          console.warn(`ProductDetailPage: Product with slug "${slug}" not found in Firestore.`);
          setProduct(null);
        }
      } catch (error) {
        console.error("ProductDetailPage: Error fetching product data:", error);
        setProduct(null);
        toast({
          title: "Error",
          description: "Could not load product details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug, toast]); // Depend on the resolved slug and toast

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast({ title: "Please select a size.", variant: "destructive" });
      return;
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      toast({ title: "Please select a color.", variant: "destructive" });
      return;
    }
    console.log('Added to cart:', { ...product, selectedColor, selectedSize, quantity });
    toast({
      title: "Added to Cart!",
      description: `${product.name} (${selectedSize || 'N/A'}, ${selectedColor || 'N/A'}) x ${quantity} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-headline text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The product you are looking for (slug: {slug || "unknown"}) does not exist or may have been removed.
        </p>
        <Link href="/shop">
          <Button size="lg">Back to Shop</Button>
        </Link>
      </div>
    );
  }
  
  // Ensure allImages is an array of strings
  const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean) as string[];


  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg">
            <Image
                src={allImages.length > 0 ? allImages[currentImageIndex] : "https://placehold.co/600x800.png"}
                alt={`${product.name} - view ${currentImageIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-opacity duration-300"
                data-ai-hint="product clothing"
                priority={currentImageIndex === 0} // Only prioritize the initially visible image
            />
             <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-background/70 hover:bg-background rounded-full text-foreground/70 hover:text-primary">
                <Heart className="h-6 w-6" />
                <span className="sr-only">Add to wishlist</span>
            </Button>
            </div>
            {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
                {allImages.map((imgSrc, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square w-full overflow-hidden rounded-md border-2 ${currentImageIndex === index ? 'border-primary' : 'border-transparent'} hover:border-primary transition`}
                >
                    <Image
                    src={imgSrc}
                    alt={`${product.name} - thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="h-full w-full object-cover"
                    data-ai-hint="product thumbnail"
                    />
                </button>
                ))}
            </div>
            )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              {/* Ensure product.rating exists and is a number if you use it */}
              {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < (product.rating || 0) ? 'fill-current' : ''}`} />)}
            </div>
            {/* Ensure product.reviewCount exists and is a number if you use it */}
            <span className="text-sm text-muted-foreground">({product.reviewCount || 0} reviews)</span>
          </div>
          <p className="text-3xl font-bold text-primary">LKR {product.price.toFixed(2)}</p>
          
          <Separator />

          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-foreground">Color: <span className="font-semibold">{selectedColor}</span></h3>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <RadioGroupItem key={color} value={color} id={`color-${color}`} className="sr-only" />
                  ))}
                  {product.colors.map((color) => (
                  <Label 
                      key={color} 
                      htmlFor={`color-${color}`}
                      className={`cursor-pointer rounded-md border-2 p-2 px-3 text-sm transition-all hover:border-primary
                          ${selectedColor === color ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'}`}
                      style={{ backgroundColor: selectedColor === color ? undefined : color.toLowerCase() === 'white' || color.toLowerCase() === 'ivory' ? '#f8f8f8' : color.toLowerCase() }}
                  >
                      {color}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
                <h3 className="text-sm font-medium text-foreground">Size: <span className="font-semibold">{selectedSize}</span></h3>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                    <RadioGroupItem key={size} value={size} id={`size-${size}`} className="sr-only" />
                    ))}
                    {product.sizes.map((size) => (
                        <Label 
                            key={size} 
                            htmlFor={`size-${size}`}
                            className={`cursor-pointer rounded-md border-2 p-2 px-4 text-sm transition-all hover:border-primary
                            ${selectedSize === size ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'}`}
                        >
                            {size}
                        </Label>
                    ))}
                </RadioGroup>
                <Link href="#" className="mt-2 text-sm text-primary hover:underline">Size guide</Link>
            </div>
          )}


          <div>
            <Label htmlFor="quantity" className="text-sm font-medium text-foreground">Quantity</Label>
            <div className="mt-1 flex items-center">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><span className="text-xl leading-none align-middle">-</span></Button>
              <Input 
                type="number" 
                id="quantity" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value,10) || 1))}
                className="w-16 h-10 rounded-md border border-input text-center mx-2"
                min="1"
              />
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}><span className="text-xl leading-none align-middle">+</span></Button>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={handleAddToCart}>Add to Cart</Button>
          
          <Separator />
          
          <div>
            <h3 className="font-headline text-lg font-semibold">Product Description</h3>
            <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{product.description}</p>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Free shipping on orders over LKR 5000</div>
            <div className="flex items-center"><Package className="mr-2 h-5 w-5 text-blue-500" /> Easy 30-day returns</div>
            <div className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-indigo-500" /> Secure payment options</div>
          </div>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t">
          <h2 className="font-headline text-2xl font-bold tracking-tight mb-8 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

    