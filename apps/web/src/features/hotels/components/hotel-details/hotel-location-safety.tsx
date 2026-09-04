"use client";

import {
  Binoculars,
  MapPin,
  Navigation,
  ShieldCheck,
  Train,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

interface HotelLocationSafetyProps {
  hotel: any;
}

const getPoiIcon = (type: string) => {
  switch (type) {
    case "sight":
    case "attraction":
      return <Binoculars className="w-4 h-4 text-slate-500" />;
    case "transit":
      return <Train className="w-4 h-4 text-slate-500" />;
    case "dining":
    case "restaurant":
      return <Utensils className="w-4 h-4 text-slate-500" />;
    default:
      return <Navigation className="w-4 h-4 text-slate-500" />;
  }
};

export function HotelLocationSafety({ hotel }: HotelLocationSafetyProps) {
  const pois = hotel.nearbyPois || [];
  const safety = hotel.safetyFeatures || [];

  // Categorize POIs
  const categorizedPois = pois.reduce((acc: any, poi: any) => {
    const type = poi.type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(poi);
    return acc;
  }, {});

  const poiCategories = [
    { type: "sight", label: "Attractions", icon: <Binoculars className="w-4 h-4" /> },
    { type: "transit", label: "Transit", icon: <Train className="w-4 h-4" /> },
    { type: "dining", label: "Dining", icon: <Utensils className="w-4 h-4" /> },
    { type: "other", label: "Nearby", icon: <Navigation className="w-4 h-4" /> },
  ];

  return (
    <section id="location" className="scroll-mt-32 space-y-16">
      {/* ── Map ── */}
      {hotel.latitude && hotel.longitude && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Location & Neighborhood
              </h2>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{hotel.city}, {hotel.state}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[450px] rounded-[2.5rem] overflow-hidden border-8 border-slate-50 bg-slate-100 relative shadow-2xl shadow-slate-200/50">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${hotel.latitude},${hotel.longitude}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className=""
            />
          </div>
        </div>
      )}

      {/* ── Categorized Highlights ── */}
      {pois.length > 0 && (
        <div className="space-y-8">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              Neighborhood Highlights
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">
              Curated points of interest within reach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10">
            {poiCategories.map((cat) => {
              const items = categorizedPois[cat.type] || (cat.type === "other" ? categorizedPois["restaurant"] : []);
              if (!items || items.length === 0) return null;

              return (
                <div key={cat.type} className="space-y-6">
                  <div className="flex items-center gap-2.5 pb-2 border-b-2 border-slate-900/10">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                      {cat.label}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {items.slice(0, 4).map((poi: any, i: number) => (
                      <div key={i} className="flex justify-between items-start group cursor-default">
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-[13px] font-bold text-slate-700 truncate group-hover:text-slate-900 transition-colors">
                            {poi.name}
                          </p>
                          {poi.distanceText && (
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {poi.distanceText}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Health & Safety ── */}
      {safety.length > 0 && (
        <div className="p-8 rounded-[2rem] bg-slate-900 text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <ShieldCheck className="w-64 h-64" />
          </div>
          
          <div className="space-y-1 relative">
            <h3 className="text-xl font-bold tracking-tight text-white">
              Health & Safety Standards
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">
              Committed to your wellness and security
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {safety.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 group"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-xs font-bold text-slate-300 tracking-wide capitalize group-hover:text-white transition-colors">
                  {(item.featureType || item.name || "").replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
