"use client";

import { useCreateWishlist } from "@/features/wishlist/actions/use-create-wishlist";
import { useDeleteWishlist } from "@/features/wishlist/actions/use-delete-wishlist";
import { cn, getImageUrl } from "@/lib/utils";
import { Home, MapPin, Star, Heart, Bed, ShowerHead, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { Villa } from "core/zod";

type PublicVillaCardProps = {
  villa: Villa & { images?: any[] };
  className?: string;
  layout?: "grid" | "list";
};

export function PublicVillaCard({ 
  villa, 
  className,
  layout = "grid" 
}: PublicVillaCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const createWishlist = useCreateWishlist();
  const deleteWishlist = useDeleteWishlist();

  // Format location string
  const getLocationString = () => {
    const parts = [villa?.city, villa?.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  };

  const hasValidImages = Array.isArray(villa?.images) && villa.images.length > 0;
  const currentImage = hasValidImages ? villa.images?.[currentImageIndex] : null;

  // Mock guest rating for consistent look
  const guestRating = villa?.starRating ? (villa.starRating * 1.8).toFixed(1) : "8.9";
  const getRatingLabel = (score: string) => {
    const s = parseFloat(score);
    if (s >= 9) return "Exceptional";
    if (s >= 8) return "Very Good";
    if (s >= 7) return "Good";
    return "Pleasant";
  };

  const handleWishlistClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!villa?.id) return;
    if (!wishlistAdded) {
      setWishlistAdded(true);
      toast.success("Added to favorites", {
        description: `${villa.name} is now in your wishlist`,
        icon: <Heart className="h-4 w-4 fill-red-500 text-red-500" />,
      });
      try {
        const result = await createWishlist.mutateAsync({
          hotelId: null,
          restaurantId: null,
          roomTypeId: null,
          // Assuming wishlist support for villas will be added or reused via a generic field if available
          // For now, mirroring the existing behavior
        } as any);
        setWishlistId(result?.id ?? null);
      } catch (err) {
        setWishlistAdded(false);
        toast.error("Failed to add to favorites");
      }
    } else {
      setWishlistAdded(false);
      toast("Removed from favorites");
      try {
        await deleteWishlist.mutateAsync(wishlistId ?? villa.id);
        setWishlistId(null);
      } catch (err) {
        setWishlistAdded(true);
        toast.error("Failed to remove from favorites");
      }
    }
  };

  return (
    <div 
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
        href={`/villas/${villa.id}`}
        className="absolute inset-0 z-10"
        aria-label={`View details for ${villa.name}`}
      />
      
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden shrink-0",
        layout === "grid" ? "aspect-[4/3] w-full" : "w-full md:w-56 lg:w-64 aspect-[4/3] md:aspect-auto h-48 md:h-auto"
      )}>
        {currentImage?.imageUrl && !imageError ? (
          <Image
            src={getImageUrl(currentImage.imageUrl)}
            alt={currentImage.altText || villa?.name || "Villa Image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80"
            alt={villa?.name || "Villa"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 absolute inset-0"
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 transition-opacity group-hover:opacity-80" />
        
        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={cn(
            "absolute top-2.5 right-2.5 z-30 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 group/heart overflow-visible",
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
              <Heart className={cn("h-4 w-4", wishlistAdded && "fill-current")} />
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Category Badge */}
        <div className="absolute top-2.5 left-2.5 z-20">
          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#003580] rounded-md shadow-sm">
            Private Villa
          </span>
        </div>
      </div>
      
      <div className={cn(
        "flex-1 flex flex-col p-4",
        layout === "list" && "md:p-5"
      )}>
        <div className="flex flex-col h-full">
          {/* Header Area */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-0.5 mb-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-2.5 w-2.5",
                      i < (villa?.starRating || 0) 
                        ? "text-amber-500 fill-amber-500" 
                        : "text-gray-200 fill-gray-200"
                    )} 
                  />
                ))}
              </div>
              <h3 className={cn(
                "font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-[#004BD7] transition-colors",
                layout === "grid" ? "text-base" : "text-lg md:text-xl"
              )}>
                {villa?.name}
              </h3>
              <div className="flex items-center gap-1 text-gray-500 mt-1.5">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="text-[11px] font-medium truncate">{getLocationString()}</span>
              </div>
            </div>

            {/* Rating Score */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-900 leading-none mb-0.5">{getRatingLabel(guestRating)}</span>
                <span className="text-[9px] text-gray-400 font-medium leading-none">40+ reviews</span>
              </div>
              <div className="bg-[#003580] text-white font-black rounded-lg w-8 h-8 flex items-center justify-center text-[12px]">
                {guestRating}
              </div>
            </div>
          </div>

          <p className="text-[12px] text-gray-600 line-clamp-2 mt-2 leading-relaxed">
            {villa.description || "Experience seclusion and luxury in our private villas. Perfect for families or groups seeking a home away from home."}
          </p>

          {/* Villa Amenities Summary (Mock) */}
          <div className="flex items-center gap-3 mt-4 text-gray-500">
             <div className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5" />
                <span className="text-[10px] font-medium">3 Beds</span>
             </div>
             <div className="flex items-center gap-1">
                <ShowerHead className="h-3.5 w-3.5" />
                <span className="text-[10px] font-medium">2 Baths</span>
             </div>
             <div className="flex items-center gap-1">
                <Square className="h-3.5 w-3.5" />
                <span className="text-[10px] font-medium">120m²</span>
             </div>
          </div>

          {/* Price Component (Mock for landing page feel) */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#003580] uppercase tracking-tight">From</span>
              <div className="flex items-baseline gap-0.5">
                <span className="font-black text-[#003580] text-lg">$249</span>
                <span className="text-[10px] text-gray-400 font-medium">/ night</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-tight">
                Private Pool
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
