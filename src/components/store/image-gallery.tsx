"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HomepageGalleryImage } from '@/types';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: HomepageGalleryImage[];
  autoPlay?: boolean;
  interval?: number;
}

export function ImageGallery({ images, autoPlay = true, interval = 5000 }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = React.useCallback(() => {
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

  if (!images || images.length === 0) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center bg-muted text-muted-foreground">
        No images to display.
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden group">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            layout="fill"
            objectFit="cover"
            priority={index === 0}
            data-ai-hint={image.dataAiHint}
          />
           <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center p-4">
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-4 shadow-lg">ARO Bazzar Collection</h2>
            <p className="text-lg md:text-xl text-white/90 mb-6 shadow-sm">Timeless Style, Modern Elegance</p>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
              Shop Now
            </Button>
          </div>
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
