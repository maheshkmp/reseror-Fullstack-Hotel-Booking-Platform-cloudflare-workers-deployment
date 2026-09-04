"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  Grid3X3, 
  Heart, 
  MapPin, 
  Share, 
  Star, 
  X,
  Plus,
  Zap,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi 
} from "@/components/ui/carousel";
import { useCreateWishlist } from "@/features/wishlist/actions/use-create-wishlist";
import { useDeleteWishlist } from "@/features/wishlist/actions/use-delete-wishlist";
import { useGetReviewsByHotelId } from "@/features/review/actions/use-get-review-by-hotel-id";

interface HotelImage {
  id: string;
  imageUrl: string;
  altText: string;
  isThumbnail: boolean;
}

interface HotelHeroProps {
  hotel: {
    id: string;
    name: string;
    starRating: number;
    city: string;
    state: string;
    country: string;
    hotelType: { name: string };
    images: HotelImage[];
    amenities?: any[];
    roomTypes?: { price?: string | number | null }[];
  };
  onReserve: () => void;
}

const ImageGalleryModal = ({
  images,
  selectedImageIndex,
  setSelectedImageIndex,
  onClose,
}: {
  images: HotelImage[];
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number | ((prev: number) => number)) => void;
  onClose: () => void;
}) => {
  const nextImage = () => {
    setSelectedImageIndex(
      selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex(
      selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
    );
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-[100] flex items-center justify-center p-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-6 right-6 text-white hover:bg-white/20 z-10"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-6 text-white hover:bg-white/20 z-10 h-12 w-12"
        onClick={prevImage}
      >
        <ChevronLeft className="w-10 h-10" />
      </Button>

      <div className="relative w-full max-w-5xl aspect-[4/3] flex items-center justify-center">
        <Image
          src={images[selectedImageIndex]?.imageUrl || ""}
          alt={images[selectedImageIndex]?.altText || "Hotel image"}
          fill
          className="object-contain"
          priority
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-6 text-white hover:bg-white/20 z-10 h-12 w-12"
        onClick={nextImage}
      >
        <ChevronRight className="w-10 h-10" />
      </Button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/10">
        {selectedImageIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export function HotelHero({ hotel, onReserve }: HotelHeroProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);

  const createWishlist = useCreateWishlist();
  const deleteWishlist = useDeleteWishlist();

  const allImages = hotel.images || [];

  const handleWishlistClick = async () => {
    if (!hotel?.id) return;
    if (!wishlistAdded) {
      try {
        const result = await createWishlist.mutateAsync({ hotelId: hotel.id, restaurantId: null, roomTypeId: null });
        setWishlistId(result?.id ?? null);
        setWishlistAdded(true);
      } catch (err) {}
    } else {
      try {
        await deleteWishlist.mutateAsync(wishlistId ?? hotel.id);
        setWishlistAdded(false);
        setWishlistId(null);
      } catch (err) {}
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: hotel.name,
      text: `Check out ${hotel.name} in ${hotel.city}, ${hotel.country}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { navigator.clipboard.writeText(window.location.href); }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
  };

  // Fetch real reviews for this hotel
  const { data: reviewsData } = useGetReviewsByHotelId({ hotelId: hotel.id, page: 1, limit: 100 });
  const reviews = reviewsData?.data || [];
  const totalReviews = reviewsData?.meta?.totalCount ?? reviews.length;

  // Calculate average rating from fetched reviews
  const avgRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return "Exceptional";
    if (rating >= 4.0) return "Very Good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3.0) return "Okay";
    return "Fair";
  };

  // Calculate minimum price from roomTypes
  const minPrice = useMemo(() => {
    const prices = (hotel.roomTypes || [])
      .map((rt) => Number(rt.price))
      .filter((p) => p > 0);
    return prices.length > 0 ? Math.min(...prices) : null;
  }, [hotel.roomTypes]);

  // Extract top highlights from amenities
  const highlights = (hotel.amenities || [])
    .slice(0, 4)
    .map((a: any) => a.name);

  return (
    <div className="space-y-3">
      {isGalleryOpen && (
        <ImageGalleryModal
          images={allImages}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}

      {/* Hero Header: Title & Premium Context */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8  border-b border-slate-100">
        <div className="space-y-1">
          <div className="space-y-0">
             <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: hotel.starRating }).map((_, i) => (
                    <Star key={i} className="w-2 h-2 fill-current" />
                  ))}
                </div>
             </div>
             
             <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-[1.1] flex items-center gap-3">
                {hotel.name}
             </h1>
          </div>

          <div className="flex flex-wrap items-center gap-y-3 gap-x-6">
             {/* Rating Snapshot — only shown when there are real reviews */}
            {avgRating && (
              <button 
                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 group"
              >
                <div className="bg-blue-900 text-white font-bold px-2 py-0.5 rounded text-sm">
                  {avgRating.toFixed(1)}
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="font-bold text-slate-900 text-xs">Excellent</span>
                  <span className="text-slate-500 text-[11px] border-b border-transparent group-hover:border-slate-400">{totalReviews} Reviews</span>
                </div>
              </button>
            )}


             {/* Location Trigger */}
             <button 
              onClick={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span className="underline underline-offset-4 decoration-slate-300">{hotel.city}, {hotel.country}</span>
            </button>

             {/* Highlights Bar */}
             {/* <div className="flex flex-wrap items-center gap-2">
                {highlights.map((name, i) => (
                  <div key={i} className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 hover:bg-white hover:border-slate-200 hover:text-slate-900 transition-all cursor-default">
                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                    {name}
                  </div>
                ))}
             </div> */}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 self-end lg:self-start lg:pt-2">
          <div className="flex items-center gap-2">
            {hotel.roomTypes && hotel.roomTypes.length > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={onReserve}
                className="h-10 px-6 text-[10px] font-bold uppercase tracking-[0.2em] bg-blue-900 text-white hover:bg-blue-800 transition-all rounded-xl shadow-lg shadow-slate-900/10"
              >
                Reserve
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-10 px-4 text-[10px] font-bold uppercase tracking-widest border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all rounded-xl"
            >
              <Share className="w-3.5 h-3.5 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleWishlistClick}
              disabled={createWishlist.isPending || deleteWishlist.isPending}
              className={cn(
                "h-10 px-4 text-[10px] font-bold uppercase tracking-widest border-slate-200 transition-all rounded-xl",
                wishlistAdded ? "text-red-500 border-red-100 bg-red-50 hover:bg-red-100/50" : "hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              <Heart className={cn("w-3.5 h-3.5 mr-2", wishlistAdded && "fill-current")} />
              {wishlistAdded ? "Saved" : "Save"}
            </Button>
          </div>

          {/* Starting From price — only shown when a real price exists */}
          {minPrice !== null && (
            <div className="text-right hidden sm:block">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Starting from</p>
               <div className="flex items-baseline justify-end gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900 leading-none">${minPrice.toLocaleString()}</span>
                  <span className="text-xs font-bold text-slate-400 leading-none">/ night</span>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Hero Gallery Section */}
      {allImages.length > 0 && (
        <div className="relative group/gallery overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 h-auto lg:h-[300px] rounded-xl overflow-hidden ring-1 ring-slate-100">
            {allImages.slice(0, 5).map((image, index) => (
              <div
                key={image.id}
                className={cn(
                  "relative cursor-pointer overflow-hidden bg-slate-100 group transition-all duration-500",
                  "aspect-square lg:aspect-auto", // Force square on mobile
                  index === 0 ? "lg:col-span-2 lg:row-span-2" : "", // Row span only on desktop
                  index === 4 ? "hidden lg:block" : "" // Hide 5th image on mobile to maintain 2x2 balance
                )}
                onClick={() => {
                  setSelectedImageIndex(index);
                  setIsGalleryOpen(true);
                }}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.altText || `Hotel image ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 group-hover:brightness-90 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  priority={index < 2}
                />
                
                {/* Overlay for "More" - Adaptive positioning */}
                {((index === 3 && allImages.length > 4) || (index === 4 && allImages.length > 5)) && (
                  <div className={cn(
                    "absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center text-white z-10 pointer-events-none transition-opacity",
                    index === 3 ? "lg:hidden" : "hidden lg:flex"
                  )}>
                    <div className="text-center">
                      <Grid3X3 className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        +{allImages.length - (index + 1)} More
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Floating Actions Overlay */}
          <div className={cn(
            "flex items-center justify-between mt-4",
            "lg:absolute lg:bottom-4 lg:left-4 lg:right-4 lg:mt-0 lg:pointer-events-none"
          )}>
            {hotel.roomTypes && hotel.roomTypes.length > 0 && (
              <Button 
                className="lg:pointer-events-auto bg-blue-900/90 backdrop-blur-md text-white border-none hover:bg-blue-900 shadow-xl transition-all font-bold uppercase tracking-widest text-[9px] px-4 py-2 flex items-center gap-2 rounded-xl"
                onClick={onReserve}
              >
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                Reserve Room
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
