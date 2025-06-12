
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HomepageGalleryImage } from '@/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const GALLERY_IMAGES_PATH = "site_settings/homepage/galleryImages";

export function ImageGallery() {
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
              src: 'https://placehold.co/1600x900/e9e9e9/1c1c1c.png', // Lighter placeholder
              alt: 'ARO Bazzar New Collection Placeholder',
              title: 'New Season Styles',
              subtitle: 'Explore fresh designs and timeless essentials.',
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
            src: 'https://placehold.co/1600x900/f0f0f0/333333.png',
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
      <div className="relative w-full h-[550px] md:h-[650px] lg:h-[750px] bg-secondary"> {/* Light gray skeleton bg */}
        <Skeleton className="w-full h-full" />
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <Skeleton className="h-12 w-3/4 max-w-lg mb-4 bg-muted" />
            <Skeleton className="h-6 w-1/2 max-w-md mb-8 bg-muted" />
            <Skeleton className="h-12 w-36 bg-muted" />
          </div>
      </div>
    );
  }

  if (!heroImage) {
     return (
      <div className="relative w-full h-[550px] md:h-[650px] lg:h-[750px] flex items-center justify-center bg-secondary text-foreground border-y border-border">
        <div className="text-center p-6">
            <AlertTriangle className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2 text-foreground">Hero Banner Not Available</h2>
            <p className="text-sm text-muted-foreground">Please configure a hero image in the CMS.</p>
        </div>
      </div>
    );
  }
  
  const HeroContent = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/10"> {/* Subtle overlay for text contrast */}
       {heroImage.title && (
         <h1 
            className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-5 leading-tight tracking-tight"
            style={{ textShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)' }}
         >
           {heroImage.title}
         </h1>
       )}
       {heroImage.subtitle && (
         <p 
            className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-xl"
            style={{ textShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)' }}
          >
           {heroImage.subtitle}
         </p>
       )}
       {heroImage.link && (
        <Link href={heroImage.link} passHref>
          <Button size="lg" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm px-10 py-3 text-base font-medium tracking-wide">
            Shop Now
          </Button>
        </Link>
       )}
        {error && ( 
            <p className="text-xs text-red-200 bg-red-800/80 p-2 rounded-md mt-6">{error}</p>
        )}
     </div>
  );

  return (
    <div className="relative w-full h-[550px] md:h-[650px] lg:h-[750px] overflow-hidden bg-secondary"> {/* Base background for image loading */}
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
