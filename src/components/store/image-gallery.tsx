
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HomepageGalleryImage } from '@/types';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const GALLERY_IMAGES_PATH = "site_settings/homepage/galleryImages";

interface ImageGalleryProps {
  autoPlay?: boolean;
  interval?: number;
}

export function ImageGallery({ autoPlay = true, interval = 5000 }: ImageGalleryProps) {
  const [images, setImages] = useState<HomepageGalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, GALLERY_IMAGES_PATH), orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(q);
        const fetchedImages: HomepageGalleryImage[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedImages.push({ 
            id: doc.id, 
            src: data.src, 
            alt: data.alt,
            link: data.link,
            title: data.title, // Fetch title
            subtitle: data.subtitle, // Fetch subtitle
            dataAiHint: data.dataAiHint || "image",
          });
        });
        setImages(fetchedImages);
      } catch (error) {
        console.error("Error fetching gallery images for storefront:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  const goToPrevious = () => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = React.useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const timer = setInterval(goToNext, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, goToNext, images.length]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden group">
        <Skeleton className="w-full h-full" />
         <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center p-4">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-8 w-1/2 mb-6" />
            <Skeleton className="h-12 w-32" />
          </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    // Fallback display if no images are configured in CMS
    return (
      <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden group">
        <Image
          src="https://placehold.co/1200x600/E0E0E0/333333.png" // Default placeholder
          alt="ARO Bazzar Collection"
          fill
          objectFit="cover"
          priority
          data-ai-hint="fashion store"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center p-4">
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-4 shadow-lg">ARO Bazzar Collection</h2>
          <p className="text-lg md:text-xl text-white/90 mb-6 shadow-sm">Timeless Style, Modern Elegance</p>
          <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
            Shop Now
          </Button>
        </div>
      </div>
    );
  }
  
  const currentImage = images[currentIndex];
  
  const slideContent = (
    <>
      <Image
        src={currentImage.src}
        alt={currentImage.alt}
        fill
        objectFit="cover"
        priority={currentIndex === 0}
        data-ai-hint={currentImage.dataAiHint}
      />
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center p-4">
        <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-4 shadow-lg">
          {currentImage.title || "ARO Bazzar Collection"}
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-6 shadow-sm">
          {currentImage.subtitle || "Timeless Style, Modern Elegance"}
        </p>
        <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary pointer-events-none">
          Shop Now
        </Button>
      </div>
    </>
  );


  return (
    <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden group">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10" 
          )}
        >
          {image.link ? (
            <Link href={image.link} passHref legacyBehavior>
              <a className="block w-full h-full relative" aria-label={image.alt}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  objectFit="cover"
                  priority={index === 0}
                  data-ai-hint={image.dataAiHint}
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center p-4">
                   <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-4 shadow-lg">
                     {image.title || "ARO Bazzar Collection"}
                   </h2>
                   <p className="text-lg md:text-xl text-white/90 mb-6 shadow-sm">
                     {image.subtitle || "Timeless Style, Modern Elegance"}
                   </p>
                  <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary pointer-events-none">
                    Shop Now
                  </Button>
                </div>
              </a>
            </Link>
          ) : (
            <div className="block w-full h-full relative">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                objectFit="cover"
                priority={index === 0}
                data-ai-hint={image.dataAiHint}
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center p-4">
                 <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-4 shadow-lg">
                   {image.title || "ARO Bazzar Collection"}
                 </h2>
                 <p className="text-lg md:text-xl text-white/90 mb-6 shadow-sm">
                   {image.subtitle || "Timeless Style, Modern Elegance"}
                 </p>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
                  Shop Now
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to image ${index + 1}`}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  currentIndex === index ? "bg-primary" : "bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
