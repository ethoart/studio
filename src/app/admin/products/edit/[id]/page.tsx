
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import type { Product, Category } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useRouter } from "next/navigation";

const productFormSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().optional(),
  sizes: z.string().refine(val => val.split(',').map(s => s.trim()).filter(s => s).length > 0, { message: "Please provide at least one size"}),
  colors: z.string().refine(val => val.split(',').map(s => s.trim()).filter(s => s).length > 0, { message: "Please provide at least one color"}),
  imageUrl: z.string().url("Please enter a valid URL for the main image"),
  additionalImages: z.string().optional(),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Helper to generate a slug (basic version)
const generateSlugFromName = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: "onChange",
  });
  
  // productName watcher is not strictly needed for slug on edit page if we don't auto-update it aggressively
  // const productName = form.watch("name"); 

  useEffect(() => {
    const fetchCategories = async () => {
      setIsFetchingCategories(true);
      try {
        const categoriesCollectionRef = collection(db, "categories");
        const q = query(categoriesCollectionRef, orderBy("name", "asc"));
        const querySnapshot = await getDocs(q);
        const fetchedCategories: Category[] = [];
        querySnapshot.forEach((doc) => {
          fetchedCategories.push({ id: doc.id, ...doc.data() } as Category);
        });
        setCategories(fetchedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast({ title: "Error", description: "Could not fetch categories.", variant: "destructive" });
      } finally {
        setIsFetchingCategories(false);
      }
    };
    fetchCategories();
  }, [toast]);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsFetchingProduct(true);
      setError(null);
      try {
        const productDocRef = doc(db, "products", params.id);
        const productSnap = await getDoc(productDocRef);

        if (productSnap.exists()) {
          const productData = productSnap.data() as Product;
          form.reset({
            name: productData.name,
            categoryId: productData.categoryId,
            description: productData.description,
            price: productData.price,
            stock: productData.stock || 0,
            sku: productData.sku || "",
            sizes: productData.sizes.join(', '),
            colors: productData.colors.join(', '),
            imageUrl: productData.imageUrl,
            additionalImages: (productData.images || []).join(',\n'), // Join with newline for better textarea display
            slug: productData.slug || generateSlugFromName(productData.name),
          });
        } else {
          setError("Product not found.");
          toast({ title: "Error", description: "Product not found.", variant: "destructive" });
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product details.");
        toast({ title: "Error", description: "Could not fetch product details.", variant: "destructive" });
      } finally {
        setIsFetchingProduct(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, form, toast]);

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    const selectedCategory = categories.find(cat => cat.id === data.categoryId);
    if (!selectedCategory) {
      toast({ title: "Error", description: "Selected category not found. Please refresh.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const productDocRef = doc(db, "products", params.id);
      const productDataToUpdate = {
        ...data, // Contains all form fields validated by Zod
        categoryName: selectedCategory.name,
        sizes: data.sizes.split(',').map(s => s.trim()).filter(s => s),
        colors: data.colors.split(',').map(c => c.trim()).filter(c => c),
        images: data.additionalImages ? data.additionalImages.split(',').map(url => url.trim()).filter(url => url) : [],
        updatedAt: serverTimestamp(),
      };
      // We don't want to store 'additionalImages' field itself, as its content is now in 'images' array.
      delete (productDataToUpdate as any).additionalImages;

      console.log('Data to be updated in Firestore (Edit Product):', JSON.stringify(productDataToUpdate, null, 2));

      await updateDoc(productDocRef, productDataToUpdate);
      toast({
        title: "Product Updated Successfully",
        description: `Product "${data.name}" has been updated.`,
      });
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Error updating product in Firestore:", error);
      toast({
        title: "Firestore Error",
        description: `Could not update product: ${error.message || 'Unknown Firestore error.'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingProduct || isFetchingCategories) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="icon" aria-label="Back to products"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="font-headline text-3xl font-bold">Edit Product</h1>
        </div>
        <div className="text-center py-10 bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
          <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <Link href="/admin/products" className="mt-4 inline-block">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon" aria-label="Back to products"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="font-headline text-3xl font-bold">Edit Product: {form.getValues("name")}</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Update the details for this product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Slug</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormDescription>URL-friendly identifier. Change with caution.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={isFetchingCategories}>
                        <FormControl><SelectTrigger><SelectValue placeholder={isFetchingCategories ? "Loading categories..." : "Select category"} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {!isFetchingCategories && categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea rows={5} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (LKR)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl><Input type="number" step="1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU (Optional)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sizes</FormLabel>
                    <FormControl><Input placeholder="e.g., S, M, L, XL" {...field} /></FormControl>
                    <FormDescription>Comma-separated values.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colors</FormLabel>
                    <FormControl><Input placeholder="e.g., Black, White, Beige" {...field} /></FormControl>
                    <FormDescription>Comma-separated values.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Image URL</FormLabel>
                    <FormControl><Input type="url" placeholder="https://placehold.co/600x800.png" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Image URLs (Optional)</FormLabel>
                    <FormControl><Textarea rows={3} placeholder="https://placehold.co/600x800.png, ..." {...field} /></FormControl>
                    <FormDescription>Comma-separated URLs. Use newline for better readability if pasting multiple.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={isLoading || isFetchingProduct || isFetchingCategories}>
                {(isLoading || isFetchingProduct || isFetchingCategories) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
