"use client";

import { amenitiesList } from "@/lib/helpers/amenities-map";
import {
  FaBaby,
  FaBan,
  FaBath,
  FaBicycle,
  FaBreadSlice,
  FaBriefcase,
  FaBroom,
  FaCar,
  FaChargingStation,
  FaClock,
  FaCocktail,
  FaCoffee,
  FaConciergeBell,
  FaDumbbell,
  FaGamepad,
  FaGlassMartini,
  FaHotTub,
  FaLock,
  FaParking,
  FaPaw,
  FaShieldAlt,
  FaShuttleVan,
  FaSmoking,
  FaSnowflake,
  FaSortUp,
  FaSpa,
  FaSwimmingPool,
  FaTshirt,
  FaTv,
  FaTree,
  FaUmbrellaBeach,
  FaUsers,
  FaUtensils,
  FaWheelchair,
  FaWifi,
  FaFire,
  FaBolt,
} from "react-icons/fa";
import { LayoutGrid, Leaf, Sofa } from "lucide-react";
import React from "react";
import { IconType } from "react-icons/lib";

interface HotelAmenitiesFacilitiesProps {
  hotel: any;
}

// Keyword-based fallback map — covers common substrings for any DB value
const keywordIconMap: Array<{ keywords: string[]; icon: IconType }> = [
  { keywords: ["wifi", "internet", "wireless"], icon: FaWifi },
  { keywords: ["pool", "swim"], icon: FaSwimmingPool },
  { keywords: ["gym", "fitness", "workout", "exercise"], icon: FaDumbbell },
  { keywords: ["spa", "wellness", "massage", "sauna"], icon: FaSpa },
  { keywords: ["restaurant", "dining", "dine"], icon: FaUtensils },
  { keywords: ["bar", "cocktail", "lounge"], icon: FaCocktail },
  { keywords: ["breakfast", "brunch"], icon: FaBreadSlice },
  { keywords: ["coffee", "cafe", "tea"], icon: FaCoffee },
  { keywords: ["mini bar", "minibar"], icon: FaGlassMartini },
  { keywords: ["parking", "park", "garage"], icon: FaParking },
  { keywords: ["ev charging", "charging station", "electric"], icon: FaChargingStation },
  { keywords: ["car hire", "car rental", "rent a car"], icon: FaCar },
  { keywords: ["bicycle", "bike", "cycling"], icon: FaBicycle },
  { keywords: ["shuttle", "airport", "transfer"], icon: FaShuttleVan },
  { keywords: ["air conditioning", "air con", " ac ", "hvac", "cooled"], icon: FaSnowflake },
  { keywords: ["heating", "heated", "warm"], icon: FaFire },
  { keywords: ["elevator", "lift"], icon: FaSortUp },
  { keywords: ["non-smoking", "non smoking", "no smoking"], icon: FaBan },
  { keywords: ["safe", "locker", "vault"], icon: FaLock },
  { keywords: ["accessible", "wheelchair", "disability"], icon: FaWheelchair },
  { keywords: ["security", "guard", "cctv"], icon: FaShieldAlt },
  { keywords: ["generator", "backup power"], icon: FaBolt },
  { keywords: ["hot tub", "jacuzzi", "bath", "bathtub"], icon: FaHotTub },
  { keywords: ["beach", "beachfront", "sea view"], icon: FaUmbrellaBeach },
  { keywords: ["garden", "outdoor", "terrace"], icon: FaTree },
  { keywords: ["24-hour", "24 hour", "front desk", "reception", "concierge"], icon: FaClock },
  { keywords: ["room service"], icon: FaConciergeBell },
  { keywords: ["concierge"], icon: FaConciergeBell },
  { keywords: ["laundry", "wash", "dry clean"], icon: FaTshirt },
  { keywords: ["housekeeping", "cleaning", "maid"], icon: FaBroom },
  { keywords: ["business", "conference", "meeting room", "co-work"], icon: FaBriefcase },
  { keywords: ["family", "family room"], icon: FaUsers },
  { keywords: ["babysit", "baby", "childcare", "children"], icon: FaBaby },
  { keywords: ["kids", "game", "play"], icon: FaGamepad },
  { keywords: ["tv", "television", "flat screen", "flat-screen"], icon: FaTv },
  { keywords: ["pet", "dog", "cat", "animal"], icon: FaPaw },
  { keywords: ["smoking", "smoke"], icon: FaSmoking },
];

function getAmenityIcon(rawValue: string): IconType | null {
  const val = rawValue.toLowerCase().trim();

  // Stage 1: exact name match against master list
  const exactMatch = amenitiesList.find((a) => a.name.toLowerCase() === val);
  if (exactMatch) return exactMatch.icon;

  // Stage 2: keyword substring match
  for (const entry of keywordIconMap) {
    if (entry.keywords.some((kw) => val.includes(kw))) {
      return entry.icon;
    }
  }

  return null;
}

const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div>
    <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
    {subtitle && (
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
        {subtitle}
      </p>
    )}
  </div>
);

export function HotelAmenitiesFacilities({ hotel }: HotelAmenitiesFacilitiesProps) {
  const amenities = hotel.amenities || [];
  const sustainability = hotel.sustainability || [];
  const commonAreas = hotel.commonAreas || [];

  return (
    <section id="amenities" className="scroll-mt-24 space-y-10">

      {/* ── Property Amenities ── */}
      {amenities.length > 0 && (
        <div className="space-y-5">
          <SectionHeader
            icon={<LayoutGrid className="w-4 h-4 text-slate-600" />}
            title="Property Amenities"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {amenities.map((amenity: any, index: number) => {
              const amenityType: string = amenity.amenityType || amenity.name || "";
              const IconComponent = getAmenityIcon(amenityType);

              return (
                <div
                  key={index}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl border border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all group"
                >
                  <div className="shrink-0 text-slate-400 group-hover:text-slate-900 transition-colors">
                    {IconComponent ? (
                      <IconComponent size={15} />
                    ) : (
                      <LayoutGrid className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-tight group-hover:text-slate-900 transition-colors">
                    {amenityType}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Sustainability & Eco ── */}
      {sustainability.length > 0 && (
        <div className="space-y-5">
          <SectionHeader
            icon={<Leaf className="w-4 h-4 text-slate-600" />}
            title="Sustainability & Green Initiatives"
            subtitle="Committed to eco-responsible hospitality"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sustainability.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-slate-900 shrink-0" />
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                  {item.initiativeType || item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Common Areas ── */}
      {commonAreas.length > 0 && (
        <div className="space-y-5">
          <SectionHeader
            icon={<Sofa className="w-4 h-4 text-slate-600" />}
            title="Shared Spaces & Common Areas"
            subtitle="Elegant social zones for rest and interaction"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {commonAreas.map((area: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl border border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-tight">
                  {area.areaType || area.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
