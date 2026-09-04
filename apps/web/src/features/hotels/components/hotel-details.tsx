"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  Minus, 
  Plus, 
  Star, 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  Languages, 
  CalendarDays,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useGetReviewsByHotelId } from "@/features/review/actions/use-get-review-by-hotel-id";
import { languagesList } from "@/lib/helpers/languages-map";

// New Sub-components
import { HotelHero } from "./hotel-details/hotel-hero";
import { HotelNavigation } from "./hotel-details/hotel-navigation";
import { HotelRoomsSection } from "./hotel-details/hotel-rooms-section";
import { HotelAmenitiesFacilities } from "./hotel-details/hotel-amenities-facilities";
import { HotelRulesFaqs } from "./hotel-details/hotel-rules-faqs";
import { HotelLocationSafety } from "./hotel-details/hotel-location-safety";
import { HotelReviewsSection } from "./hotel-details/hotel-reviews-section";
import HotelSearchComponent from "./advanced-search";
import { RoomSelectionDialog } from "./room-selection-dialog";
import { HotelRestaurantsSection } from "./hotel-details/hotel-restaurants-section";

interface HotelDetailsProps {
  hotel: any;
}

// Component for the booking and availability checker sidebar
const BookingAvailabilityChecker = ({
  hotel,
  onCheckAvailability,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  guests,
  setGuests,
}: {
  hotel: any;
  onCheckAvailability: () => void;
  checkInDate?: Date;
  setCheckInDate: (d?: Date) => void;
  checkOutDate?: Date;
  setCheckOutDate: (d?: Date) => void;
  guests: { adults: number; children: number; rooms: number };
  setGuests: (g: any) => void;
}) => {
  const [isChecking, setIsChecking] = React.useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = React.useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = React.useState(false);
  const [isGuestOpen, setIsGuestOpen] = React.useState(false);

  // Fetch real reviews for dynamic rating display in sidebar
  const { data: reviewsData } = useGetReviewsByHotelId({ hotelId: hotel.id, page: 1, limit: 100 });
  const reviews = reviewsData?.data || [];
  const totalReviews = reviewsData?.meta?.totalCount ?? reviews.length;
  const avgRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  const handleGuestChange = (type: "adults" | "children" | "rooms", op: "inc" | "dec") => {
    setGuests((prev: { adults: number; children: number; rooms: number }) => ({
      ...prev,
      [type]: op === "inc" ? prev[type] + 1 : Math.max(type === "adults" ? 1 : 0, prev[type] - 1),
    }));
  };

  return (
    <Card className="sticky top-32 p-6 border border-slate-200 bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/40 ring-1 ring-slate-100/50">
      <div className="space-y-2">
        {/* Dynamic Guest Rating — hidden when no reviews */}
        {avgRating !== null && totalReviews > 0 && (
          <div className="space-y-1 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none block">
                Guest Rating
              </p>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-900 text-white rounded-md text-[10px] font-bold">
                <CheckCircle2 className="w-2.5 h-2.5" />
                VERIFIED
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1.5">
              <span className="text-2xl font-black text-slate-900 leading-none">
                {avgRating.toFixed(1)}
              </span>
              <div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < Math.round(avgRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-slate-100 text-slate-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-400 lowercase leading-none">
                  based on {totalReviews} reviews
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
            <PopoverTrigger asChild>
              <button className="flex flex-col gap-1 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-white text-left transition-all active:scale-95">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Check-in</span>
                <span className="text-sm font-bold text-slate-800">
                  {checkInDate ? format(checkInDate, "MMM dd") : "Add Date"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none rounded-2xl shadow-3xl" align="start">
              <CalendarComponent
                mode="single"
                selected={checkInDate}
                onSelect={(d) => {
                  setCheckInDate(d);
                  setIsCheckInOpen(false);
                  if (d && !checkOutDate) setIsCheckOutOpen(true);
                }}
                disabled={(d) => d < new Date()}
                className="rounded-2xl"
              />
            </PopoverContent>
          </Popover>

          <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
            <PopoverTrigger asChild>
              <button className="flex flex-col gap-1 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-white text-left transition-all active:scale-95">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Check-out</span>
                <span className="text-sm font-bold text-slate-800">
                  {checkOutDate ? format(checkOutDate, "MMM dd") : "Add Date"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none rounded-2xl shadow-3xl" align="start">
              <CalendarComponent
                mode="single"
                selected={checkOutDate}
                onSelect={(d) => {
                  setCheckOutDate(d);
                  setIsCheckOutOpen(false);
                }}
                disabled={(d) => d <= (checkInDate || new Date())}
                className="rounded-2xl"
              />
            </PopoverContent>
          </Popover>
        </div>

        <Popover open={isGuestOpen} onOpenChange={setIsGuestOpen}>
          <PopoverTrigger asChild>
            <button className="w-full flex flex-col gap-1 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-white text-left transition-all active:scale-95">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Guests & Rooms</span>
              <span className="text-sm font-bold text-slate-800">
                {guests.adults} Adults, {guests.children} Children • {guests.rooms} Room
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-5 border-none rounded-3xl shadow-3xl bg-white/95 backdrop-blur-xl" align="start">
            <div className="space-y-4">
              {Object.entries(guests).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800 capitalize">{key}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {key === "adults" ? "Ages 13+" : key === "children" ? "Ages 0-12" : "Occupancy"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-slate-200"
                      onClick={() => handleGuestChange(key as any, "dec")}
                      disabled={val <= (key === "adults" || key === "rooms" ? 1 : 0)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-4 text-center font-bold text-sm">{val}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-slate-200"
                      onClick={() => handleGuestChange(key as any, "inc")}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                className="w-full h-10 mt-2 bg-slate-900 border-none font-bold uppercase tracking-widest text-[10px] rounded-xl"
                onClick={() => setIsGuestOpen(false)}
              >
                Apply Selection
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="space-y-4">
          <Button
            className="w-full h-14 bg-slate-900 text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all"
            disabled={!checkInDate || !checkOutDate || isChecking}
            onClick={() => {
              setIsChecking(true);
              setTimeout(() => {
                onCheckAvailability();
                setIsChecking(false);
              }, 800);
            }}
          >
            {isChecking ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Finding Best Rates...</span>
              </div>
            ) : "Unlock Availability"}
          </Button>
          <p className="text-[9px] text-center font-bold text-emerald-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            Best Price Guaranteed
          </p>
        </div>
      </div>
    </Card>
  );
};

const MobileStickyFooter = ({ hotel, onReserve }: { hotel: any; onReserve: () => void }) => {
  const minPrice = useMemo(() => {
    const prices = (hotel.roomTypes || [])
      .map((rt: any) => Number(rt.price))
      .filter((p: any) => p > 0);
    return prices.length > 0 ? Math.min(...prices) : null;
  }, [hotel.roomTypes]);

  if (!hotel.roomTypes || hotel.roomTypes.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-6 pt-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] transition-transform duration-500">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Starting from</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 leading-none">${minPrice ? minPrice.toLocaleString() : "---"}</span>
            <span className="text-[10px] font-bold text-slate-400 leading-none">/ night</span>
          </div>
        </div>
        <Button 
          onClick={onReserve}
          className="h-12 px-8 bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
        >
          Reserve Now
        </Button>
      </div>
    </div>
  );
};

export function HotelDetailsComponent({ hotel }: HotelDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promoCode = searchParams?.get("promoCode");
  const [isRoomSelectionOpen, setIsRoomSelectionOpen] = React.useState(false);
  
  // Lifted state for consistent selection across buttons
  const [checkInDate, setCheckInDate] = React.useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = React.useState<Date | undefined>(undefined);
  const [guests, setGuests] = React.useState({ adults: 2, children: 0, rooms: 1 });

  useEffect(() => {
    if (promoCode) {
      // Small delay to ensure the content is rendered and anchors are stable
      const timer = setTimeout(() => {
        const el = document.getElementById("rooms");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [promoCode]);

  const handleCheckAvailability = () => {
    const el = document.getElementById("rooms");
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
  };
  
  const handleReserve = () => {
    setIsRoomSelectionOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-900 selection:text-white font-[family-name:var(--font-geist-sans)]">
      {/* 1. Search & Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-4  space-y-3">
        {/* Superior Header with Breadcrumb-style Back Button */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
          >
            <div className="p-1.5 rounded-full border border-slate-100 group-hover:border-slate-300 transition-all">
              <ChevronLeft className="w-3 h-3" />
            </div>
            Back to Search
          </button>
          
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Destinations</span>
            <span className="text-slate-200">/</span>
            <span>{hotel.city}</span>
            <span className="text-slate-200">/</span>
            <span className="text-slate-900">{hotel.name}</span>
          </div>
        </div>

        {/* Search Bar Container with Glassmorphism */}
        <div className="bg-white/40 backdrop-blur-xl border border-slate-400 p-1 rounded-3xl shadow-2xl shadow-slate-200/40 ring-1 ring-white/50">
          <HotelSearchComponent />
        </div>

        <HotelHero hotel={hotel} onReserve={handleReserve} />
      </div>

      {/* 2. Sticky Navigation */}
      <HotelNavigation hotel={hotel} onReserve={handleReserve} />

      {/* 3. Main Content Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">

          {/* Main Flow Column */}
          <div className={cn(
            "space-y-24",
            hotel.roomTypes && hotel.roomTypes.length > 0 ? "lg:col-span-2" : "lg:col-span-3"
          )}>

            {/* At a Glance Section */}
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-xl font-bold  text-blue-900 leading-none">Property Overview</h2>
                {hotel.description && (
                  <p className="text-[15px] text-slate-600 leading-relaxed font-medium">
                    {hotel.description}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8">
                {(hotel.hotelType?.name || hotel.propertyClass?.name) && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Property Type</span>
                    <p className="text-[13px] font-black text-slate-900 leading-tight">
                      {hotel.hotelType?.name || "Independent"}
                      {hotel.propertyClass?.name && <span className="block text-slate-500 font-bold text-[10px] mt-1">{hotel.propertyClass?.name}</span>}
                    </p>
                  </div>
                )}

                {hotel.starRating > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Quality Rating</span>
                    <p className="text-[13px] font-black text-slate-900 leading-tight">{hotel.starRating}-Star Property</p>
                  </div>
                )}

                {hotel.languages?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Languages</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                       {hotel.languages.map((l: any) => {
                         const lang = languagesList.find((lang) => lang.code === l.languageCode);
                         return (
                           <Badge 
                            key={l.id} 
                            variant="secondary" 
                            className="bg-slate-100 text-slate-900 border-none rounded-lg h-5 px-2 text-[10px] font-bold hover:bg-slate-200 transition-colors"
                           >
                             {lang ? lang.name : l.languageCode}
                           </Badge>
                         );
                       })}
                    </div>
                  </div>
                )}

                {hotel.website && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Website</span>
                    <a href={hotel.website.startsWith("http") ? hotel.website : `https://${hotel.website}`} target="_blank" rel="noopener noreferrer" className="block text-[13px] font-black text-slate-900 leading-tight hover:underline">
                      Visit Property
                    </a>
                  </div>
                )}

                {(hotel.checkInTime || hotel.checkOutTime) && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Check-in/out</span>
                    <p className="text-[13px] font-black text-slate-900 leading-tight">
                      {hotel.checkInTime || "14:00"} — {hotel.checkOutTime || "11:00"}
                    </p>
                  </div>
                )}

                {hotel.phone && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Contact</span>
                    <p className="text-[13px] font-black text-slate-900 leading-tight">{hotel.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rooms Section */}
            {hotel.roomTypes?.length > 0 && (
              <HotelRoomsSection hotel={hotel} />
            )}

            {/* Restaurants Section */}
            {hotel.restaurants?.length > 0 && (
              <HotelRestaurantsSection hotel={hotel} />
            )}

            {/* Amenities & Facilities */}
            {(hotel.amenities?.length > 0 || hotel.sustainability?.length > 0 || hotel.commonAreas?.length > 0) && (
              <HotelAmenitiesFacilities hotel={hotel} />
            )}

            {/* Location, POIs & Safety */}
            {((hotel.latitude && hotel.longitude) || hotel.nearbyPois?.length > 0 || hotel.safetyFeatures?.length > 0) && (
              <HotelLocationSafety hotel={hotel} />
            )}

            {/* Rules & FAQs */}
            {(hotel.checkInTime || hotel.checkOutTime || hotel.faqs?.length > 0 || hotel.paymentMethods?.length > 0) && (
              <HotelRulesFaqs hotel={hotel} />
            )}

            {/* Reviews */}
            <HotelReviewsSection hotel={hotel} />
          </div>

          {/* Sidebar Column (Hidden on mobile, sticky on desktop) */}
          <div className="hidden lg:block relative h-full">
            {hotel.roomTypes && hotel.roomTypes.length > 0 && (
              <BookingAvailabilityChecker
                hotel={hotel}
                onCheckAvailability={handleCheckAvailability}
                checkInDate={checkInDate}
                setCheckInDate={setCheckInDate}
                checkOutDate={checkOutDate}
                setCheckOutDate={setCheckOutDate}
                guests={guests}
                setGuests={setGuests}
              />
            )}
          </div>
        </div>
      </div>

      <RoomSelectionDialog
        isOpen={isRoomSelectionOpen}
        onClose={() => setIsRoomSelectionOpen(false)}
        hotel={hotel}
        bookingData={{
          checkIn: checkInDate,
          checkOut: checkOutDate,
          adults: guests.adults,
          children: guests.children,
        }}
      />

      <MobileStickyFooter hotel={hotel} onReserve={handleCheckAvailability} />
    </div>
  );
}
