
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Edit2, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types";
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const productsCollectionRef = collection(db, "products");
      console.log("Fetching products from collection path:", productsCollectionRef.path);

      // Temporarily remove orderBy to simplify the query for debugging
      // const q = query(productsCollectionRef, orderBy("createdAt", "desc"));
      const q = query(productsCollectionRef); // Simplified query
      
      const querySnapshot = await getDocs(q);
      const fetchedProducts: Product[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedProducts.push({
          id: docSnap.id,
          name: data.name || 'N/A (Missing Name)',
          price: typeof data.price === 'number' ? data.price : 0,
          categoryName: data.categoryName || 'Uncategorized',
          categoryId: data.categoryId || '',
          imageUrl: data.imageUrl || 'https://placehold.co/48x48.png',
          stock: typeof data.stock === 'number' ? data.stock : 0,
          sizes: Array.isArray(data.sizes) ? data.sizes : [],
          colors: Array.isArray(data.colors) ? data.colors : [],
          description: data.description || '',
          slug: data.slug || '',
          createdAt: data.createdAt as Timestamp, // Assume it exists for now, handle if undefined
          updatedAt: data.updatedAt as Timestamp,
        } as Product);
      });
      setProducts(fetchedProducts);
      console.log(`Fetched ${fetchedProducts.length} products. Sample raw data (first 3):`, fetchedProducts.slice(0,3).map(p => ({id: p.id, name: p.name, createdAt: p.createdAt})));

    } catch (err: any) {
      console.error("Error fetching products in CMS:", err);
      let detailedMessage = `Failed to fetch products. ${err.message || 'Unknown error'}.`;
      if (err.code) {
        detailedMessage += ` Firebase error code: ${err.code}.`;
      }
      if (err.code === 'failed-precondition' && err.message.includes('index')) {
        detailedMessage += " This often means you need to create a Firestore index. Check the browser console for a link to create it.";
      }
      setError(detailedMessage);
      toast({ title: "Error Fetching Products", description: detailedMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId: string, productName: string) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      toast({ title: "Success", description: `Product "${productName}" deleted successfully.` });
      fetchProducts(); 
    } catch (err: any) {
      console.error("Error deleting product:", err);
      toast({ title: "Error", description: `Could not delete product: ${err.message}`, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="space-y-6">
         <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Product Management</h1>
            <Link href="/admin/products/new">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
            </Link>
        </div>
        <div className="text-center py-10 bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
            <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Products</h2>
            <p>{error}</p>
            <Button onClick={fetchProducts} className="mt-4">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Product Management</h1>
        <Link href="/admin/products/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>View, edit, and manage your store products. Displaying {products.length} products.</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No products found in the 'products' collection in Firestore.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add your first product by clicking the &quot;Add Product&quot; button above.
                If you have products in Firestore, ensure your security rules allow listing and reading them, and check the browser console for errors.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Image
                        src={product.imageUrl || 'https://placehold.co/48x48.png'}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                        data-ai-hint="product admin"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell>LKR {product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <DropdownMenuItem><Edit2 className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" />Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the product &quot;{product.name}&quot;.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProduct(product.id, product.name)} className="bg-destructive hover:bg-destructive/90">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
