
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HomepageGalleryImage } from '@/types';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const GALLERY_IMAGES_PATH = "site_settings/homepage/galleryImages";

interface ImageGalleryProps {
  autoPlay?: boolean;
  interval?: number;
}

export function ImageGallery({ autoPlay = true, interval = 7000 }: ImageGalleryProps) {
  const [heroImage, setHeroImage] = useState<HomepageGalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroImage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const q = query(collection(db, GALLERY_IMAGES_PATH), orderBy("createdAt", "asc"), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          setHeroImage({
            id: doc.id,
            src: data.src,
            alt: data.alt,
            link: data.link,
            title: data.title,
            subtitle: data.subtitle,
            dataAiHint: data.dataAiHint || "fashion hero",
            createdAt: data.createdAt as Timestamp,
          });
        } else {
            setHeroImage({
              id: 'placeholder-hero',
              src: 'https://placehold.co/1600x800/f0f0f0/333333.png',
              alt: 'ARO Bazzar New Collection Placeholder',
              title: 'Discover Our New Collection',
              subtitle: 'Elegant styles for the modern individual.',
              link: '/shop',
              dataAiHint: 'fashion store placeholder',
            });
        }
      } catch (err) {
        console.error("Error fetching hero image for storefront:", err);
        let message = "Could not load hero banner image from the CMS.";
        if (err instanceof Error && (err.message.includes("index") || err.message.includes("missing an index"))) {
            message += " This might be due to a missing Firestore index for sorting. Please check your browser's developer console for a link to create it, or ensure the 'createdAt' field is indexed on the 'site_settings/homepage/galleryImages' collection (ascending).";
        } else if (err instanceof Error) {
            message += ` Details: ${err.message}`;
        }
        setError(message);
        setHeroImage({
            id: 'error-hero',
            src: 'https://placehold.co/1600x800/e0e0e0/555555.png',
            alt: 'Error loading ARO Bazzar Collection',
            title: 'Style Awaits You',
            subtitle: 'Explore our latest arrivals.',
            link: '/shop',
            dataAiHint: 'fashion error',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeroImage();
  }, []);


  if (isLoading) {
    return (
      <div className="relative w-full h-[500px] md:h-[650px] lg:h-[700px] overflow-hidden">
        <Skeleton className="w-full h-full" />
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <Skeleton className="h-14 w-3/4 max-w-xl mb-4" />
            <Skeleton className="h-8 w-1/2 max-w-md mb-8" />
            <Skeleton className="h-12 w-40" />
          </div>
      </div>
    );
  }

  if (!heroImage) {
     return (
      <div className="relative w-full h-[500px] md:h-[650px] lg:h-[700px] flex items-center justify-center bg-muted text-muted-foreground border-y">
        <div className="text-center p-6">
            <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Hero Banner Not Available</h2>
            <p className="text-sm">Please configure a hero image in the CMS.</p>
        </div>
      </div>
    );
  }
  
  const HeroContent = () => (
    // Removed gradient overlay from here for a "no transparent items" approach
    <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-6 pb-16 md:pb-24">
       {heroImage.title && (
         <h1 
            className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 md:mb-4 leading-tight"
            style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }} // Add text shadow for readability
         >
           {heroImage.title}
         </h1>
       )}
       {heroImage.subtitle && (
         <p 
            className="text-lg md:text-xl lg:text-2xl text-white/95 mb-6 md:mb-8 max-w-2xl" // Slightly increased opacity for better readability
            style={{ textShadow: '0px 1px 3px rgba(0, 0, 0, 0.5)' }} // Add text shadow for readability
          >
           {heroImage.subtitle}
         </p>
       )}
       {heroImage.link && (
        <Link href={heroImage.link} passHref>
          <Button size="lg" variant="outline" className="bg-white text-primary border-white hover:bg-white/90 hover:border-white/90 px-8 py-3 text-base font-semibold">
            Shop Now
          </Button>
        </Link>
       )}
        {error && ( 
            <p className="text-xs text-red-300 bg-red-900/70 p-2 rounded-md mt-4">{error}</p>
        )}
     </div>
  );

  return (
    <div className="relative w-full h-[500px] md:h-[650px] lg:h-[700px] overflow-hidden bg-muted">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          style={{objectFit:"cover"}}
          priority
          data-ai-hint={heroImage.dataAiHint || "fashion hero"}
          className="transition-opacity duration-1000 ease-in-out opacity-100"
        />
        <HeroContent />
    </div>
  );
}
