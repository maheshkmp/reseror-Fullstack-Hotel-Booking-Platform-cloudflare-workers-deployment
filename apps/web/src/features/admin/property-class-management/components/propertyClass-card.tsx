"use client";

import { Edit, ShieldCheck, Tag, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PropertyClass } from "core/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  propertyClass: PropertyClass;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
};

export function PropertyClassCard({ propertyClass, onEdit, onDelete }: Props) {
  return (
    <Card className="transition-all hover:shadow-md p-3">
      <div className="flex items-center gap-3">
        {/* Avatar section */}
        <Avatar className="h-12 w-12 shrink-0">
          {propertyClass.thumbnail && (
            <AvatarImage
              src={propertyClass.thumbnail}
              alt={propertyClass.name || "Property Class"}
              className="object-cover"
            />
          )}
          <AvatarFallback className="rounded-md  font-bold text-sm uppercase">
            {propertyClass.name?.slice(0, 2) || "PC"}
          </AvatarFallback>
        </Avatar>

        {/* Main content section */}
        <div className="flex-grow min-w-0 flex flex-col justify-center">
          <h3 className="font-semibold text-sm truncate">
            {propertyClass.name || "Unnamed Class"}
          </h3>
          
          {/* Info badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 rounded-sm px-1 py-0 h-4">
              <ShieldCheck className="size-2.5" />
              Active
            </Badge>
            {propertyClass.slug && (
              <Badge variant="secondary" className="text-[9px] font-normal text-muted-foreground gap-1 rounded-sm px-1 py-0 h-4">
                <Tag className="size-2.5 opacity-60" />
                {propertyClass.slug}
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
            onClick={() => { if (propertyClass.id) onEdit?.(propertyClass.id); }}
          >
            <span className="sr-only">Edit Class</span>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8  hover:text-rose-700 hover:bg-rose-50 transition-colors"
            onClick={() => { if (propertyClass.id) onDelete?.(propertyClass.id); }}
          >
            <span className="sr-only">Delete Class</span>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
