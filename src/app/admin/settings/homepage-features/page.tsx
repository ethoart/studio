
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import type { HomepageFeatureItem } from '@/types';
import { PlusCircle, Trash2, Loader2, AlertTriangle, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";


const FEATURES_PATH = "site_settings/homepage/featureItems";

export default function HomepageFeaturesSettingsPage() {
  const [featureItems, setFeatureItems] = useState<HomepageFeatureItem[]>([]);
  const [newFeatureTitle, setNewFeatureTitle] = useState('');
  const [newFeatureDescription, setNewFeatureDescription] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<HomepageFeatureItem | null>(null);
  const [editFeatureTitle, setEditFeatureTitle] = useState('');
  const [editFeatureDescription, setEditFeatureDescription] = useState('');


  const fetchFeatureItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const q = query(collection(db, FEATURES_PATH), orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      const items: HomepageFeatureItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as HomepageFeatureItem);
      });
      setFeatureItems(items);
    } catch (err: any) {
      console.error("Error fetching feature items:", err);
      setError(`Failed to fetch feature items. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatureItems();
  }, []);

  const handleAddFeature = async () => {
    if (!newFeatureTitle.trim() || !newFeatureDescription.trim()) {
      toast({ title: "Error", description: "Title and Description are required.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, FEATURES_PATH), {
        title: newFeatureTitle.trim(),
        description: newFeatureDescription.trim(),
        createdAt: serverTimestamp(),
      });
      toast({ title: "Feature Item Added", description: "New feature item has been saved." });
      setNewFeatureTitle('');
      setNewFeatureDescription('');
      fetchFeatureItems();
    } catch (err: any) {
      console.error("Error adding feature item:", err);
      toast({ title: "Error Adding Item", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFeature = async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, FEATURES_PATH, id));
      toast({ title: "Feature Item Removed" });
      fetchFeatureItems();
    } catch (err: any) {
      console.error("Error removing feature item:", err);
      toast({ title: "Error Removing Item", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openEditDialog = (feature: HomepageFeatureItem) => {
    setEditingFeature(feature);
    setEditFeatureTitle(feature.title);
    setEditFeatureDescription(feature.description);
    setIsEditDialogOpen(true);
  };

  const handleEditFeature = async () => {
    if (!editingFeature || !editFeatureTitle.trim() || !editFeatureDescription.trim()) {
      toast({ title: "Error", description: "Title and description cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, FEATURES_PATH, editingFeature.id), {
        title: editFeatureTitle.trim(),
        description: editFeatureDescription.trim(),
      });
      toast({ title: "Feature Item Updated" });
      setIsEditDialogOpen(false);
      setEditingFeature(null);
      fetchFeatureItems();
    } catch (err: any) {
      console.error("Error updating feature item:", err);
      toast({ title: "Error", description: `Could not update item: ${err.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Homepage Features Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>&quot;Why Choose Us&quot; Section</CardTitle>
          <CardDescription>Manage the items displayed in the &quot;Why Choose ARO Bazzar?&quot; section on the homepage. Items are ordered by creation date.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading feature items...</p>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && featureItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 border rounded-md">
              <div className="flex-grow space-y-2 w-full">
                <div>
                  <Label htmlFor={`feature-title-${item.id}`}>Title</Label>
                  <Input id={`feature-title-${item.id}`} value={item.title} readOnly />
                </div>
                <div>
                  <Label htmlFor={`feature-desc-${item.id}`}>Description</Label>
                  <Textarea id={`feature-desc-${item.id}`} value={item.description} readOnly rows={2} />
                </div>
              </div>
              <div className="flex flex-shrink-0 gap-2 mt-2 sm:mt-0 sm:flex-col">
                <Button variant="outline" size="icon" onClick={() => openEditDialog(item)} disabled={isSubmitting}>
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit Item</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" disabled={isSubmitting}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove Item</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the feature item &quot;{item.title}&quot;. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRemoveFeature(item.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
           {!isLoading && !error && featureItems.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No feature items configured yet. Add one below.</p>
           )}
        </CardContent>
        <CardFooter className="border-t pt-6 flex flex-col gap-4 items-start">
            <h3 className="text-lg font-medium">Add New Feature Item</h3>
            <div>
                <Label htmlFor="new-feature-title">Title</Label>
                <Input id="new-feature-title" value={newFeatureTitle} onChange={(e) => setNewFeatureTitle(e.target.value)} placeholder="e.g., Quality Craftsmanship" />
            </div>
            <div>
                <Label htmlFor="new-feature-desc">Description</Label>
                <Textarea id="new-feature-desc" value={newFeatureDescription} onChange={(e) => setNewFeatureDescription(e.target.value)} placeholder="e.g., Made with the finest materials..." rows={3} />
            </div>
            <Button onClick={handleAddFeature} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <PlusCircle className="mr-2 h-4 w-4" /> Add Feature Item
            </Button>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Feature: {editingFeature?.title}</DialogTitle>
            <DialogDescription>
              Make changes to your feature item here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                value={editFeatureTitle}
                onChange={(e) => setEditFeatureTitle(e.target.value)}
                className="col-span-3"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={editFeatureDescription}
                onChange={(e) => setEditFeatureDescription(e.target.value)}
                className="col-span-3"
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" disabled={isSubmitting}>Cancel</Button></DialogClose>
            <Button onClick={handleEditFeature} disabled={isSubmitting || !editFeatureTitle.trim() || !editFeatureDescription.trim()}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
