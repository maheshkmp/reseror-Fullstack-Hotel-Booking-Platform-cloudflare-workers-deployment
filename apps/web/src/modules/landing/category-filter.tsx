"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  Hotel, 
  Crown, 
  Banknote, 
  Palmtree, 
  Building2, 
  Users, 
  Leaf, 
  Waves 
} from "lucide-react";

const CATEGORIES = [
  { label: "All Stays", value: "", icon: Hotel },
  { label: "Luxury", value: "luxury", icon: Crown },
  { label: "Budget", value: "budget", icon: Banknote },
  { label: "Beachfront", value: "beachfront", icon: Palmtree },
  { label: "City", value: "city", icon: Building2 },
  { label: "Family", value: "family", icon: Users },
  { label: "Boutique", value: "boutique", icon: Leaf },
  { label: "Resort", value: "resort", icon: Waves },
];

export function CategoryFilter() {
  const router = useRouter();
  const [active, setActive] = useState("");

  const handleClick = (value: string) => {
    setActive(value);
    if (value) {
      router.push(`/search?category=${value}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <section className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-16 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto relative px-4">
        {/* Scroll Masks - Desktop and Mobile indicator */}
        {/* <div className="absolute left-4 top-0 bottom-0 w-8 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none" /> */}
        <div className="absolute right-4 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none" />

        <div className="flex items-center gap-3 overflow-x-auto py-3.5 scrollbar-hide no-scrollbar scroll-smooth">
          {/* Spacer for start - ensuring buttons don't start at the very edge when scrolled */}
          <div className="flex-shrink-0 w-1" />
          
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = active === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => handleClick(cat.value)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                  whitespace-nowrap transition-all duration-200 border flex-shrink-0
                  active:scale-95
                  ${
                    isActive
                      ? "bg-blue-900 border-blue-900 text-white shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900"
                  }
                `}
              >
                {/* @ts-ignore */}
                <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-gray-400"}`} />
                {cat.label}
              </button>
            );
          })}

          {/* Spacer for end */}
          <div className="flex-shrink-0 w-4" />
        </div>
      </div>
    </section>
  );
}
