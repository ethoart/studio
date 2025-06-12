
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge'; // Badge can be added back if needed
// import { Heart } from 'lucide-react'; // Wishlist button removed for cleaner look

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const productLink = product.slug ? `/product/${product.slug}` : `/product/not-found`; 

  // Client-side logging (removed server-side check as it's less useful here)
  // if (typeof window !== 'undefined') { 
  //   console.log(`ProductCard: Rendering product "${product.name}", Image URL: "${product.imageUrl}"`);
  // }

  return (
    <Card className="group overflow-hidden rounded-md border border-border/70 hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-card">
      <CardHeader className="p-0 relative">
        <Link href={productLink} className="block aspect-[3/4] w-full overflow-hidden rounded-t-md">
          <Image
            src={product.imageUrl || 'https://placehold.co/400x533/f0f0f0/333333.png?text=Image+Not+Available'} // Fallback image
            alt={product.name}
            width={400}
            height={533}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            data-ai-hint="fashion product clothing" // More specific hint
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.error(`Error loading image for ${product.name}: ${target.src}`);
                // Optionally set to a default placeholder if error occurs on client
                // target.srcset = 'https://placehold.co/400x533/f0f0f0/333333.png?text=Error'; 
              }
            }
            unoptimized={product.imageUrl && !product.imageUrl.startsWith('https') ? true : undefined}
          />
        </Link>
        {/* Wishlist button removed for cleaner look, can be added back if desired
        <Button variant="ghost" size="icon" className="absolute top-3 right-3 bg-background/60 hover:bg-background/90 rounded-full text-foreground/70 hover:text-primary backdrop-blur-sm">
          <Heart className="h-5 w-5" />
          <span className="sr-only">Add to wishlist</span>
        </Button>
        */}
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.categoryName || 'Uncategorized'}</p>
          <Link href={productLink}>
            <h3 className="font-body text-base font-medium leading-snug mb-1.5 hover:text-primary transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>
        <p className="text-lg font-semibold text-foreground mt-1">
          LKR {product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t mt-auto">
        <Link href={productLink} className="w-full">
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 font-medium text-sm py-2.5">
            View Product
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
