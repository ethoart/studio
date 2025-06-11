"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Product } from "@/types";
import { getProductById } from "@/lib/mock-data"; // Assuming you have this function

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchedProduct = getProductById(params.id); // Fetch product by ID
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    } else {
      toast({ title: "Product not found", variant: "destructive" });
      // Redirect or show error
    }
  }, [params.id, toast]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder logic for updating a product
    toast({
      title: "Product Updated (Demo)",
      description: `Product ${product?.name || ''} has been updated.`,
    });
  };

  if (!product) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <h1 className="font-headline text-3xl font-bold">Edit Product</h1>
            </div>
            <p>Loading product details or product not found...</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
            <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="font-headline text-3xl font-bold">Edit Product: {product.name}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Update the details for this product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" name="productName" defaultValue={product.name} required />
              </div>
              <div>
                <Label htmlFor="productCategory">Category</Label>
                <Select name="productCategory" defaultValue={product.category}>
                  <SelectTrigger id="productCategory">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
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
              </div>
            </div>
            
            <div>
              <Label htmlFor="productDescription">Description</Label>
              <Textarea id="productDescription" name="productDescription" rows={5} defaultValue={product.description} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="productPrice">Price ($)</Label>
                <Input id="productPrice" name="productPrice" type="number" step="0.01" defaultValue={product.price} required />
              </div>
              <div>
                <Label htmlFor="productStock">Stock Quantity</Label>
                <Input id="productStock" name="productStock" type="number" step="1" defaultValue={product.stock || 0} required />
              </div>
              <div>
                <Label htmlFor="productSku">SKU (Optional)</Label>
                <Input id="productSku" name="productSku" defaultValue={"" /* product.sku or similar */} />
              </div>
            </div>

            <div>
              <Label htmlFor="productSizes">Sizes (comma-separated)</Label>
              <Input id="productSizes" name="productSizes" placeholder="e.g., S, M, L, XL" defaultValue={product.sizes.join(', ')} />
            </div>
            <div>
              <Label htmlFor="productColors">Colors (comma-separated)</Label>
              <Input id="productColors" name="productColors" placeholder="e.g., Black, White, Beige" defaultValue={product.colors.join(', ')} />
            </div>

            <div>
              <Label htmlFor="productImage">Main Image URL</Label>
              <Input id="productImage" name="productImage" type="url" placeholder="https://placehold.co/600x800.png" defaultValue={product.imageUrl} required />
            </div>
            <div>
              <Label htmlFor="additionalImages">Additional Image URLs (comma-separated)</Label>
              <Textarea id="additionalImages" name="additionalImages" rows={3} placeholder="https://placehold.co/600x800.png, https://placehold.co/600x800.png" defaultValue={(product.images || []).join(',\n')} />
            </div>

          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
