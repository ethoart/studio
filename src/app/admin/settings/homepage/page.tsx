
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import type { HomepageGalleryImage } from '@/types';
import { PlusCircle, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc, query, orderBy } from 'firebase/firestore';

const GALLERY_IMAGES_PATH = "site_settings/homepage/galleryImages";

export default function HomepageSettingsPage() {
  const [galleryImages, setGalleryImages] = useState<HomepageGalleryImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [newImageDataAiHint, setNewImageDataAiHint] = useState('');
  const [newImageLink, setNewImageLink] = useState(''); // State for new image link
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchGalleryImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const q = query(collection(db, GALLERY_IMAGES_PATH), orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      const images: HomepageGalleryImage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        images.push({ 
          id: doc.id, 
          src: data.src, 
          alt: data.alt, 
          link: data.link, // Fetch link
          dataAiHint: data.dataAiHint,
        });
      });
      setGalleryImages(images);
    } catch (err: any) {
      console.error("Error fetching gallery images:", err);
      setError(`Failed to fetch gallery images. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const handleAddImage = async () => {
    if (!newImageUrl || !newImageAlt) {
      toast({ title: "Error", description: "Image URL and Alt Text are required.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const imageData: Partial<HomepageGalleryImage> = {
        src: newImageUrl,
        alt: newImageAlt,
        dataAiHint: newImageDataAiHint || "image",
        createdAt: new Date() as any, // Simple timestamp for ordering
      };
      if (newImageLink.trim()) {
        imageData.link = newImageLink.trim();
      }

      await addDoc(collection(db, GALLERY_IMAGES_PATH), imageData);
      toast({ title: "Image Added", description: "New gallery image has been saved." });
      setNewImageUrl('');
      setNewImageAlt('');
      setNewImageDataAiHint('');
      setNewImageLink(''); // Clear new image link input
      fetchGalleryImages(); // Refresh list
    } catch (err: any) {
      console.error("Error adding image:", err);
      toast({ title: "Error Adding Image", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, GALLERY_IMAGES_PATH, id));
      toast({ title: "Image Removed" });
      fetchGalleryImages(); // Refresh list
    } catch (err: any) {
      console.error("Error removing image:", err);
      toast({ title: "Error Removing Image", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateImageField = async (id: string, field: keyof HomepageGalleryImage, value: string) => {
    try {
      await updateDoc(doc(db, GALLERY_IMAGES_PATH, id), { [field]: value });
      toast({ title: "Image Updated" });
      setGalleryImages(prevImages => 
        prevImages.map(img => img.id === id ? { ...img, [field]: value } : img)
      );
    } catch (err: any) {
      console.error(`Error updating image ${field}:`, err);
      toast({ title: `Error Updating ${String(field)}`, description: err.message, variant: "destructive" });
    }
  };


  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Homepage Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Homepage Image Gallery</CardTitle>
          <CardDescription>Manage the images displayed in the homepage hero gallery. Images are ordered by creation date.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading gallery images...</p>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && galleryImages.map((image) => (
            <div key={image.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-md">
              <Image src={image.src} alt={image.alt} width={150} height={75} className="rounded object-cover aspect-[2/1]" data-ai-hint={image.dataAiHint || 'gallery image'} />
              <div className="flex-grow space-y-2 w-full">
                <div>
                    <Label htmlFor={`img-src-${image.id}`}>Image URL</Label>
                    <Input id={`img-src-${image.id}`} defaultValue={image.src} onBlur={(e) => handleUpdateImageField(image.id, 'src', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor={`img-alt-${image.id}`}>Alt Text</Label>
                    <Input id={`img-alt-${image.id}`} defaultValue={image.alt} onBlur={(e) => handleUpdateImageField(image.id, 'alt', e.target.value)} />
                </div>
                 <div>
                    <Label htmlFor={`img-hint-${image.id}`}>AI Hint (1-2 keywords)</Label>
                    <Input id={`img-hint-${image.id}`} defaultValue={image.dataAiHint} onBlur={(e) => handleUpdateImageField(image.id, 'dataAiHint', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor={`img-link-${image.id}`}>Link URL (Optional)</Label>
                    <Input id={`img-link-${image.id}`} type="url" defaultValue={image.link || ''} placeholder="e.g., /shop/new-arrivals or https://example.com" onBlur={(e) => handleUpdateImageField(image.id, 'link', e.target.value)} />
                </div>
              </div>
              <Button variant="destructive" size="icon" onClick={() => handleRemoveImage(image.id)} disabled={isSubmitting} className="mt-2 sm:mt-0 flex-shrink-0">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                <span className="sr-only">Remove Image</span>
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t pt-6 flex flex-col gap-4 items-start">
            <h3 className="text-lg font-medium">Add New Gallery Image</h3>
             <div>
                <Label htmlFor="new-img-src">New Image URL</Label>
                <Input id="new-img-src" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="https://placehold.co/1200x600.png" />
            </div>
            <div>
                <Label htmlFor="new-img-alt">New Image Alt Text</Label>
                <Input id="new-img-alt" value={newImageAlt} onChange={(e) => setNewImageAlt(e.target.value)} placeholder="Descriptive alt text" />
            </div>
             <div>
                <Label htmlFor="new-img-hint">New Image AI Hint (1-2 keywords)</Label>
                <Input id="new-img-hint" value={newImageDataAiHint} onChange={(e) => setNewImageDataAiHint(e.target.value)} placeholder="e.g. fashion model" />
            </div>
            <div>
                <Label htmlFor="new-img-link">Link URL (Optional)</Label>
                <Input id="new-img-link" type="url" value={newImageLink} onChange={(e) => setNewImageLink(e.target.value)} placeholder="/shop/category-name or https://external.link" />
            </div>
            <Button onClick={handleAddImage} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <PlusCircle className="mr-2 h-4 w-4" /> Add Image to Gallery
            </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Featured Products Section</CardTitle>
            <CardDescription>Select products to feature on the homepage. (Functionality pending)</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Product selection UI will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
