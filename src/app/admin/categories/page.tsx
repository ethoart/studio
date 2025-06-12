
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Loader2, AlertTriangle, MoreHorizontal, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@/types";
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy, updateDoc, Timestamp } from 'firebase/firestore';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'; // For Edit Dialog


// Helper to generate a slug (basic version)
const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');


  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const categoriesCollectionRef = collection(db, "categories");
      const q = query(categoriesCollectionRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedCategories: Category[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedCategories.push({
          id: docSnap.id,
          name: data.name || 'N/A',
          slug: data.slug || 'n-a',
          createdAt: data.createdAt as Timestamp,
        });
      });
      setCategories(fetchedCategories);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch categories. Please check Firestore permissions and ensure the 'categories' collection exists.");
      toast({ title: "Error", description: `Could not fetch categories: ${err.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({ title: "Error", description: "Category name cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const slug = generateSlug(newCategoryName);
      await addDoc(collection(db, "categories"), {
        name: newCategoryName.trim(),
        slug: slug,
        createdAt: serverTimestamp(),
      });
      toast({ title: "Category Added", description: `Category "${newCategoryName}" has been created.` });
      setNewCategoryName('');
      fetchCategories(); // Refresh list
    } catch (err: any) {
      console.error("Error adding category:", err);
      toast({ title: "Error", description: `Could not add category: ${err.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    try {
      await deleteDoc(doc(db, "categories", categoryId));
      toast({ title: "Category Deleted", description: `Category "${categoryName}" has been deleted.` });
      fetchCategories(); // Refresh list
    } catch (err: any) {
      console.error("Error deleting category:", err);
      toast({ title: "Error", description: `Could not delete category: ${err.message}`, variant: "destructive" });
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setIsEditDialogOpen(true);
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) {
      toast({ title: "Error", description: "Category name cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const newSlug = generateSlug(editCategoryName);
      await updateDoc(doc(db, "categories", editingCategory.id), {
        name: editCategoryName.trim(),
        slug: newSlug,
        // updatedAt: serverTimestamp(), // If you add an updatedAt field
      });
      toast({ title: "Category Updated", description: `Category "${editCategoryName}" has been updated.` });
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      console.error("Error updating category:", err);
      toast({ title: "Error", description: `Could not update category: ${err.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
        <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Categories</h2>
        <p>{error}</p>
        <Button onClick={fetchCategories} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Category Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <div className="flex-grow">
            <Label htmlFor="newCategoryName" className="sr-only">Category Name</Label>
            <Input
              id="newCategoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              disabled={isSubmitting}
            />
          </div>
          <Button onClick={handleAddCategory} disabled={isSubmitting || !newCategoryName.trim()}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            Add Category
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>Manage your store's product categories. Displaying {categories.length} categories.</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No categories found.</p>
              <p className="text-sm text-muted-foreground mt-2">Add your first category using the form above.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.createdAt ? new Date(category.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(category)}>
                            <Edit2 className="mr-2 h-4 w-4" />Edit
                          </DropdownMenuItem>
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
                                  This action cannot be undone. This will permanently delete the category &quot;{category.name}&quot;.
                                  Products associated with this category will not be deleted but may need to be reassigned.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCategory(category.id, category.name)} className="bg-destructive hover:bg-destructive/90">
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
      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category: {editingCategory?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 pb-4">
            <div>
              <Label htmlFor="editCategoryName">Category Name</Label>
              <Input
                id="editCategoryName"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            {/* Slug is auto-generated, could show it as read-only or allow editing */}
            <p className="text-sm text-muted-foreground">Slug: {editingCategory ? generateSlug(editCategoryName) : ''}</p>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleEditCategory} disabled={isSubmitting || !editCategoryName.trim()}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
