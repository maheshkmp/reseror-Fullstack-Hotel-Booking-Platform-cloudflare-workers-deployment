"use client";

import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SaveProvider } from "@/features/hotels/context/save-context";
import { SaveBar } from "@/features/hotels/components/save-bar";
import { HotelUpdate } from "@/features/hotels/components/dashboard-components/hotel-update";
import { ManageHotelImages } from "@/features/hotels/components/dashboard-components/hotel-images";
import { ManageHotelAmenities } from "@/features/hotels/components/dashboard-components/hotel-amenities";
import { ManageHotelLanguages } from "@/features/hotels/components/dashboard-components/hotel-languages";
import { ManageHotelNearbyPOIs } from "@/features/hotels/components/dashboard-components/hotel-nearby-pois";
import { ManageHotelPolicies } from "@/features/hotels/components/dashboard-components/hotel-policies";
import { ManageHotelSafety } from "@/features/hotels/components/dashboard-components/hotel-safety";
import { ManageHotelSustainability } from "@/features/hotels/components/dashboard-components/hotel-sustainability";
import { ManageHotelTransport } from "@/features/hotels/components/dashboard-components/hotel-transport";
import { ManageHotelHouseRules } from "@/features/hotels/components/dashboard-components/hotel-house-rules";
import { ManageHotelPaymentMethods } from "@/features/hotels/components/dashboard-components/hotel-payment-methods";
import { ManageHotelFaqs } from "@/features/hotels/components/dashboard-components/hotel-faqs";
import { ManageHotelCommonAreas } from "@/features/hotels/components/dashboard-components/hotel-common-areas";

export default function AdminHotelSetupPage() {
  const params = useParams();
  const hotelId = params.id as string;

  return (
    <SaveProvider>
      <div className="flex flex-col min-h-screen bg-slate-50/10">
        <div className="border-b bg-white px-8 py-4 flex items-center justify-between sticky top-0 z-[60]">
          <Link href="/admin/hotels">
            <Button variant="ghost" size="sm" className="gap-2 font-bold uppercase tracking-widest text-[10px] text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="w-3 h-3" />
              Back to Properties
            </Button>
          </Link>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Property Setup</span>
          </div>
        </div>
        
        <main className="flex-1 overflow-y-auto p-8 pt-6 max-w-5xl mx-auto w-full">
          <div className="space-y-6 pb-32">
            <HotelUpdate hotelId={hotelId} />
            <ManageHotelImages hotelId={hotelId} />
            <ManageHotelAmenities hotelId={hotelId} />
            <ManageHotelCommonAreas hotelId={hotelId} />
            <ManageHotelHouseRules hotelId={hotelId} />
            <ManageHotelLanguages hotelId={hotelId} />
            <ManageHotelSafety hotelId={hotelId} />
            <ManageHotelSustainability hotelId={hotelId} />
            <ManageHotelTransport hotelId={hotelId} />
            <ManageHotelPaymentMethods hotelId={hotelId} />
            <ManageHotelNearbyPOIs hotelId={hotelId} />
            <ManageHotelFaqs hotelId={hotelId} />
            <ManageHotelPolicies hotelId={hotelId} />
          </div>
        </main>
        
        <SaveBar />
      </div>
    </SaveProvider>
  );
}
