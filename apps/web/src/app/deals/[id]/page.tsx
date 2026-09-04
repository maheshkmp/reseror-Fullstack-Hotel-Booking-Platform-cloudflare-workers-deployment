"use client";

import { useGetAdById } from "@/features/admin/ad/actions/use-get-ad-by-id";
import { useGetHotelById } from "@/features/hotels/actions/get-hotel-by-id";
import { Navbar } from "@/modules/layouts/navbar";
import { Footer } from "@/modules/layouts/footer";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Tag,
  Clock,
  Share2,
  MapPin,
  Star,
  Phone,
  Mail,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  BedDouble,
  Users,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3.5 h-3.5" />,
  parking: <Car className="w-3.5 h-3.5" />,
  pool: <Waves className="w-3.5 h-3.5" />,
  gym: <Dumbbell className="w-3.5 h-3.5" />,
  restaurant: <UtensilsCrossed className="w-3.5 h-3.5" />,
};

function AmenityChip({ type }: { type: string }) {
  const icon = amenityIcons[type.toLowerCase()] ?? <Tag className="w-3.5 h-3.5" />;
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#07143d]/5 text-[#07143d] text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
      {icon}
      {type.replace(/_/g, " ")}
    </span>
  );
}

function DealPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="animate-pulse">
        <div className="w-full h-[480px] bg-gray-100" />
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
          <div className="h-10 bg-gray-100 rounded w-2/3" />
          <div className="h-5 bg-gray-100 rounded w-full" />
          <div className="h-5 bg-gray-100 rounded w-5/6" />
          <div className="flex gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-7 w-24 bg-gray-100 rounded-full" />
            ))}
          </div>
          <div className="h-12 w-44 bg-gray-100 rounded-xl mt-6" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function DealDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: deal, isLoading, error } = useGetAdById(id);

  // Fetch hotel if hotelId is present on this ad
  const hotelId = (deal as any)?.hotelId ?? null;
  const { data: hotel, isLoading: hotelLoading } = useGetHotelById(hotelId ?? "");

  if (isLoading) return <DealPageSkeleton />;

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-6xl mb-5">🎫</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Deal not found</h1>
            <p className="text-gray-500 mb-8">This deal may have expired or been removed.</p>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#07143d] underline underline-offset-4">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: deal.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Hotel images sorted: thumbnail first
  const hotelImages: string[] =
    (hotel?.images as any[])
      ?.sort((a: any, b: any) => (b.isThumbnail ? 1 : 0) - (a.isThumbnail ? 1 : 0))
      ?.map((img: any) => img.imageUrl) ?? [];

  // Hero image: ad's own image → hotel thumbnail → first hotel image
  const heroImage = deal.imageUrl || hotelImages[0] || null;

  // Room types with prices
  const roomTypes: any[] = (hotel?.roomTypes as any[]) ?? [];
  const cheapestRoom = roomTypes
    .filter((rt: any) => rt.price)
    .sort((a: any, b: any) => Number(a.price) - Number(b.price))[0];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Sticky nav bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <button onClick={handleShare} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero image - full width */}
      {heroImage ? (
        <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden bg-gray-100">
          <img src={heroImage} alt={deal.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-10 pt-4">
            <div className="max-w-5xl mx-auto">
              {deal.placement && (
                <span className="inline-block bg-[#07143d] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                  {deal.placement}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                {deal.title}
              </h1>
              {cheapestRoom && (
                <p className="text-white/80 text-lg font-medium">
                  From <span className="text-white font-black text-2xl">${Number(cheapestRoom.price).toFixed(0)}</span> / night
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#07143d] py-16 px-4">
          <div className="max-w-5xl mx-auto">
            {deal.placement && (
              <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                {deal.placement}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {deal.title}
            </h1>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Deal + Hotel info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Deal description */}
            {deal.description && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-black text-[#07143d] uppercase tracking-widest mb-3">About this offer</h2>
                <p className="text-gray-700 text-base leading-relaxed border-l-4 border-[#07143d] pl-4">
                  {deal.description}
                </p>
              </div>
            )}

            {/* Hotel section */}
            {hotelId && (
              hotelLoading ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-100 rounded w-2/3" />
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ) : hotel && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-sm font-black text-[#07143d] uppercase tracking-widest mb-4">Hotel Information</h2>

                  <div className="flex items-start gap-4 mb-5">
                    {hotelImages[0] && (
                      <img src={hotelImages[0]} alt={(hotel as any).name} className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{(hotel as any).name}</h3>
                        {(hotel as any).starRating > 0 && (
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: (hotel as any).starRating }).map((_: any, i: number) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        )}
                      </div>
                      {((hotel as any).city || (hotel as any).country) && (
                        <p className="flex items-center gap-1.5 text-sm text-gray-500">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          {[(hotel as any).formattedAddress || (hotel as any).street, (hotel as any).city, (hotel as any).country].filter(Boolean).join(", ")}
                        </p>
                      )}
                      {(hotel as any).brandName && (
                        <p className="text-xs text-gray-400 mt-0.5">{(hotel as any).brandName}</p>
                      )}
                    </div>
                  </div>

                  {(hotel as any).description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">{(hotel as any).description}</p>
                  )}

                  {/* Check-in / out */}
                  {((hotel as any).checkInTime || (hotel as any).checkOutTime) && (
                    <div className="flex gap-4 mb-5">
                      {(hotel as any).checkInTime && (
                        <div className="bg-gray-50 rounded-xl px-4 py-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Check-in</p>
                          <p className="text-sm font-bold text-gray-800">{(hotel as any).checkInTime}</p>
                        </div>
                      )}
                      {(hotel as any).checkOutTime && (
                        <div className="bg-gray-50 rounded-xl px-4 py-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Check-out</p>
                          <p className="text-sm font-bold text-gray-800">{(hotel as any).checkOutTime}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Amenities */}
                  {(hotel as any).amenities?.length > 0 && (
                    <div className="mb-5">
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {(hotel as any).amenities.map((a: any) => (
                          <AmenityChip key={a.id} type={a.amenityType} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact */}
                  {((hotel as any).phone || (hotel as any).email) && (
                    <div className="flex flex-wrap gap-4 pt-5 border-t border-gray-100">
                      {(hotel as any).phone && (
                        <a href={`tel:${(hotel as any).phone}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#07143d] transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                          {(hotel as any).phone}
                        </a>
                      )}
                      {(hotel as any).email && (
                        <a href={`mailto:${(hotel as any).email}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#07143d] transition-colors">
                          <Mail className="w-3.5 h-3.5" />
                          {(hotel as any).email}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )
            )}

            {/* Room types / pricing */}
            {roomTypes.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-black text-[#07143d] uppercase tracking-widest mb-4">Available Room Types</h2>
                <div className="space-y-3">
                  {roomTypes.map((rt: any) => (
                    <div key={rt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        {rt.images?.[0] ? (
                          <img src={rt.images[0].imageUrl} alt={rt.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-[#07143d]/10 flex items-center justify-center shrink-0">
                            <BedDouble className="w-5 h-5 text-[#07143d]/40" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-gray-900">{rt.name}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            {rt.maxOccupancy && (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Users className="w-3 h-3" />
                                Up to {rt.maxOccupancy} guests
                              </span>
                            )}
                            {rt.viewType && (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Eye className="w-3 h-3" />
                                {rt.viewType.replace("_", " ")} view
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {rt.price && (
                        <div className="text-right shrink-0">
                          <p className="text-xs text-gray-400 font-medium">from</p>
                          <p className="text-lg font-black text-[#07143d]">${Number(rt.price).toFixed(0)}</p>
                          <p className="text-xs text-gray-400">/ night</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-2xl border border-gray-100 shadow-md p-6">
              <h2 className="text-sm font-black text-[#07143d] uppercase tracking-widest mb-4">Deal Summary</h2>

              {cheapestRoom && (
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-[#07143d]">${Number(cheapestRoom.price).toFixed(0)}</span>
                  <span className="text-sm text-gray-400 font-medium">/ night</span>
                </div>
              )}

              <div className="space-y-2 mb-6">
                {deal.placement && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Tag className="w-3.5 h-3.5 text-[#07143d]" />
                    <span className="font-semibold">{deal.placement}</span>
                  </div>
                )}
                {deal.priority && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-semibold capitalize">{deal.priority} priority</span>
                  </div>
                )}
                {(deal.startDate || deal.endDate) && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-[#07143d]" />
                    <span>{formatDate(deal.startDate)} → {formatDate(deal.endDate) ?? "∞"}</span>
                  </div>
                )}
                {(hotel as any)?.city && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-[#07143d]" />
                    <span>{(hotel as any).city}, {(hotel as any).country}</span>
                  </div>
                )}
              </div>

              <Link
                href={`/deals/${id}/book`}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#07143d] hover:bg-[#07143d]/90 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md text-sm"
              >
                Book This Deal
                <ExternalLink className="w-4 h-4" />
              </Link>
              <p className="text-center text-xs text-gray-400 mt-3">No commitment — just an inquiry</p>
            </div>
          </div>
        </div>

        {/* Hotel gallery strip */}
        {hotelImages.length > 1 && (
          <div className="mt-10">
            <h2 className="text-sm font-black text-[#07143d] uppercase tracking-widest mb-4">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {hotelImages.slice(0, 8).map((url: string, i: number) => (
                <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                  <img src={url} alt={`Hotel image ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
