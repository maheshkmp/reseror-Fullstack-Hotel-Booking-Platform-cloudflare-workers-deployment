"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { 
  Bed, 
  Layers, 
  MapPin, 
  MessageSquare, 
  ScrollText,
  Utensils
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "rooms", label: "Rooms", icon: <Bed className="w-4 h-4" /> },
  { id: "dining", label: "Dining", icon: <Utensils className="w-4 h-4" /> },
  { id: "amenities", label: "Amenities", icon: <Layers className="w-4 h-4" /> },
  { id: "location", label: "Location", icon: <MapPin className="w-4 h-4" /> },
  { id: "rules", label: "House Rules", icon: <ScrollText className="w-4 h-4" /> },
  { id: "reviews", label: "Reviews", icon: <MessageSquare className="w-4 h-4" /> },
];

export function HotelNavigation({ hotel, onReserve }: { hotel: any; onReserve: () => void }) {
  const [activeSection, setActiveSection] = useState("rooms");

  const filteredNavItems = navItems.filter((item) => {
    switch (item.id) {
      case "rooms":
        return hotel.roomTypes?.length > 0;
      case "dining":
        return hotel.restaurants?.length > 0;
      case "amenities":
        return (
          hotel.amenities?.length > 0 ||
          hotel.sustainability?.length > 0 ||
          hotel.commonAreas?.length > 0
        );
      case "location":
        return (
          (hotel.latitude && hotel.longitude) ||
          hotel.nearbyPois?.length > 0 ||
          hotel.safetyFeatures?.length > 0
        );
      case "rules":
        return (
          hotel.checkInTime ||
          hotel.checkOutTime ||
          hotel.faqs?.length > 0 ||
          hotel.paymentMethods?.length > 0
        );
      case "reviews":
        return true; // Always show reviews section entry point
      default:
        return true;
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = filteredNavItems.map((item) =>
        document.getElementById(item.id)
      );
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        if (
          section &&
          scrollPosition >= section.offsetTop &&
          scrollPosition < section.offsetTop + section.offsetHeight
        ) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredNavItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  if (filteredNavItems.length <= 1) return null;

  return (
    <div className="sticky top-[64px] z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 -mx-6 px-6 mb-8 transition-all shadow-sm shadow-slate-200/20 group">
      <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1 min-w-max">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "relative flex items-center px-4 py-4 text-[10px] font-extrabold uppercase tracking-widest transition-all",
                activeSection === item.id
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-slate-900 rounded-t-full shadow-[0_-2px_8px_rgba(15,23,42,0.1)]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
