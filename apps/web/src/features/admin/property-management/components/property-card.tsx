"use client";

import { formatDistanceToNow } from "date-fns";
import { 
  Building2, 
  MapPin, 
  Star, 
  MoreHorizontal, 
  ExternalLink,
  Hotel,
  Calendar,
  DollarSign,
  Layers
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: any; // We'll use any for now until we have the full type, but we know the structure
}

export function PropertyCard({ property }: PropertyCardProps) {
  const thumbnail = property.images?.[0]?.imageUrl || property.thumbnail;
  
  const statusColors = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending_approval: "bg-amber-50 text-amber-700 border-amber-200",
    inactive: "bg-slate-50 text-slate-700 border-slate-200",
    under_maintenance: "bg-rose-50 text-rose-700 border-rose-200",
    paused: "bg-orange-50 text-orange-700 border-orange-200",
    hidden: "bg-slate-50 text-slate-500 border-slate-200",
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md border-l-4 border-l-indigo-600">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Main Image Area */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted shadow-sm">
            {thumbnail ? (
              <img 
                src={thumbnail} 
                alt={property.name} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-indigo-50 text-indigo-600">
                <Hotel className="h-8 w-8 opacity-40" />
              </div>
            )}
            
            <div className="absolute bottom-0 right-0 p-1">
              <Badge 
                variant="outline" 
                className={cn(
                  "h-5 px-1.5 text-[9px] font-bold uppercase tracking-tight shadow-sm border",
                  statusColors[property.status as keyof typeof statusColors] || statusColors.inactive
                )}
              >
                {property.status?.replace("_", " ")}
              </Badge>
            </div>
          </div>
          
          {property.performance?.isOverdue && (
            <div className="absolute top-2 left-2 rotate-[-5deg] pointer-events-none">
              <Badge className="bg-red-600 hover:bg-red-700 text-white font-black text-[10px] shadow-lg border-2 border-white ring-2 ring-red-600/20 px-2 uppercase tracking-tighter">
                Overdue
              </Badge>
            </div>
          )}

          {/* Info Area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-lg text-slate-900 truncate tracking-tight">
                {property.name}
              </h3>
              
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-1 text-muted-foreground hover:bg-slate-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Property Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Building2 className="mr-2 h-4 w-4" />
                    Manage Rooms
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    Suspend Property
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-xs font-medium truncate">
                {property.city}, {property.country}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-3 w-3", 
                      i < (property.starRating || 0) ? "text-amber-400 fill-amber-400" : "text-slate-200"
                    )} 
                  />
                ))}
              </div>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-semibold bg-slate-100 text-slate-600 border-none rounded-full">
                {property.hotelType?.name || "Standard"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Extended Stats Area */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Bookings</p>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-sm font-bold text-slate-700">{property.performance?.totalBookings || 0}</span>
            </div>
          </div>
          <div className="space-y-1 border-x border-slate-100 px-2">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Revenue</p>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-sm font-bold text-slate-700">
                ${(property.performance?.totalRevenue || 0).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="space-y-1 pl-2">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Rooms</p>
            <div className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-sm font-bold text-slate-700">{property.performance?.totalRooms || 0}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-[10px] text-muted-foreground">
            Added {formatDistanceToNow(new Date(property.createdAt))} ago
          </div>
          <div className="text-[10px] font-mono text-muted-foreground/60">
            ID: {property.id.slice(0, 8)}
          </div>
        </div>
      </div>
    </Card>
  );
}
