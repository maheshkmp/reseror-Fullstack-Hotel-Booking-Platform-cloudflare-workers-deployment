"use client";

import { Edit, Building, Tag, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { HotelType } from "core/zod";

type Props = {
  hotelType: HotelType;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
};

export function HotelTypeCard({ hotelType, onEdit, onDelete }: Props) {
  return (
    <Card className="transition-all hover:shadow-md  p-3">
      <div className="flex items-center gap-3">
        {/* Avatar section */}
        <Avatar className="h-12 w-12 rounded-md shrink-0">
          {hotelType.thumbnail && (
            <AvatarImage
              src={hotelType.thumbnail}
              alt={hotelType.name || "Property Type"}
              className="object-cover"
            />
          )}
          <AvatarFallback className="rounded-md  text-purple-700 font-bold text-sm uppercase">
            {hotelType.name?.slice(0, 2) || "PT"}
          </AvatarFallback>
        </Avatar>

        {/* Main content section */}
        <div className="flex-grow min-w-0 flex flex-col justify-center">
          <h3 className="font-semibold text-sm truncate">
            {hotelType.name || "Unnamed Type"}
          </h3>

          {/* Info badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 rounded-sm px-1 py-0 h-4">
              <Building className="size-2.5" />
              Active Property Type
            </Badge>
            {hotelType.slug && (
              <Badge variant="secondary" className="text-[9px] font-normal text-muted-foreground gap-1 rounded-sm px-1 py-0 h-4">
                <Tag className="size-2.5 opacity-60" />
                {hotelType.slug}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions section */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            onClick={() => { if (hotelType.id) onEdit?.(hotelType.id); }}
          >
            <span className="sr-only">Edit Property Type</span>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8  hover:text-rose-700 hover:bg-rose-50 transition-colors"
            onClick={() => { if (hotelType.id) onDelete?.(hotelType.id); }}
          >
            <span className="sr-only">Delete Type</span>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
