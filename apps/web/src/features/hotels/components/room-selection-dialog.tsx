"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Users, Waves, Eye, MapPin, TreePine, Zap, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface RoomSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: any;
  bookingData: {
    checkIn?: Date;
    checkOut?: Date;
    adults: number;
    children: number;
  };
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

export function RoomSelectionDialog({
  isOpen,
  onClose,
  hotel,
  bookingData,
}: RoomSelectionDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promoCode = searchParams?.get("promoCode");
  const roomTypes = hotel.roomTypes || [];

  const handleSelectRoom = (roomTypeId: string) => {
    const params = new URLSearchParams({
      hotelId: hotel.id,
      roomTypeId: roomTypeId,
    });

    if (bookingData.checkIn) params.set("checkIn", bookingData.checkIn.toISOString());
    if (bookingData.checkOut) params.set("checkOut", bookingData.checkOut.toISOString());
    params.set("adults", bookingData.adults.toString());
    params.set("children", bookingData.children.toString());
    
    if (promoCode) {
      params.set("promoCode", promoCode);
    }

    router.push(`/book-room?${params.toString()}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-lg border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Select Your Room
          </DialogTitle>
          <p className="text-sm text-slate-500 font-medium">
            Choose a room type to complete your reservation at <span className="text-slate-900 font-bold">{hotel.name}</span>
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-4 no-scrollbar">
          {roomTypes.length > 0 ? (
            roomTypes.map((roomType: any) => {
              const roomImage = (hotel.images || []).find(
                (img: any) => img.roomTypeId === roomType.id
              );

              return (
                <div
                  key={roomType.id}
                  className="group flex flex-col md:flex-row gap-6 p-4 rounded-md border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Small Image Preview */}
                  <div className="w-full md:w-48 h-32 relative rounded-sm overflow-hidden shrink-0 bg-slate-100">
                    {roomImage ? (
                      <Image
                        src={roomImage.imageUrl}
                        alt={roomType.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                         <Zap className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Room Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                          {roomType.name}
                        </h3>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Starting from</p>
                          <p className="text-xl font-black text-slate-900">${roomType.price || "199"}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-bold uppercase tracking-tight">{roomType.maxOccupancy} Guests</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getViewTypeIcon(roomType.viewType || "city")}
                          <span className="text-[11px] font-bold uppercase tracking-tight capitalize">{roomType.viewType || "City"} View</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSelectRoom(roomType.id)}
                      className="mt-4 w-full md:w-auto self-end bg-slate-900 hover:bg-slate-800 text-white rounded-sm font-bold uppercase tracking-widest text-[10px] px-6 h-10 group-hover:translate-x-1 transition-transform"
                    >
                      Select & Continue
                      <ArrowRight className="ml-2 w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400">
              No rooms available.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
