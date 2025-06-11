
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { useState } from "react";

const productFormSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().optional(),
  sizes: z.string().refine(val => val.split(',').map(s => s.trim()).filter(s => s).length > 0, { message: "Please provide at least one size"}),
  colors: z.string().refine(val => val.split(',').map(s => s.trim()).filter(s => s).length > 0, { message: "Please provide at least one color"}),
  imageUrl: z.string().url("Please enter a valid URL for the main image"),
  additionalImages: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const defaultValues: Partial<ProductFormValues> = {
  name: "",
  category: "",
  description: "",
  price: 0,
  stock: 0,
  sku: "",
  sizes: "",
  colors: "",
  imageUrl: "",
  additionalImages: "",
};

export default function NewProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    try {
      const productData = {
        ...data,
        sizes: data.sizes.split(',').map(s => s.trim()).filter(s => s),
        colors: data.colors.split(',').map(c => c.trim()).filter(c => c),
        images: data.additionalImages ? data.additionalImages.split(',').map(url => url.trim()).filter(url => url) : [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      // Remove additionalImages as it's processed into 'images'
      delete (productData as any).additionalImages; 


      await addDoc(collection(db, "products"), productData);
      toast({
        title: "Product Created",
        description: `Product "${data.name}" has been successfully added.`,
      });
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Could not create product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon" aria-label="Back to products">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="font-headline text-3xl font-bold">Add New Product</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Fill in the details for the new product.</CardDescription>
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="outerwear">Outerwear</SelectItem>
                          <SelectItem value="tops">Tops</SelectItem>
                          <SelectItem value="bottoms">Bottoms</SelectItem>
                          <SelectItem value="dresses">Dresses</SelectItem>
                          <SelectItem value="knitwear">Knitwear</SelectItem>
                          <SelectItem value="shoes">Shoes</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
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
                      <FormLabel>Price ($)</FormLabel>
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
                    <FormControl><Textarea rows={3} placeholder="https://placehold.co/600x800.png, https://placehold.co/600x800.png" {...field} /></FormControl>
                    <FormDescription>Comma-separated URLs.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Product
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
