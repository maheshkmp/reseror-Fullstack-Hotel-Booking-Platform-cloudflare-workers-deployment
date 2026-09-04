import { Articles } from "@/modules/landing/articles";
import { CategoryFilter } from "@/modules/landing/category-filter";
import { CtaSection } from "@/modules/landing/cta-section";
import { DownloadApp } from "@/modules/landing/download-app";
import { ExploreSriLanka } from "@/modules/landing/explore-sri-lanka";
import { FeaturedHotels } from "@/modules/landing/featured-hotels";
import { Hero } from "@/modules/landing/hero";
import { HotelTypes } from "@/modules/landing/hotel-types";
import { ListYourProperty } from "@/modules/landing/list-property";
import { NearestPlaces } from "@/modules/landing/nearest-places";
import { Newsletter } from "@/modules/landing/newsletter";
import { OffersSection } from "@/modules/landing/offers";
import { ReviewsSection } from "@/modules/landing/reviews-section";
import { TrustSection } from "@/modules/landing/trust-section";
import { FeaturedRestaurants } from "@/modules/landing/restaurants";
import { FeaturedVillas } from "@/modules/landing/villas";
import { Suspense } from "react";

// Skeleton fallback
function SectionSkeleton({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="h-8 bg-gray-200 rounded-lg animate-pulse mb-3 w-64" />
        <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-96 mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-52 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* 1. HERO — full screen, video background */}
      <Hero />

      {/* 2. CATEGORY FILTER — sticky under navbar */}
      <CategoryFilter />

      {/* 3. FEATURED HOTELS */}
      <Suspense fallback={<SectionSkeleton label="Loading featured hotels..." />}>
        <FeaturedHotels />
      </Suspense>

      {/* 4. FEATURED RESTAURANTS */}
      <Suspense fallback={<SectionSkeleton label="Loading featured restaurants..." />}>
        <FeaturedRestaurants />
      </Suspense>

      {/* 5. FEATURED VILLAS */}
      <Suspense fallback={<SectionSkeleton label="Loading featured villas..." />}>
        <FeaturedVillas />
      </Suspense>

      {/* 6. TRUST INDICATORS */}
      <TrustSection />

      {/* 7. PROPERTY TYPES CAROUSEL */}
      <Suspense fallback={<SectionSkeleton />}>
        <HotelTypes />
      </Suspense>

      {/* 8. DEALS / LIMITED OFFERS with countdown */}
      <OffersSection />

      {/* 9. REVIEWS / SOCIAL PROOF */}
      <ReviewsSection />

      {/* 10. EXPLORE SRI LANKA — destinations */}
      <ExploreSriLanka />

      {/* 11. NEAREST PLACES */}
      <NearestPlaces />

      {/* 12. LATEST ARTICLES */}
      <Suspense fallback={<SectionSkeleton />}>
        <Articles />
      </Suspense>

      {/* 13. LIST YOUR PROPERTY */}
      <ListYourProperty />

      {/* 14. FINAL CTA PUSH */}
      <CtaSection />

      {/* 15. DOWNLOAD APP */}
      <DownloadApp />

      {/* 16. NEWSLETTER */}
      <Newsletter />
    </div>
  );
}
