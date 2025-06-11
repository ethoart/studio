import { ProductCard } from '@/components/store/product-card';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/lib/mock-data';
import { Filter, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// This is a server component, so state for filters would need client-side handling or URL params in a real app.
// For now, it's a static display.

export default function ShopPage() {
  const categories = Array.from(new Set(mockProducts.map(p => p.category)));
  const colors = Array.from(new Set(mockProducts.flatMap(p => p.colors)));
  const sizes = Array.from(new Set(mockProducts.flatMap(p => p.sizes)));

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Shop Collection</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Explore our wide range of fashion products.
        </p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filters:</span>
          {/* Placeholder filter buttons. Real implementation would use client components and state. */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Category <ChevronDown className="ml-2 h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map(cat => (
                <DropdownMenuItem key={cat} className="flex items-center space-x-2">
                  <Checkbox id={`cat-${cat}`} /> <Label htmlFor={`cat-${cat}`}>{cat}</Label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Color <ChevronDown className="ml-2 h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Color</DropdownMenuLabel>
              <DropdownMenuSeparator />
               {colors.map(col => (
                <DropdownMenuItem key={col} className="flex items-center space-x-2">
                  <Checkbox id={`col-${col}`} /> <Label htmlFor={`col-${col}`}>{col}</Label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Size <ChevronDown className="ml-2 h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Size</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sizes.map(size => (
                <DropdownMenuItem key={size} className="flex items-center space-x-2">
                  <Checkbox id={`size-${size}`} /> <Label htmlFor={`size-${size}`}>{size}</Label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Sort by <ChevronDown className="ml-2 h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Featured</DropdownMenuItem>
              <DropdownMenuItem>Newest</DropdownMenuItem>
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Placeholder for pagination */}
      <div className="mt-12 flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
}
