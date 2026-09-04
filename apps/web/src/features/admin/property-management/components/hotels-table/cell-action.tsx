"use client";

import { MoreHorizontal, Trash2, UserPenIcon, CheckCircle2, XCircle, ExternalLink, Eye, Play, Pause, BarChart3, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deleteHotel } from "@/features/admin/property-management/api/use-delete-hotels";
import { useUpdateHotelByID } from "@/features/hotels/queries/use-update-hotel-by-id";
import { HotelSelectType } from "@/features/admin/property-management/schemas";
import { UpdateHotelSheet } from "../update-hotel-sheet";

interface CellActionProps {
  data: HotelSelectType;
  hotelId?: string;
}

export const CellAction: React.FC<CellActionProps> = ({ data, hotelId = data.id }) => {
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const { mutate: updateHotel, isPending } = useUpdateHotelByID();

  const handleDelete = async () => {
    try {
      await deleteHotel(data.id);
      toast.success("Property deleted successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete property");
    }
  };

  const handleApprove = () => {
    updateHotel(
      { id: data.id, data: { status: "active" } as any },
      {
        onSuccess: () => {
          toast.success("Property approved successfully");
        },
        onError: (error) => {
          toast.error(`Failed to approve property: ${error.message}`);
        },
      }
    );
  };

  const handlePause = () => {
    updateHotel(
      { id: data.id, data: { status: "paused" } as any },
      {
        onSuccess: () => {
          toast.success("Availability paused for this property");
        },
        onError: (error) => {
          toast.error(`Failed to pause availability: ${error.message}`);
        },
      }
    );
  };

  const handleHide = () => {
    updateHotel(
      { id: data.id, data: { status: "hidden" } as any },
      {
        onSuccess: () => {
          toast.success("Property hidden from public search");
        },
        onError: (error) => {
          toast.error(`Failed to hide property: ${error.message}`);
        },
      }
    );
  };

  const handleReject = () => {
    updateHotel(
      { id: data.id, data: { status: "rejected" } as any },
      {
        onSuccess: () => {
          toast.success("Listing declined successfully");
        },
        onError: (error) => {
          toast.error(`Failed to decline listing: ${error.message}`);
        },
      }
    );
  };

  const isPendingApproval = data.status === "pending_approval";

  return (
    <>
      {/* Update Sheet */}
      <UpdateHotelSheet
        open={isUpdateOpen}
        setOpen={setUpdateOpen}
        hotelId={hotelId}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-slate-100 ring-offset-background transition-all focus-visible:ring-1 focus-visible:ring-slate-300">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-3.5 w-3.5 text-slate-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[190px] p-1 shadow-2xl border-slate-200/60 rounded-xl bg-white/95 backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-0.5 px-2 py-1.5 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600/80 leading-tight">Property Management</span>
            <span className="text-[10px] text-muted-foreground font-medium leading-tight truncate">{data.name}</span>
          </div>
          
          <DropdownMenuSeparator className="mx-1 bg-slate-100" />

          {/* View Performance */}
          <DropdownMenuItem asChild className="rounded-lg focus:bg-indigo-50 focus:text-indigo-700 transition-colors cursor-pointer group">
            <Link href={`/admin/properties/${data.id}/performance`} className="flex items-center w-full">
              <BarChart3 className="mr-2 h-3.5 w-3.5 text-indigo-500 group-hover:text-indigo-600" /> 
              <span className="text-xs font-semibold">Real-time Analytics</span>
            </Link>
          </DropdownMenuItem>

          {/* View Public Page */}
          <DropdownMenuItem asChild className="rounded-lg transition-colors cursor-pointer group">
            <Link href={`/hotels/${data.slug || data.id}`} target="_blank" className="flex items-center w-full text-slate-600 focus:text-slate-900">
              <ExternalLink className="mr-2 h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" /> 
              <span className="text-xs font-semibold">View Live Page</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="mx-1 bg-slate-100" />

          {isPendingApproval && (
            <>
              {/* Quick Approve */}
              <DropdownMenuItem onClick={handleApprove} disabled={isPending} className="rounded-lg text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer font-bold transition-all">
                <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> 
                <span className="text-xs">Go Live Now</span>
              </DropdownMenuItem>

              {/* Quick Reject */}
              <DropdownMenuItem onClick={handleReject} disabled={isPending} className="rounded-lg text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer font-bold transition-all">
                <XCircle className="mr-2 h-3.5 w-3.5" /> 
                <span className="text-xs">Decline Listing</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mx-1 bg-slate-100" />
            </>
          )}

          {!isPendingApproval && (
            <>
              {data.status === "active" ? (
                <>
                  <DropdownMenuItem onClick={handlePause} disabled={isPending} className="rounded-lg cursor-pointer text-amber-600 focus:text-amber-700 focus:bg-amber-50">
                    <Pause className="mr-2 h-3.5 w-3.5" /> 
                    <span className="text-xs font-bold">Pause Availability</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleHide} disabled={isPending} className="rounded-lg cursor-pointer text-slate-600 focus:text-slate-900 focus:bg-slate-50">
                    <XCircle className="mr-2 h-3.5 w-3.5" /> 
                    <span className="text-xs font-bold">Hide Property</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={handleApprove} disabled={isPending} className="rounded-lg cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50">
                  <Play className="mr-2 h-3.5 w-3.5" /> 
                  <span className="text-xs font-bold font-semibold">Make Active</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="mx-1 bg-slate-100" />
            </>
          )}

          {/* Update Sheet (Quick Edit) */}
          <DropdownMenuItem onClick={() => setUpdateOpen(true)} className="rounded-lg cursor-pointer text-slate-600 focus:text-slate-900 group">
            <UserPenIcon className="mr-2 h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" /> 
            <span className="text-xs font-semibold">Quick Edit</span>
          </DropdownMenuItem>

          {/* Full Setup Page */}
          <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-indigo-600 focus:text-indigo-700 focus:bg-indigo-50 group">
            <Link href={`/admin/properties/${data.id}/setup`} className="flex items-center w-full">
              <Settings className="mr-2 h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-600 transition-all duration-500" /> 
              <span className="text-xs font-bold">Full Property Setup</span>
            </Link>
          </DropdownMenuItem>

          {/* Delete Action */}
          <DropdownMenuItem onClick={handleDelete} className="rounded-lg text-rose-600 focus:bg-rose-100/50 focus:text-rose-700 cursor-pointer transition-all">
            <Trash2 className="mr-2 h-3.5 w-3.5" /> 
            <span className="text-xs font-semibold">Destroy Property</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
