"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function CtaSection() {
  const router = useRouter();

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-[#1E3A5F] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-sm font-semibold rounded-full mb-5 tracking-wide">
          Start Your Journey
        </span>

        <h2
          className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Ready to book your
          <br />
          <span className="text-blue-300">next stay?</span>
        </h2>

        <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
          Thousands of verified properties. Unbeatable prices. Your perfect stay is just one search away.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/search")}
            className="inline-flex items-center gap-2 bg-[#07143d] hover:bg-[#07143d]/90 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm shadow-black/10"
          >
            <Search className="w-5 h-5" />
            Search Hotels Now
          </button>
          <button
            onClick={() => router.push("/hotels")}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200"
          >
            Browse All Properties
          </button>
        </div>

        {/* Trust micro-copy */}
        <p className="text-blue-300 text-sm mt-6">
          No hidden fees · Free cancellation on most stays · Instant confirmation
        </p>
      </div>
    </section>
  );
}
