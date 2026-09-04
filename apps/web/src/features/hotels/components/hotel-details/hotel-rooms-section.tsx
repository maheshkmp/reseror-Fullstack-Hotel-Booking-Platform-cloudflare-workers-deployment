"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getImageUrl } from "@/lib/utils";
import { 
  Eye, 
  MapPin, 
  Ruler, 
  TreePine, 
  Users, 
  Waves,
  Zap,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import RoomBookingDialog from "../RoomBookingDialog";
import { RoomDetailsPopup } from "../room-details-popup";

interface HotelRoomsSectionProps {
  hotel: any;
}

const getViewTypeIcon = (viewType: string) => {
  switch (viewType) {
    case "ocean": return <Waves className="w-4 h-4" />;
    case "city": return <MapPin className="w-4 h-4" />;
    case "garden": return <TreePine className="w-4 h-4" />;
    case "mountain": return <TreePine className="w-4 h-4" />;
    case "pool": return <Waves className="w-4 h-4" />;
    case "courtyard": return <Eye className="w-4 h-4" />;
    default: return <Eye className="w-4 h-4" />;
  }
};

export function HotelRoomsSection({ hotel }: HotelRoomsSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promoCode = searchParams?.get("promoCode");
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);

  const roomTypes = hotel.roomTypes || [];

  const handleBookNow = (roomTypeId: string) => {
    setSelectedRoomType(null);
    const baseUrl = `/book-room?hotelId=${hotel.id}&roomTypeId=${roomTypeId}`;
    const targetUrl = promoCode 
      ? `${baseUrl}&promoCode=${encodeURIComponent(promoCode)}`
      : baseUrl;
    router.push(targetUrl);
  };

  return (
    <section id="rooms" className="scroll-mt-24 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold  text-blue-900 ">
          Available Rooms
        </h2>
        <Badge variant="secondary" className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] bg-slate-100 text-slate-600 border-none rounded-xl">
          {roomTypes.length} Room Types
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {roomTypes.length > 0 ? (
          roomTypes.map((roomType: any) => {
            const roomsOfType = (hotel.rooms || []).filter(
              (r: any) => r.roomTypeId === roomType.id
            );
            const availableRooms = roomsOfType.filter(
              (r: any) => r.status === "available"
            ).length;

            const roomImage = (roomType.images || []).length > 0
              ? roomType.images[0]
              : (hotel.images || []).find(
                (img: any) => img.roomTypeId === roomType.id
              );

            return (
              <Card 
                key={roomType.id}
                className="group relative overflow-hidden bg-white border-slate-100 hover:border-slate-300 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-slate-200/40 cursor-pointer rounded-3xl"
                onClick={() => setSelectedRoomType(roomType.id)}
              >
                <div className="flex flex-col lg:flex-row min-h-[220px]">
                  {/* Image Column */}
                  <div className="w-full lg:w-[320px] h-[200px] lg:h-auto relative overflow-hidden bg-slate-100">
                    {roomImage ? (
                      <Image
                        src={getImageUrl(roomImage.imageUrl)}
                        alt={roomType.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 320px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                         <span className="text-[10px] uppercase font-bold tracking-widest">No Image</span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                       <Badge className="w-fit bg-slate-900/80 backdrop-blur-md text-white border-none text-[8px] uppercase tracking-[0.2em] px-2.5 py-1 font-black rounded-lg">
                          {roomType.roomSizeSqm || "32"} m²
                       </Badge>
                       {availableRooms <= 3 && availableRooms > 0 && (
                          <Badge className="w-fit bg-red-500/90 backdrop-blur-md text-white border-none text-[8px] uppercase tracking-[0.2em] px-2.5 py-1 font-black rounded-lg animate-pulse shadow-lg shadow-red-500/20">
                            {availableRooms} LEFT
                          </Badge>
                       )}
                    </div>

                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                       <div className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          View details
                       </div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <CardContent className="flex-1 p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {roomType.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              <span className="text-xs font-semibold">{roomType.maxOccupancy} Guests</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {getViewTypeIcon(roomType.viewType || "city")}
                              <span className="text-xs font-semibold capitalize">{roomType.viewType || "City"} View</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Zap className="w-4 h-4 text-blue-500" />
                              <span className="text-xs font-semibold text-blue-600">Instant Booking</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-2">
                        {roomType.description || "Sophisticated design meets modern comfort in this spacious room featuring luxury amenities and premium bedding."}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {roomType.isRefundable !== false && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-bold uppercase tracking-wider">
                            <Sparkles className="w-2.5 h-2.5" />
                            Free Cancellation
                          </div>
                        )}
                         <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-bold uppercase tracking-wider">
                            <Zap className="w-2.5 h-2.5" />
                            Instant Confirmation
                          </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                       <div className="space-y-0.5">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Per night</p>
                          <div className="flex items-baseline gap-1">
                             <span className="text-2xl font-black text-slate-900 leading-none">${roomType.price || "199"}</span>
                             <span className="text-[10px] font-bold text-slate-400 leading-none">USD</span>
                          </div>
                       </div>
                       
                       <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-3">
                          <Button variant="ghost" className="hidden sm:flex text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900">
                             Details
                          </Button>
                          <RoomBookingDialog
                            hotelId={hotel.id}
                            roomTypeId={roomType.id ? String(roomType.id) : ""}
                          />
                       </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
             <p className="text-slate-500 text-sm font-medium italic">No room types available at this property.</p>
          </div>
        )}
      </div>

      {/* Room Details Popup */}
      <RoomDetailsPopup
        roomTypeId={selectedRoomType || ""}
        isOpen={!!selectedRoomType}
        onClose={() => setSelectedRoomType(null)}
        onBookNow={handleBookNow}
      />
    </section>
  );
}
