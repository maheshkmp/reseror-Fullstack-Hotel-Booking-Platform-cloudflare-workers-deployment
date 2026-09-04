import { useGetHotelById } from "@/features/wishlist/actions/get-hotel-by-id";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Building2, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useDeleteWishlist } from "@/features/wishlist/actions/use-delete-wishlist";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export interface WishlistCardProps {
  id?: string; // The wishlist record ID
  hotelId: string;
  className?: string;
}

export function WishlistCard({ id, hotelId, className }: WishlistCardProps) {
  const { data: hotel, isLoading, error } = useGetHotelById(hotelId);
  const deleteWishlist = useDeleteWishlist();
  const queryClient = useQueryClient();

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return;

    try {
      await deleteWishlist.mutateAsync(id);
      toast.success("Removed from wishlist");
      // Invalidate both general wishlist and account specific queries
      queryClient.invalidateQueries({ queryKey: ["Wishlist"] });
    } catch (err) {
      toast.error("Failed to remove from wishlist");
    }
  };

  if (isLoading) {
    return (
      <div className={cn("bg-white rounded-xl border border-gray-100 p-2 h-48 animate-pulse", className)}>
        <div className="bg-gray-100 rounded-lg h-32 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    );
  }
  if (error || !hotel) {
    return null; // Don't show failed items
  }

  const thumbnailImage =
    hotel.images?.find((img: any) => img.isThumbnail) || hotel.images?.[0];

  const guestRating = hotel?.starRating ? (hotel.starRating * 1.8).toFixed(1) : "8.4";

  return (
    <div className={cn(
      "group relative flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 h-full",
      className
    )}>
      <Link href={`/hotels/${hotel.slug || hotel.id}`} className="absolute inset-0 z-10" />
      
      <div className="relative aspect-[3/2] overflow-hidden shrink-0">
        {thumbnailImage?.imageUrl ? (
          <Image
            src={thumbnailImage.imageUrl}
            alt={thumbnailImage.altText || hotel.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-slate-300" />
          </div>
        )}
        
        {/* Rating Overlay */}
        <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded-md shadow-sm">
          <div className="bg-[#003580] text-white font-bold rounded px-1 py-0.5 text-[9px]">
            {guestRating}
          </div>
        </div>

        {/* Remove Button */}
        {id && (
          <button
            onClick={handleRemove}
            className="absolute top-2 left-2 z-20 w-7 h-7 rounded-lg bg-white/95 backdrop-blur-md shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:shadow-md transition-all active:scale-95 group/remove"
            title="Remove from favorites"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col p-3">
        <div className="flex items-center gap-0.5 mb-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("h-2 w-2", i < (hotel?.starRating || 0) ? "fill-current" : "text-gray-200 fill-gray-200")} />
          ))}
        </div>

        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1 mb-0.5 group-hover:text-[#004BD7] transition-colors">
          {hotel.name}
        </h3>
        
        <div className="flex items-center gap-1 text-gray-500 mb-2">
          <MapPin className="h-2.5 w-2.5 shrink-0" />
          <span className="text-[10px] font-medium truncate">
            {[hotel.city, hotel.country].filter(Boolean).join(", ")}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-2 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[14px] font-black text-[#003580]">
              ${parseFloat(hotel.roomTypes?.[0]?.price || "168").toFixed(0)}
            </span>
            <span className="text-[9px] text-gray-400 font-medium leading-none">per night</span>
          </div>
          <button className="text-[10px] font-bold text-[#003580] bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors z-20 relative">
            Book now
          </button>
        </div>
      </div>
    </div>
  );
}
