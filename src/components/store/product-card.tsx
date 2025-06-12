
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const productLink = product.slug ? `/product/${product.slug}` : `/product/not-found`; 

  return (
    <Card className="group overflow-hidden rounded-md border border-border/30 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full bg-card"> {/* Border made more subtle */}
      <CardHeader className="p-0 relative">
        <Link href={productLink} className="block aspect-[3/4] w-full overflow-hidden rounded-t-md">
          <Image
            src={product.imageUrl || 'https://placehold.co/400x533/f0f0f0/333333.png?text=Image+Not+Available'}
            alt={product.name}
            width={400}
            height={533}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            data-ai-hint="fashion product clothing"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.error(`Error loading image for ${product.name}: ${target.src}`);
                // target.srcset = 'https://placehold.co/400x533/f0f0f0/333333.png?text=Error+Loading'; 
              }
            }
          />
        </Link>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 line-clamp-1">{product.categoryName || 'Uncategorized'}</p>
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
      <CardFooter className="p-3 sm:p-4 pt-0 border-t mt-auto">
        <Link href={productLink} className="w-full">
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 font-medium text-sm py-2.5 h-auto">
            View Product
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
