
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Ensure product.slug is a valid string, otherwise the link might be broken.
  // If product.slug is not guaranteed, you might need a fallback or error handling.
  const productLink = product.slug ? `/product/${product.slug}` : `/product/not-found`; 

  // DEBUGGING: Log the image URL being used for this product card
  if (typeof window !== 'undefined') { // Ensure this only runs on the client-side
    console.log(`ProductCard: Rendering product "${product.name}", Image URL: "${product.imageUrl}"`);
  }

  return (
    <Card className="group overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Link href={productLink} className="block aspect-[3/4] w-full overflow-hidden">
          <Image
            src={product.imageUrl || 'https://placehold.co/400x533.png'} // Fallback image
            alt={product.name}
            width={400}
            height={533}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            data-ai-hint="fashion product"
            onError={(e) => console.error(`Error loading image for ${product.name}: ${product.imageUrl}`, e.currentTarget.currentSrc)}
            unoptimized={product.imageUrl && !product.imageUrl.startsWith('https') ? true : undefined} // Attempt to load non-https as unoptimized
          />
        </Link>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/70 hover:bg-background rounded-full text-foreground/70 hover:text-primary">
          <Heart className="h-5 w-5" />
          <span className="sr-only">Add to wishlist</span>
        </Button>
        {/* Example: Display a "New" badge if product is new */}
        {/* {product.isNew && <Badge className="absolute top-2 left-2">New</Badge>} */}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={productLink}>
          <CardTitle className="font-headline text-lg leading-tight mb-1 hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">{product.categoryName || 'Uncategorized'}</p>
        <p className="text-base font-semibold text-primary">
          LKR {product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={productLink} className="w-full">
          <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
