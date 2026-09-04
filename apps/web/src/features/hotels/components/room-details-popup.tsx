"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  BedDouble,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Users,
  Warehouse,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/lib/utils";
import { useGetRoomTypeByID } from "../queries/use-get-room-type-by-id";
import { useGetRoomTypeImages } from "../queries/use-get-room-type-images-by-id";

interface RoomDetailsPopupProps {
  roomTypeId: string;
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: (roomTypeId: string) => void;
}

export function RoomDetailsPopup({
  roomTypeId,
  isOpen,
  onClose,
  onBookNow,
}: RoomDetailsPopupProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: roomDetails, isLoading: loading } = useGetRoomTypeByID(
    isOpen ? roomTypeId : null
  );
  const { data: roomImages } = useGetRoomTypeImages(isOpen ? roomTypeId : null);

  const nextImage = () => {
    if (!roomImages?.data) return;
    setCurrentImageIndex((prev) =>
      prev === roomImages.data.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    if (!roomImages?.data) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? roomImages.data.length - 1 : prev - 1
    );
  };

  const getAvailableRooms = () => {
    if (!roomDetails?.rooms) return 0;
    return roomDetails.rooms.filter((room:any) => room.status === "available")
      .length;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          p-0
          h-auto
          max-h-[90vh]
          w-[95vw]
          md:max-w-6xl
          overflow-hidden
          rounded-[14px] md:rounded-[24px]
          border-none
          shadow-2xl
          bg-white
        "
      >
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07143d]" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            {/* Left: Image Gallery */}
            <div className="w-full md:w-[55%] flex flex-col bg-gray-50/50">
              <div className="relative group flex-1 min-h-[300px] md:min-h-[100px]">
                {roomImages?.data && roomImages.data.length > 0 ? (
                  <>
                    <Image
                      src={getImageUrl(roomImages.data[currentImageIndex].imageUrl)}
                      alt={roomImages.data[currentImageIndex].altText || "Room image"}
                      fill
                      className="object-cover transition-all duration-700"
                      priority
                    />
                    
                    {/* Navigation buttons */}
                    {roomImages.data.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border border-white/30"
                          onClick={previousImage}
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border border-white/30"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </div>
                    )}

                    {/* Image Counter Badge */}
                    <div className="absolute bottom-6 left-6 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                      {currentImageIndex + 1} / {roomImages.data.length}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-100 text-[#07143d]/40 font-medium">
                    No images available
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {roomImages?.data && roomImages.data.length > 1 && (
                <div className="p-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm overflow-x-auto">
                  <div className="flex gap-3 pb-2">
                    {roomImages.data.map((img, index) => (
                      <button
                        key={img.id || index}
                        className={`relative h-18 w-28 mb-10 flex-shrink-0 rounded-xl overflow-hidden transition-all ${
                          index === currentImageIndex
                            ? "ring-2 ring-[#07143d] ring-offset-2 scale-95"
                            : "opacity-60 hover:opacity-100 hover:scale-105"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <Image
                          src={getImageUrl(img.imageUrl)}
                          alt={img.altText || `Room image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Room Info */}
            <div className="w-full md:w-[45%] flex flex-col min-h-0  bg-white">
              <div className="p-5 md:p-8 flex-1 overflow-y-auto space-y-6 md:space-y-8">
                <div className="space-y-3">
                  <h2 className="text-3xl font-extrabold text-[#07143d] ">
                    {roomDetails?.name}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {roomDetails?.description}
                  </p>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2">
                    <Users className="w-5 h-5 text-[#07143d]/60" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Occupancy</p>
                      <p className="text-sm font-bold text-[#07143d]">
                        {roomDetails?.baseOccupancy}-{roomDetails?.maxOccupancy} Guests
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2">
                    <Maximize2 className="w-5 h-5 text-[#07143d]/60" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Room Size</p>
                      <p className="text-sm font-bold text-[#07143d]">
                        {roomDetails?.roomSizeSqm || "N/A"} m²
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2">
                    <BedDouble className="w-5 h-5 text-[#07143d]/60" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bed Type</p>
                      <p className="text-sm font-bold text-[#07143d] truncate">
                        {roomDetails?.bedConfiguration || "Standard"}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2">
                    <Warehouse className="w-5 h-5 text-[#07143d]/60" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">View Type</p>
                      <p className="text-sm font-bold text-[#07143d] capitalize">
                        {roomDetails?.viewType || "City"} View
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amenities List */}
                {roomDetails?.amenities?.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-[#07143d] uppercase tracking-widest">Room Amenities</h3>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      {roomDetails.amenities.map((amenity:any) => (
                        <div key={amenity.id} className="flex items-center gap-2 group">
                          <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          </div>
                          <span className="text-sm text-[#07143d]/80 capitalize">
                            {amenity.amenityType.replace(/_/g, " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Footer - sticky at bottom */}
              <div className="p-5 md:p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between mt-auto">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Nightly Rate</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#07143d]">
                      ${roomDetails?.price || "---"}
                    </span>
                    <span className="text-xs text-muted-foreground">/ night</span>
                  </div>
                </div>
                <Button 
                  className="bg-[#07143d] hover:bg-[#07143d]/90 text-white rounded-2xl px-8 h-14 font-bold shadow-xl shadow-[#07143d]/20 transition-all active:scale-95"
                  onClick={() => onBookNow?.(roomTypeId)}
                >
                  Reserve This Room
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
