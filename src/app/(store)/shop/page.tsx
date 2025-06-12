
"use client";

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/store/product-card';
import { Button } from '@/components/ui/button';
import { Filter, ChevronDown, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import type { Product, Category } from '@/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, type Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [sortOption, setSortOption] = useState<string>("createdAt_desc"); // Default sort: Newest
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch Categories
        const categoriesCollectionRef = collection(db, "categories");
        const categoriesQuery = query(categoriesCollectionRef, orderBy("name", "asc"));
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const fetchedCategories: Category[] = [];
        categoriesSnapshot.forEach(doc => {
          fetchedCategories.push({ id: doc.id, ...doc.data() } as Category);
        });
        setAllCategories(fetchedCategories);

        // Fetch Products
        fetchProducts();

      } catch (error) {
        console.error("Error fetching initial shop data:", error);
      }
    };
    fetchInitialData();
  }, []); // Initial fetch for categories

  const fetchProducts = async (categoryFilterIds?: string[], currentSortOption?: string) => {
      setIsLoading(true);
      const activeCategoryFilterIds = categoryFilterIds || Array.from(selectedCategoryIds);
      const activeSortOption = currentSortOption || sortOption;
      
      try {
        const productsCollectionRef = collection(db, "products");
        let productsQuery = query(productsCollectionRef); // Base query
        
        // Category Filter
        if (activeCategoryFilterIds.length > 0) {
          productsQuery = query(productsCollectionRef, where("categoryId", "in", activeCategoryFilterIds));
        }

        // Sorting
        const [sortBy, sortDirection] = activeSortOption.split('_') as [string, "asc" | "desc"];
        if (sortBy && sortDirection) {
           // If filtering by category, Firestore requires the first orderBy to be on the field used in inequality filter
           if (activeCategoryFilterIds.length > 0 && sortBy !== "categoryId") {
            productsQuery = query(productsQuery, orderBy("categoryId"), orderBy(sortBy, sortDirection));
           } else {
            productsQuery = query(productsQuery, orderBy(sortBy, sortDirection));
           }
        }


        const productsSnapshot = await getDocs(productsQuery);
        const fetchedProducts: Product[] = [];
        productsSnapshot.forEach(doc => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(fetchedProducts);

      } catch (error: any) {
        console.error("Error fetching products:", error);
        if (error.code === 'failed-precondition') {
          alert("Firestore query requires an index. Please check the console for a link to create it.");
          console.error("Missing Firestore index. Firebase error:", error.message);
        }
      } finally {
        setIsLoading(false);
      }
  };
  
  // Fetch products when category or sort option changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryIds, sortOption]);


  const handleCategoryToggle = (categoryId: string) => {
    const newSelectedCategoryIds = new Set(selectedCategoryIds);
    if (newSelectedCategoryIds.has(categoryId)) {
      newSelectedCategoryIds.delete(categoryId);
    } else {
      newSelectedCategoryIds.add(categoryId);
    }
    setSelectedCategoryIds(newSelectedCategoryIds);
  };

  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption);
  };

  const sortOptions = [
    { label: "Newest", value: "createdAt_desc" },
    { label: "Oldest", value: "createdAt_asc" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Name: A to Z", value: "name_asc" },
    { label: "Name: Z to A", value: "name_desc" },
  ];


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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Category ({selectedCategoryIds.size > 0 ? selectedCategoryIds.size : 'All'}) <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allCategories.length === 0 && <DropdownMenuItem disabled>Loading categories...</DropdownMenuItem>}
              {allCategories.map(cat => (
                <DropdownMenuCheckboxItem
                  key={cat.id}
                  checked={selectedCategoryIds.has(cat.id)}
                  onCheckedChange={() => handleCategoryToggle(cat.id)}
                  onSelect={(e) => e.preventDefault()} // Keep menu open
                >
                  {cat.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Add more filters like Color, Size later if needed */}
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort by: {sortOptions.find(opt => opt.value === sortOption)?.label || 'Select'} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map(opt => (
                <DropdownMenuItem key={opt.value} onClick={() => handleSortChange(opt.value)}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
         <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
            <ShoppingBagIcon className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="font-headline text-2xl font-bold mb-2">No Products Found</h2>
            <p className="text-muted-foreground">
                Try adjusting your filters or check back later.
                {selectedCategoryIds.size > 0 && (
                    <Button variant="link" onClick={() => setSelectedCategoryIds(new Set())}>Clear category filter</Button>
                )}
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Placeholder for pagination if needed later */}
      {/* <div className="mt-12 flex justify-center">
        <Button variant="outline" disabled={isLoading}>Load More</Button>
      </div> */}
    </div>
  );
}

// Placeholder icon, replace with actual if available or remove
function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
