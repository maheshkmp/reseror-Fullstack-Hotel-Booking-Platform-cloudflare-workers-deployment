"use client";

import { useEffect, useRef, useState } from "react";
import { useGetAds } from "../../features/admin/ad/actions/use-get-ad";
import { ExternalLink, Copy, Check, Tag, Percent, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

/* ── Countdown ── */
function Countdown({ endDate }: { endDate?: string | null }) {
  const calcTarget = () => {
    const d = endDate ? new Date(endDate) : new Date();
    d.setHours(23, 59, 59, 0);
    return d;
  };
  const getRemaining = () => {
    const diff = Math.max(0, calcTarget().getTime() - Date.now());
    const s = Math.floor(diff / 1000);
    return { h: Math.floor(s / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
  };
  const [time, setTime] = useState(getRemaining);
  useEffect(() => {
    const t = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(t);
  }, [endDate]);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-400 font-medium">Ends in</span>
      {[pad(time.h), pad(time.m), pad(time.s)].map((u, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-[#07143d] text-white text-xs font-bold px-2 py-1 rounded-md min-w-[26px] text-center tabular-nums">
            {u}
          </span>
          {i < 2 && <span className="text-gray-400 text-xs">:</span>}
        </span>
      ))}
    </div>
  );
}

/* ── Promo copy badge ── */
function PromoBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-dashed border-white/40 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all"
    >
      <Tag className="w-3 h-3 opacity-70" />
      {code}
      {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 opacity-50" />}
    </button>
  );
}

/* ── CTA href builder ── */
function buildCtaHref(offer: any): string {
  const promo = offer.promoCode?.trim();

  const withPromo = (url: string) => {
    if (!promo || !url) return url;
    const [path, fragment] = url.split("#");
    const separator = path.includes("?") ? "&" : "?";
    const newPath = `${path}${separator}promoCode=${encodeURIComponent(promo)}`;
    return fragment ? `${newPath}#${fragment}` : newPath;
  };

  // 1. Specific Room Deal
  if (offer.hotelId && offer.roomId) {
    return withPromo(`/book-room?hotelId=${offer.hotelId}&roomTypeId=${offer.roomId}`);
  }

  // 2. Hotel Deal (takes user to rooms section)
  if (offer.hotelId) {
    const slug = offer.hotel?.slug || offer.hotelSlug;
    const hotelUrl = slug ? `/hotels/${slug}` : `/hotels/${offer.hotelId}`;
    return withPromo(hotelUrl + "#rooms");
  }

  // 3. Generic Redirect (ensuring it's not the image URL)
  if (offer.redirectUrl && offer.redirectUrl.trim() !== offer.imageUrl?.trim()) {
    return withPromo(offer.redirectUrl);
  }

  // 4. Default Search
  return withPromo("/search");
}

/* ── Dummy fallback ── */
const DUMMY_OFFERS = [
  { id: "d1", title: "Summer Escape Package", description: "Beachfront stays at unbeatable prices. Book now.", imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=500&fit=crop", redirectUrl: "/search", placement: "Limited Offer", promoCode: "SUMMER40", discountPercent: 40, endDate: null },
  { id: "d2", title: "Luxury Weekend Retreat", description: "5-star properties at exclusive member rates.", imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop", redirectUrl: "/search", placement: "Weekend Deal", promoCode: null, discountPercent: 30, endDate: null },
  { id: "d4", title: "City Break Deals", description: "Premium city hotels, last-minute prices.", imageUrl: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&h=500&fit=crop", redirectUrl: "/search", placement: "Flash Sale", promoCode: null, discountPercent: 25, endDate: null },
];

/* ── Offer Card ── */
function OfferCard({ offer }: { offer: any }) {
  const ctaHref = buildCtaHref(offer);
  const discount = offer.discountPercent != null ? parseFloat(String(offer.discountPercent)) : null;

  return (
    <div className="relative flex-shrink-0 w-[85vw] sm:w-[36vw] rounded-2xl overflow-hidden shadow-md shadow-black/8 group">
      {/* Image */}
      <div className="relative h-52 sm:h-60">
        <img
          src={offer.imageUrl || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop"}
          alt={offer.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Discount badge — prominent top-right */}
        {discount != null && discount > 0 && (
          <div className="absolute top-3 right-3 flex flex-col items-center justify-center bg-emerald-500 text-white rounded-xl w-14 h-14 shadow-lg shadow-emerald-900/30">
            <span className="text-[11px] font-bold leading-none uppercase tracking-wide">Save</span>
            <span className="text-xl font-extrabold leading-tight tabular-nums">{Math.round(discount)}%</span>
          </div>
        )}

        {/* Placement tag — top-left */}
        {offer.placement && (
          <span className="absolute top-3 left-3 bg-[#07143d]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
            {offer.placement}
          </span>
        )}

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <h3 className="text-white font-bold text-lg leading-snug drop-shadow-sm">
            {offer.title}
          </h3>
          {offer.description && (
            <p className="text-white/70 text-xs leading-relaxed line-clamp-2">
              {offer.description}
            </p>
          )}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {offer.promoCode && <PromoBadge code={offer.promoCode} />}
            <Link
              href={ctaHref}
              className="ml-auto inline-flex items-center gap-1.5 bg-white text-[#07143d] text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
            >
              View Deal <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ── */
export function OffersSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data, isLoading, isError } = useGetAds({ 
    page: 1, 
    limit: 10, 
    search: "", 
    sort: "desc",
    ownerType: "all" 
  });

  const activeOffers = (data?.data || []).filter(
    (ad: any) => ad.isActive === true || ad.isActive === 1 || String(ad.isActive) === "true"
  );

  useEffect(() => {
    if (data?.data) {
      console.log("Offers Data Fetched:", data.data);
      console.log("Active Offers:", activeOffers);
    }
  }, [data]);

  const offers = activeOffers.length > 0 ? activeOffers : DUMMY_OFFERS;
  const firstOffer = offers[0];

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [offers.length]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -440 : 440, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <section className="py-10 px-4 md:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-56 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2].map((i) => (
              <div key={i} className="flex-shrink-0 w-[85vw] sm:w-[420px] h-52 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mb-5">
        <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1 block">
              Limited Time
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#07143d]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Deals &amp; Special Offers
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Countdown endDate={firstOffer?.endDate} />
            {/* Nav arrows — visible on sm+ */}
            {offers.length > 1 && (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[#07143d] hover:border-gray-300 disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[#07143d] hover:border-gray-300 disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable row */}
      <div className="relative max-w-5xl mx-auto">
        {/* Left fade */}
        <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none transition-opacity duration-200 ${canScrollLeft ? "opacity-100" : "opacity-0"}`} />
        {/* Right fade */}
        <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none transition-opacity duration-200 ${canScrollRight ? "opacity-100" : "opacity-0"}`} />

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-4 md:px-6 pb-2 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {offers.map((offer: any, i: number) => (
            <OfferCard key={offer.id || i} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  );
}