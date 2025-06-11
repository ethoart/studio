"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import type { HomepageGalleryImage } from '@/types';
import { mockHomepageGalleryImages } from '@/lib/mock-data';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function HomepageSettingsPage() {
  const [galleryImages, setGalleryImages] = useState<HomepageGalleryImage[]>(mockHomepageGalleryImages);
  const { toast } = useToast();

  const handleAddImage = () => {
    // For demo, add a placeholder. In real app, this would open a modal or form.
    const newImage: HomepageGalleryImage = {
      id: `gallery${galleryImages.length + 1}`,
      src: 'https://placehold.co/1200x600/A0A0A0/FFFFFF.png',
      alt: 'New Gallery Image',
      dataAiHint: 'placeholder image'
    };
    setGalleryImages([...galleryImages, newImage]);
    toast({ title: "Image Added (Demo)" });
  };

  const handleRemoveImage = (id: string) => {
    setGalleryImages(galleryImages.filter(img => img.id !== id));
    toast({ title: "Image Removed (Demo)" });
  };
  
  const handleSaveChanges = () => {
    // Placeholder save logic
    toast({ title: "Homepage Settings Saved (Demo)"});
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Homepage Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Homepage Image Gallery</CardTitle>
          <CardDescription>Manage the images displayed in the homepage hero gallery.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {galleryImages.map((image, index) => (
            <div key={image.id} className="flex items-center gap-4 p-4 border rounded-md">
              <Image src={image.src} alt={image.alt} width={100} height={50} className="rounded object-cover" data-ai-hint={image.dataAiHint} />
              <div className="flex-grow space-y-2">
                <div>
                    <Label htmlFor={`img-src-${index}`}>Image URL</Label>
                    <Input id={`img-src-${index}`} defaultValue={image.src} />
                </div>
                <div>
                    <Label htmlFor={`img-alt-${index}`}>Alt Text</Label>
                    <Input id={`img-alt-${index}`} defaultValue={image.alt} />
                </div>
              </div>
              <Button variant="destructive" size="icon" onClick={() => handleRemoveImage(image.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove Image</span>
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddImage}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Image
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Featured Products Section</CardTitle>
            <CardDescription>Select products to feature on the homepage.</CardDescription>
        </CardHeader>
        <CardContent>
            {/* Placeholder for selecting featured products */}
            <p className="text-muted-foreground">Product selection UI will be here.</p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveChanges}>Save Homepage Settings</Button>
      </div>
    </div>
  );
}
