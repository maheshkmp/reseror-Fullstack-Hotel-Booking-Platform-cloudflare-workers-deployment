"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { PublicRestaurantCard } from "@/features/resturant/components/public-restaurant-card";

interface HotelRestaurantsSectionProps {
  hotel: any;
}

export function HotelRestaurantsSection({ hotel }: HotelRestaurantsSectionProps) {
  const restaurants = hotel.restaurants || [];

  if (restaurants.length === 0) return null;

  return (
    <section id="dining" className="scroll-mt-24 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-blue-900 leading-none">
            Dining & Culinary Experiences
          </h2>
          <p className="text-[13px] text-slate-500 font-medium">
            Discover a world of flavors at our on-site restaurants
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] bg-slate-100 text-slate-600 border-none rounded-xl">
          {restaurants.length} {restaurants.length === 1 ? "Restaurant" : "Restaurants"}
        </Badge>
      </div>

      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900">Secure Chair Booking Policy</h4>
          <p className="text-[13px] text-blue-800/80 mt-1 leading-relaxed">
            To guarantee your spot and prevent no-shows, a small fully-refundable deposit is required per chair when booking. 
            <strong> Your deposit will be 100% refunded immediately upon arrival at the restaurant.</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {restaurants.map((restaurant: any) => (
          <PublicRestaurantCard 
            key={restaurant.id} 
            restaurant={restaurant} 
            className="h-full border border-slate-100 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-xl rounded-3xl"
          />
        ))}
      </div>
    </section>
  );
}
