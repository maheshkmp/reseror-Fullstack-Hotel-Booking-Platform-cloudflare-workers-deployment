"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface TagOption {
  id: string;
  label: string;
  category: "vibe" | "facility" | "policy";
}

const TAG_OPTIONS: TagOption[] = [
  // Vibe / Highlights
  { id: "Luxury", label: "Luxury", category: "vibe" },
  { id: "Budget", label: "Budget", category: "vibe" },
  { id: "Beachfront", label: "Beachfront", category: "vibe" },
  { id: "City", label: "City", category: "vibe" },
  { id: "Family", label: "Family", category: "vibe" },
  { id: "Boutique", label: "Boutique", category: "vibe" },
  { id: "Resort", label: "Resort", category: "vibe" },

  // Facilities
  { id: "free_wifi", label: "Free WiFi", category: "facility" },
  { id: "parking", label: "Parking", category: "facility" },
  { id: "swimming_pool", label: "Swimming Pool", category: "facility" },
  { id: "spa", label: "Spa", category: "facility" },
  { id: "gym", label: "Gym", category: "facility" },
  { id: "restaurant", label: "Restaurant", category: "facility" },
  { id: "bar", label: "Bar", category: "facility" },
  { id: "room_service", label: "Room Service", category: "facility" },
  { id: "air_conditioning", label: "Air Conditioning", category: "facility" },
  { id: "beach_access", label: "Beach Access", category: "facility" },
  { id: "ev_charging", label: "EV Charging", category: "facility" },
  { id: "airport_shuttle", label: "Airport Shuttle", category: "facility" },
  { id: "hot_tub", label: "Hot Tub", category: "facility" },

  // Policies
  { id: "pet_friendly", label: "Pet Friendly", category: "policy" },
  { id: "adults_only", label: "Adults Only", category: "policy" },
];

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export function TagSelector({ selectedTags, onChange, className }: TagSelectorProps) {
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((t) => t !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  const categories = [
    { id: "vibe", label: "Highlights & Vibe" },
    { id: "facility", label: "Facilities" },
    { id: "policy", label: "Policies" },
  ] as const;

  return (
    <div className={cn("space-y-6", className)}>
      {categories.map((cat) => (
        <div key={cat.id} className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70 px-1">
            {cat.label}
          </h4>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.filter((opt) => opt.category === cat.id).map((opt) => {
              const isSelected = selectedTags.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleTag(opt.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                      : "bg-white border-slate-200 text-slate-600 hover:border-primary/30 hover:bg-slate-50"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
