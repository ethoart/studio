"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder logic for adding a new product
    toast({
      title: "Product Created (Demo)",
      description: "The new product has been added to the catalog.",
    });
    // Potentially redirect to products list or clear form
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
            <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="font-headline text-3xl font-bold">Add New Product</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Fill in the details for the new product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" name="productName" required />
              </div>
              <div>
                <Label htmlFor="productCategory">Category</Label>
                <Select name="productCategory">
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
              <Textarea id="productDescription" name="productDescription" rows={5} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="productPrice">Price ($)</Label>
                <Input id="productPrice" name="productPrice" type="number" step="0.01" required />
              </div>
              <div>
                <Label htmlFor="productStock">Stock Quantity</Label>
                <Input id="productStock" name="productStock" type="number" step="1" required />
              </div>
              <div>
                <Label htmlFor="productSku">SKU (Optional)</Label>
                <Input id="productSku" name="productSku" />
              </div>
            </div>

            <div>
              <Label htmlFor="productSizes">Sizes (comma-separated)</Label>
              <Input id="productSizes" name="productSizes" placeholder="e.g., S, M, L, XL" />
            </div>
            <div>
              <Label htmlFor="productColors">Colors (comma-separated)</Label>
              <Input id="productColors" name="productColors" placeholder="e.g., Black, White, Beige" />
            </div>

            <div>
              <Label htmlFor="productImage">Main Image URL</Label>
              <Input id="productImage" name="productImage" type="url" placeholder="https://placehold.co/600x800.png" required />
            </div>
             <div>
              <Label htmlFor="additionalImages">Additional Image URLs (comma-separated)</Label>
              <Textarea id="additionalImages" name="additionalImages" rows={3} placeholder="https://placehold.co/600x800.png, https://placehold.co/600x800.png" />
            </div>

          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">Save Product</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
