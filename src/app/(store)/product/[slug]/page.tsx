
"use client"; // Needs to be client for useState if adding to cart, or use server actions

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { mockProducts, getProductBySlug } from '@/lib/mock-data';
import type { Product } from '@/types';
import { Star, CheckCircle, Package, ShieldCheck, Heart } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ProductCard } from '@/components/store/product-card';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { toast } = useToast();

  useEffect(() => {
    const fetchedProduct = getProductBySlug(params.slug);
    if (fetchedProduct) {
      setProduct(fetchedProduct);
      if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
        setSelectedColor(fetchedProduct.colors[0]);
      }
      if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
        setSelectedSize(fetchedProduct.sizes[0]);
      }
    }
  }, [params.slug]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="font-headline text-2xl">Product not found</h1>
        <Link href="/shop" className="text-primary hover:underline mt-4 inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Basic validation
    if (!selectedSize) {
      toast({ title: "Please select a size.", variant: "destructive" });
      return;
    }
    if (!selectedColor) {
      toast({ title: "Please select a color.", variant: "destructive" });
      return;
    }
    // Placeholder for actual add to cart logic
    console.log('Added to cart:', { ...product, selectedColor, selectedSize, quantity });
    toast({
      title: "Added to Cart!",
      description: `${product.name} (${selectedSize}, ${selectedColor}) x ${quantity} has been added to your cart.`,
    });
  };
  
  const relatedProducts = mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const allImages = [product.imageUrl, ...(product.images || [])];

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg">
            <Image
                src={allImages[currentImageIndex]}
                alt={`${product.name} - view ${currentImageIndex + 1}`}
                fill // Use fill for responsive images
                objectFit="cover"
                className="transition-opacity duration-300"
                data-ai-hint="product clothing"
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
                    objectFit="cover"
                    className="h-full w-full"
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
              {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < 4 ? 'fill-current' : ''}`} />)}
            </div>
            <span className="text-sm text-muted-foreground">(125 reviews)</span>
          </div>
          <p className="text-3xl font-bold text-primary">LKR {product.price.toFixed(2)}</p>
          
          <Separator />

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

          <div>
            <Label htmlFor="quantity" className="text-sm font-medium text-foreground">Quantity</Label>
            <div className="mt-1 flex items-center">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><span className="text-xl">-</span></Button>
              <input 
                type="number" 
                id="quantity" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value,10) || 1))}
                className="w-16 h-10 rounded-md border border-input text-center mx-2"
              />
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}><span className="text-xl">+</span></Button>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={handleAddToCart}>Add to Cart</Button>
          
          <Separator />
          
          <div>
            <h3 className="font-headline text-lg font-semibold">Product Description</h3>
            <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
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
