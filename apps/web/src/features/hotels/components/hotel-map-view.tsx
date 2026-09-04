"use client";

import { 
  Map, 
  AdvancedMarker, 
  useMap,
  MapCameraChangedEvent
} from "@vis.gl/react-google-maps";
import { useEffect, useState, useCallback, useMemo } from "react";
import { HotelSelectType } from "core/zod";
import { cn } from "@/lib/utils";
import { HotelCard } from "./hotel-card";
import { X } from "lucide-react";

interface HotelMapViewProps {
  hotels: (Partial<HotelSelectType> & { id: string })[];
}

export function HotelMapView({ hotels }: HotelMapViewProps) {
  const map = useMap();
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  // Filter hotels that have coordinates
  const hotelsWithCoords = useMemo(() => 
    hotels.filter(h => h.latitude && h.longitude),
    [hotels]
  );

  const selectedHotel = useMemo(() => 
    hotels.find(h => h.id === selectedHotelId),
    [hotels, selectedHotelId]
  );

  // Auto-fit bounds when hotels change
  useEffect(() => {
    if (!map || hotelsWithCoords.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    hotelsWithCoords.forEach((hotel) => {
      bounds.extend({
        lat: parseFloat(hotel.latitude!),
        lng: parseFloat(hotel.longitude!),
      });
    });

    map.fitBounds(bounds, 50);
  }, [map, hotelsWithCoords]);

  return (
    <div className="relative w-full h-[calc(100vh-200px)] lg:h-[calc(100vh-240px)] rounded-3xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
      <Map
        defaultCenter={{ lat: 7.8731, lng: 80.7718 }} // Sri Lanka center
        defaultZoom={8}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || "bf51a910020fa874"} // Fallback or empty
        disableDefaultUI={true}
        zoomControl={true}
        gestureHandling={'greedy'}
        className="w-full h-full"
      >
        {hotelsWithCoords.map((hotel) => {
          const minPrice = hotel.roomTypes && hotel.roomTypes.length > 0 
            ? Math.min(...hotel.roomTypes.map((rt: any) => parseFloat(rt.price || "0"))) 
            : 0;

          return (
            <AdvancedMarker
              key={hotel.id}
              position={{
                lat: parseFloat(hotel.latitude!),
                lng: parseFloat(hotel.longitude!),
              }}
              onClick={() => setSelectedHotelId(hotel.id)}
            >
              <div className={cn(
                "px-2 py-1 rounded-full shadow-md border transition-all duration-200 cursor-pointer font-black text-xs min-w-[50px] text-center",
                selectedHotelId === hotel.id 
                  ? "bg-[#003580] text-white border-[#003580] scale-110 z-10" 
                  : "bg-white text-gray-900 border-gray-200 hover:border-[#003580] hover:scale-105"
              )}>
                {minPrice > 0 ? `$${minPrice.toFixed(0)}` : "???"}
              </div>
            </AdvancedMarker>
          );
        })}
      </Map>

      {/* Selected Hotel Quick View Card */}
      {selectedHotel && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] z-20">
          <div className="relative bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setSelectedHotelId(null)}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center hover:bg-white transition-colors"
            >
              <X className="w-4 h-4 text-gray-900" />
            </button>
            <HotelCard 
              hotel={selectedHotel} 
              layout="grid" 
              className="border-none shadow-none rounded-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
