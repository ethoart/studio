
"use client";

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Product, Review } from '@/types'; // Import Review type
import { Star, CheckCircle, Package, ShieldCheck, Heart, Loader2, Send } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { ProductCard } from '@/components/store/product-card';
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context'; // Import useAuth
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, Timestamp, addDoc, serverTimestamp, orderBy } from 'firebase/firestore'; // Firebase imports for reviews
import { format } from 'date-fns'; // For formatting review dates

interface ResolvedPageParams {
  slug: string;
}

interface ProductDetailPageProps {
  params: Promise<ResolvedPageParams>;
}

// Star component for display and input
const StarRating = ({ rating, onRatingChange, interactive = false, size = "h-5 w-5" }: { rating: number; onRatingChange?: (newRating: number) => void; interactive?: boolean; size?: string; }) => {
  return (
    <div className={`flex ${interactive ? 'cursor-pointer' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${star <= rating ? (interactive ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400 fill-yellow-400') : (interactive ? 'text-gray-300 hover:text-yellow-300' : 'text-gray-300')} 
                      ${interactive ? 'hover:scale-110 transition-transform' : ''}`}
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );
};


export default function ProductDetailPage({ params: paramsPromise }: ProductDetailPageProps) {
  const resolvedParams = use(paramsPromise);
  const { slug } = resolvedParams;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { user: authUser, firebaseUser, loading: authLoading } = useAuth(); // Get user from auth context

  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);


  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!slug) {
        console.warn("ProductDetailPage: Slug is not available, cannot fetch product data.");
        setProduct(null);
        setLoadingProduct(false);
        return;
      }

      setLoadingProduct(true);
      console.log(`ProductDetailPage: Fetching product with slug: "${slug}"`);

      try {
        // Fetch Product
        const productsRef = collection(db, "products");
        const qProduct = query(productsRef, where("slug", "==", slug), limit(1));
        const productSnapshot = await getDocs(qProduct);

        if (!productSnapshot.empty) {
          const docSnap = productSnapshot.docs[0];
          const fetchedProductData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(fetchedProductData);

          if (fetchedProductData.colors && fetchedProductData.colors.length > 0) {
            setSelectedColor(fetchedProductData.colors[0]);
          }
          if (fetchedProductData.sizes && fetchedProductData.sizes.length > 0) {
            setSelectedSize(fetchedProductData.sizes[0]);
          }

          // Fetch Related Products
          if (fetchedProductData.categoryId) {
            const relatedQuery = query(
              productsRef,
              where("categoryId", "==", fetchedProductData.categoryId),
              where("id", "!=", fetchedProductData.id),
              limit(4)
            );
            const relatedSnapshot = await getDocs(relatedQuery);
            const fetchedRelatedProducts: Product[] = [];
            relatedSnapshot.forEach(doc => {
              fetchedRelatedProducts.push({ id: doc.id, ...doc.data() } as Product);
            });
            setRelatedProducts(fetchedRelatedProducts);
          }

          // Fetch Reviews for this product
          const reviewsRef = collection(db, "reviews");
          const qReviews = query(reviewsRef, where("productId", "==", fetchedProductData.id), orderBy("createdAt", "desc"));
          const reviewsSnapshot = await getDocs(qReviews);
          const fetchedReviews: Review[] = [];
          reviewsSnapshot.forEach(doc => {
            fetchedReviews.push({ id: doc.id, ...doc.data() } as Review);
          });
          setReviews(fetchedReviews);
          
          if (fetchedReviews.length > 0) {
            const totalRating = fetchedReviews.reduce((sum, review) => sum + review.rating, 0);
            setAverageRating(totalRating / fetchedReviews.length);
            setReviewCount(fetchedReviews.length);
          } else {
            setAverageRating(0);
            setReviewCount(0);
          }


        } else {
          console.warn(`ProductDetailPage: Product with slug "${slug}" not found in Firestore.`);
          setProduct(null);
        }
      } catch (error) {
        console.error("ProductDetailPage: Error fetching product data or reviews:", error);
        setProduct(null);
        toast({
          title: "Error",
          description: "Could not load product details or reviews. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProductAndReviews();
  }, [slug, toast]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({ title: "Please select a size.", variant: "destructive" });
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({ title: "Please select a color.", variant: "destructive" });
      return;
    }
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !authUser) {
      toast({ title: "Login Required", description: "Please log in to submit a review.", variant: "destructive" });
      return;
    }
    if (!product) {
        toast({ title: "Error", description: "Product not found.", variant: "destructive" });
        return;
    }
    if (newReviewRating === 0) {
      toast({ title: "Rating Required", description: "Please select a star rating.", variant: "destructive" });
      return;
    }
    if (!newReviewText.trim()) {
      toast({ title: "Review Text Required", description: "Please write your review.", variant: "destructive" });
      return;
    }

    setIsSubmittingReview(true);
    try {
      const reviewData: Omit<Review, 'id' | 'createdAt'> & { createdAt: Timestamp } = {
        productId: product.id,
        userId: firebaseUser.uid,
        userName: authUser.name || firebaseUser.displayName || "Anonymous",
        rating: newReviewRating,
        text: newReviewText.trim(),
        createdAt: serverTimestamp() as Timestamp, // Firestore will convert this
      };
      
      const docRef = await addDoc(collection(db, "reviews"), reviewData);
      
      toast({ title: "Review Submitted!", description: "Thank you for your feedback." });
      
      // Optimistically add to UI or refetch reviews
      const newReview = { ...reviewData, id: docRef.id, createdAt: Timestamp.now() } as Review; // Simulate server timestamp
      setReviews(prevReviews => [newReview, ...prevReviews]);

      // Recalculate average rating and count
      const updatedReviews = [newReview, ...reviews];
      if (updatedReviews.length > 0) {
        const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(totalRating / updatedReviews.length);
        setReviewCount(updatedReviews.length);
      }

      setNewReviewRating(0);
      setNewReviewText('');

    } catch (error) {
      console.error("Error submitting review:", error);
      toast({ title: "Submission Failed", description: "Could not submit your review. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmittingReview(false);
    }
  };


  if (loadingProduct || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-headline text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The product you are looking for (slug: {slug || "unknown"}) does not exist or may have been removed.
        </p>
        <Link href="/shop">
          <Button size="lg">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean) as string[];

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={allImages.length > 0 ? allImages[currentImageIndex] : "https://placehold.co/600x800.png"}
              alt={`${product.name} - view ${currentImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-opacity duration-300"
              data-ai-hint="product clothing"
              priority={currentImageIndex === 0}
            />
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-background/70 hover:bg-background rounded-full text-foreground/70 hover:text-primary">
              <Heart className="h-6 w-6" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </div>
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((imgSrc, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square w-full overflow-hidden rounded-md border-2 ${currentImageIndex === index ? 'border-primary' : 'border-transparent'} hover:border-primary transition`}
                >
                  <Image
                    src={imgSrc}
                    alt={`${product.name} - thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="h-full w-full object-cover"
                    data-ai-hint="product thumbnail"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
          <div className="flex items-center space-x-2">
            <StarRating rating={averageRating} size="h-5 w-5" />
            <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
          </div>
          <p className="text-3xl font-bold text-primary">LKR {product.price.toFixed(2)}</p>

          <Separator />

          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-foreground">Color: <span className="font-semibold">{selectedColor}</span></h3>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <RadioGroupItem key={color} value={color} id={`color-${color}`} className="sr-only" />
                ))}
                {product.colors.map((color) => (
                  <Label
                    key={color}
                    htmlFor={`color-${color}`}
                    className={`cursor-pointer rounded-md border-2 p-2 px-3 text-sm transition-all hover:border-primary
                          ${selectedColor === color ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'}`}
                    style={{ backgroundColor: selectedColor === color ? undefined : color.toLowerCase() === 'white' || color.toLowerCase() === 'ivory' ? '#f8f8f8' : color.toLowerCase() }}
                  >
                    {color}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-foreground">Size: <span className="font-semibold">{selectedSize}</span></h3>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <RadioGroupItem key={size} value={size} id={`size-${size}`} className="sr-only" />
                ))}
                {product.sizes.map((size) => (
                  <Label
                    key={size}
                    htmlFor={`size-${size}`}
                    className={`cursor-pointer rounded-md border-2 p-2 px-4 text-sm transition-all hover:border-primary
                            ${selectedSize === size ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'}`}
                  >
                    {size}
                  </Label>
                ))}
              </RadioGroup>
              <Link href="#" className="mt-2 text-sm text-primary hover:underline">Size guide</Link>
            </div>
          )}

          <div>
            <Label htmlFor="quantity" className="text-sm font-medium text-foreground">Quantity</Label>
            <div className="mt-1 flex items-center">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><span className="text-xl leading-none align-middle">-</span></Button>
              <Input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-16 h-10 rounded-md border border-input text-center mx-2"
                min="1"
              />
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}><span className="text-xl leading-none align-middle">+</span></Button>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={handleAddToCart}>Add to Cart</Button>

          <Separator />

          <div>
            <h3 className="font-headline text-lg font-semibold">Product Description</h3>
            <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{product.description}</p>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Free shipping on orders over LKR 5000</div>
            <div className="flex items-center"><Package className="mr-2 h-5 w-5 text-blue-500" /> Easy 30-day returns</div>
            <div className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-indigo-500" /> Secure payment options</div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16 pt-12 border-t">
        <h2 className="font-headline text-2xl font-bold tracking-tight mb-2">Customer Reviews</h2>
        {reviewCount > 0 && (
          <div className="flex items-center mb-6">
            <StarRating rating={averageRating} size="h-6 w-6" />
            <p className="ml-2 text-lg text-muted-foreground">
              {averageRating.toFixed(1)} out of 5 stars ({reviewCount} reviews)
            </p>
          </div>
        )}

        {/* Review Submission Form */}
        {firebaseUser && (
          <form onSubmit={handleReviewSubmit} className="mb-10 p-6 border rounded-lg bg-card shadow">
            <h3 className="font-headline text-xl font-semibold mb-4">Write a Review</h3>
            <div className="mb-4">
              <Label htmlFor="reviewRating" className="mb-1 block text-sm font-medium">Your Rating</Label>
              <StarRating rating={newReviewRating} onRatingChange={setNewReviewRating} interactive={true} size="h-7 w-7" />
            </div>
            <div className="mb-4">
              <Label htmlFor="reviewText" className="mb-1 block text-sm font-medium">Your Review</Label>
              <Textarea
                id="reviewText"
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder={`Tell us what you think about ${product.name}...`}
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmittingReview}>
              {isSubmittingReview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Submit Review
            </Button>
          </form>
        )}
        {!firebaseUser && !authLoading && (
          <div className="mb-10 p-6 border rounded-lg bg-muted/50 text-center">
            <p className="text-muted-foreground">
              <Link href="/login" className="text-primary font-semibold hover:underline">Log in</Link> to write a review.
            </p>
          </div>
        )}

        {/* Display Reviews */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-md bg-card shadow-sm">
                <div className="flex items-center mb-1">
                  <StarRating rating={review.rating} size="h-4 w-4" />
                  <p className="ml-2 font-semibold text-sm">{review.userName}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {review.createdAt ? format(review.createdAt.toDate(), 'MMMM dd, yyyy') : 'Date not available'}
                </p>
                <p className="text-sm text-foreground/90 whitespace-pre-line">{review.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        )}
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t">
          <h2 className="font-headline text-2xl font-bold tracking-tight mb-8 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
