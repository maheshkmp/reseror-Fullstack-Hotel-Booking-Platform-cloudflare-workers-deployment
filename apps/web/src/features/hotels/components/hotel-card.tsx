"use client";

import { useCreateWishlist } from "@/features/wishlist/actions/use-create-wishlist";
import { useDeleteWishlist } from "@/features/wishlist/actions/use-delete-wishlist";
import { CardContent } from "@/components/ui/card";
import { cn, getImageUrl } from "@/lib/utils";
import { Building2, Crown, Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import type { HotelSelectType } from "core/zod";

type HotelCardProps = {
  hotel: Partial<HotelSelectType> & { id: string };
  className?: string;
  layout?: "grid" | "list";
};

export function HotelCard({ 
  hotel, 
  className,
  layout = "grid" 
}: HotelCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const createWishlist = useCreateWishlist();
  const deleteWishlist = useDeleteWishlist();

  if (!hotel) return null;

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hotel.images && hotel.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % hotel.images!.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hotel.images && hotel.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + hotel.images!.length) % hotel.images!.length);
    }
  };

  // Format location string
  const getLocationString = () => {
    const parts = [hotel?.city, hotel?.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  };

  const hasValidImages = Array.isArray(hotel?.images) && hotel.images.length > 0;
  const currentImage = hasValidImages ? hotel.images?.[currentImageIndex] : null;

  // Stable simulated rating based on ID if not provided by performance data
  const getSimulatedRating = (id: string, stars: number = 0) => {
    // Basic hash of the ID to get a consistent decimal
    const charSum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const decimal = (charSum % 10) / 10;
    // Map 3-5 stars to ~7.0-9.8 range
    const base = stars > 0 ? 6.5 + (stars * 0.6) : 7.0;
    return (base + decimal).toFixed(1);
  };

  const guestRating = hotel?.performance?.totalBookings 
    ? (Math.min(9.9, 8.0 + (hotel.performance.totalBookings / 100))).toFixed(1)
    : getSimulatedRating(hotel.id, hotel.starRating || 0);

  const getRatingLabel = (score: string) => {
    const s = parseFloat(score);
    if (s >= 9.5) return "Exceptional";
    if (s >= 9.0) return "Superb";
    if (s >= 8.5) return "Fabulous";
    if (s >= 8.0) return "Very Good";
    return "Good";
  };

  const reviewCount = hotel.performance?.totalBookings 
    ? hotel.performance.totalBookings 
    : (hotel.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 500 + 42);

  // Calculate minimum price from room types
  const minPrice = hotel.roomTypes && hotel.roomTypes.length > 0 
    ? Math.min(...hotel.roomTypes.map((rt: any) => parseFloat(rt.price || "0"))) 
    : 0; // 0 indicates no price available

  const handleWishlistClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!hotel?.id) return;
    if (!wishlistAdded) {
      setWishlistAdded(true);
      toast.success("Added to favorites", {
        description: `${hotel.name} is now in your wishlist`,
        icon: <Heart className="h-4 w-4 fill-red-500 text-red-500" />,
      });
      try {
        const result = await createWishlist.mutateAsync({
          hotelId: hotel.id,
          restaurantId: null,
          roomTypeId: null,
        });
        setWishlistId(result?.id ?? null);
      } catch (err) {
        setWishlistAdded(false);
        toast.error("Failed to add to favorites");
      }
    } else {
      setWishlistAdded(false);
      toast("Removed from favorites");
      try {
        await deleteWishlist.mutateAsync(wishlistId ?? hotel.id);
        setWishlistId(null);
      } catch (err) {
        setWishlistAdded(true);
        toast.error("Failed to remove from favorites");
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "group relative flex bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,53,128,0.06)] hover:-translate-y-0.5 h-full",
        layout === "grid" ? "flex-col" : "flex-col md:flex-row",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Primary Link Overlay */}
      <Link 
        href={`/hotels/${hotel.slug || hotel.id}`}
        className="absolute inset-0 z-10"
        aria-label={`View details for ${hotel.name}`}
      />
      
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden shrink-0",
        layout === "grid" ? "aspect-[3/2] w-full" : "w-full md:w-56 lg:w-64 aspect-[3/2] md:aspect-auto h-48 md:h-auto"
      )}>
        {currentImage?.imageUrl && !imageError ? (
          <Image
            src={getImageUrl(currentImage.imageUrl)}
            alt={currentImage.altText || hotel?.name || "Hotel Image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-slate-50 flex items-center justify-center">
            <Building2 className="h-10 w-10 text-slate-300" />
          </div>
        )}

        {/* Gradient Overlay for content readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 transition-opacity group-hover:opacity-80" />
        
        {/* Badges on image */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5">
          {hotel?.propertyClass?.name && (
            <span className="px-1.5 py-0.5 bg-[#003580] text-[8px] font-bold uppercase tracking-wider text-white rounded-md shadow-sm">
              {hotel.propertyClass.name}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={cn(
            "absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 group/heart overflow-visible",
            wishlistAdded ? "text-red-500" : "text-gray-400 hover:text-red-500"
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={wishlistAdded ? "added" : "not-added"}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Heart className={cn("h-3.5 w-3.5", wishlistAdded && "fill-current")} />
            </motion.div>
          </AnimatePresence>
          
          {/* Subtle pulse effect on hover if not added */}
          {!wishlistAdded && (
            <div className="absolute inset-0 rounded-full bg-red-400/20 scale-0 group-hover/heart:animate-ping -z-10" />
          )}
        </button>

        {/* Indicators */}
        {hasValidImages && hotel.images && hotel.images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {hotel.images.slice(0, 3).map((_: any, i: number) => (
              <div 
                key={i} 
                className={cn(
                  "w-1 h-1 rounded-full bg-white/60 transition-all duration-300",
                  i === currentImageIndex && "bg-white w-2"
                )} 
              />
            ))}
          </div>
        )}
      </div>
      
      <div className={cn(
        "flex-1 flex flex-col p-3.5",
        layout === "list" && "md:p-5"
      )}>
        <div className="flex flex-col h-full">
          {/* Header Area: Title + Rating */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-2 w-2",
                      i < (hotel?.starRating || 0) 
                        ? "text-amber-500 fill-amber-500" 
                        : "text-gray-200 fill-gray-200"
                    )} 
                  />
                ))}
              </div>
              <h3 className={cn(
                "font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-[#004BD7] transition-colors",
                layout === "grid" ? "text-[15px]" : "text-lg md:text-xl"
              )}>
                {hotel?.name}
              </h3>
              <div className="flex items-center gap-1 text-gray-500 mt-0.5">
                <MapPin className="h-2.5 w-2.5 shrink-0" />
                <span className="text-[10px] font-medium truncate">{getLocationString()}</span>
              </div>
            </div>

            {/* Guest Rating Score */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-900 leading-none mb-0.5">{getRatingLabel(guestRating)}</span>
                <span className="text-[8px] text-gray-400 font-medium leading-none">{reviewCount > 100 ? `${(reviewCount/1000).toFixed(1)}k` : reviewCount} reviews</span>
              </div>
              <div className="bg-[#003580] text-white font-black rounded-lg w-7 h-7 flex items-center justify-center text-[11px]">
                {guestRating}
              </div>
            </div>
          </div>

          {/* Amenities Badges */}
          <div className="flex flex-wrap gap-1 mb-4">
            <span className="text-[8px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 uppercase tracking-tighter">
              Free Cancellation
            </span>
            <span className="text-[8px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">
              No Prepayment
            </span>
          </div>

          {/* Price Component - Unified Row */}
          <div className="mt-auto pt-2.5 border-t border-gray-100 flex items-end justify-between">
            <div className="flex flex-col">
              {minPrice > 0 ? (
                <>
                  <div className="flex items-center gap-1.5 h-3 mb-1">
                    <span className="text-[10px] text-gray-400 line-through font-medium leading-none">${(minPrice * 1.2).toFixed(0)}</span>
                    <span className="text-[8px] font-black text-rose-500 leading-none">SAVE 20%</span>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className={cn(
                      "font-black text-[#003580] tracking-tight",
                      layout === "grid" ? "text-lg" : "text-2xl"
                    )}>${minPrice.toFixed(0)}</span>
                    <span className="text-[10px] text-gray-400 font-medium">/ night</span>
                  </div>
                </>
              ) : (
                <span className="text-[10px] text-gray-400 font-medium italic">Contact for pricing</span>
              )}
            </div>

            {minPrice > 0 && (
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-bold text-gray-900 mb-0.5">${(minPrice * 3).toFixed(0)} total</span>
                <span className="text-[9px] text-gray-400 leading-none font-medium">incl. taxes & fees</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


// Demo component to show different states
export default function HotelCardDemo() {
  const sampleHotel = {
    id: "e035107f-4056-4819-9418-351f537dcd70",
    name: "Hotel Tharu",
    brandName: "Tharu Hotels & Resorts",
    description: "Experience luxury and comfort in the heart of Kandy.",
    street: "123 Ocean Drive",
    city: "Kandy",
    country: "Sri Lanka",
    starRating: 5,
    hotelType: null,
    propertyClass: { 
      id: "pc-1",
      name: "luxury",
      slug: "luxury",
      thumbnail: null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    },
    images: [
      {
        id: "img-1",
        hotelId: "e035107f-4056-4819-9418-351f537dcd70",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
        altText: "Hotel Exterior",
        displayOrder: 0,
        isThumbnail: true,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      }
    ],
    roomTypes: [{ 
      id: "rt-1",
      hotelId: "e035107f-4056-4819-9418-351f537dcd70",
      name: "Deluxe Room",
      price: "150", 
      capacity: 2,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    }],
    createdAt: new Date().toISOString(),
    updatedAt: null,
    organizationId: "org-1",
    createdBy: "user-1",
    status: "active" as const,
  };

  const emptyHotel = {
    id: "empty-hotel",
    name: "Luxury Beach Resort",
    street: "Beach Road",
    city: "Bentota",
    country: "Sri Lanka",
    starRating: 5,
    images: [],
    roomTypes: [],
    createdAt: new Date().toISOString(),
    updatedAt: null,
    organizationId: "org-1",
    createdBy: "user-1",
    status: "active" as const,
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 border-b pb-4">Dynamic Hotel Card Design</h2>
        
        {/* Sample Hotel */}
        <HotelCard hotel={sampleHotel as any} />

        {/* Another Example */}
        <HotelCard
          hotel={{
            ...sampleHotel,
            id: "2",
            name: "Gold Cabana & Villa",
            starRating: 4,
            roomTypes: [{ ...sampleHotel.roomTypes[0], price: "85" }],
          } as any}
        />

        <HotelCard hotel={emptyHotel as any} />
      </div>
    </div>
  );
}
