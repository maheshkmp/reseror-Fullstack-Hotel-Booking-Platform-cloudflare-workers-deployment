"use client";

import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { 
  ExternalLink, 
  MapPin, 
  MapPinIcon, 
  Star, 
  Trash2,
  Tag,
  Clock
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useDeleteDestination } from "../actions/delete-action";
import type { destination } from "core/zod";
import { EditDestinationForm } from "./edit-destination-form";

type Props = {
  destination: destination;
};

export function DestinationCard({ destination }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteDestination();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    mutate(destination.id, {
      onSuccess: () => {
        toast.success("Destination deleted");
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["destinations"] });
      },
      onError: () => {
        toast.error("Failed to delete");
        setOpen(false);
      },
    });
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all hover:shadow-md border border-slate-200/60 border-l-4 border-l-emerald-600 bg-white">
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Image / Icon Area */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
              {destination.featuredImage ? (
                <img 
                  src={destination.featuredImage} 
                  alt={destination.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-emerald-600">
                  <MapPin className="h-7 w-7 opacity-40" />
                </div>
              )}
              
              <div className="absolute bottom-0 right-0 p-1">
                <Badge variant="secondary" className="h-4 px-1 text-[8px] font-bold uppercase tracking-tighter bg-emerald-100 text-emerald-700 border-none">
                  Active
                </Badge>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-black text-base text-slate-900 truncate tracking-tight uppercase group-hover:text-emerald-700 transition-colors">
                    {destination.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                    <Clock className="h-3 w-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Added {formatDistanceToNow(new Date(destination.createdAt))} ago
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <EditDestinationForm destination={destination} />
                  
                  {/* <Button variant="ghost" size="icon" asChild className="h-7 w-7 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50">
                    <Link href={`/admin/destinations/${destination.id}`}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button> */}

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setOpen(true)}
                    disabled={isPending}
                    className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Stats / Info Grid */}
              <div className="flex items-center gap-3 mt-3">
                {destination.recommended && (
                  <Badge className="h-5 px-1.5 text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 border-none animate-pulse">
                    Featured
                  </Badge>
                )}
                
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100/50">
                  <Tag className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight truncate max-w-[100px]">
                    {destination.category || "Uncategorized"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100/50">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-bold text-slate-600">
                    {destination.popularityScore || 0}
                  </span>
                </div>

                {(destination.latitude || destination.longitude) && (
                  <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100/50">
                    <MapPinIcon className="h-3 w-3 text-blue-500" />
                    <span className="text-[10px] font-mono text-slate-500">
                      {destination.latitude?.toFixed(2)}, {destination.longitude?.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-xl tracking-tight">Delete destination?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500">
              This will permanently remove <span className="font-bold text-slate-900">{destination.title}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel disabled={isPending} className="rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest h-10 px-6">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isPending}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest h-10 px-6"
            >
              {isPending ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
