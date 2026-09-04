"use client";

import { useFormContext } from "react-hook-form";
import {
  BedDouble,
  DollarSign,
  ShieldCheck,
  Clock,
  Info,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingSummarySidebarProps {
  roomTypeData: any;
  loadingRoomType: boolean;
}

export default function BookingSummarySidebar({
  roomTypeData,
  loadingRoomType,
}: BookingSummarySidebarProps) {
  const { watch } = useFormContext();

  const numRooms = watch("numRooms") || 1;
  const numAdults = watch("numAdults") || 2;
  const numChildren = watch("numChildren") || 0;
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");
  const basePrice = watch("totalAmount") || roomTypeData?.price || 0;
  const currency = watch("currency") || "USD";
  const promoCode = watch("promoCode");
  const discountPercent = parseFloat(String(watch("discountPercent") || "0")) || 0;

  const totalNights =
    checkInDate && checkOutDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(checkOutDate).getTime() -
              new Date(checkInDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  const subtotal = parseFloat(basePrice) * totalNights * numRooms;
  const discountAmount = discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount).toFixed(2);

  if (loadingRoomType) {
    return (
      <div className="w-full space-y-4 sticky top-8">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="space-y-3 p-6 bg-white border border-slate-200 rounded-xl">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden sticky top-8 flex flex-col items-stretch">
      {/* Visual Header */}
      <div className="h-28 relative overflow-hidden">
        {roomTypeData?.images?.[0]?.url ? (
          <img
            src={roomTypeData.images[0].url}
            alt={roomTypeData.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-50 flex items-center justify-center">
            <BedDouble className="w-8 h-8 text-slate-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-black text-sm tracking-tight leading-tight uppercase truncate">
            {roomTypeData?.name || "Room Details"}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="h-1 w-1 rounded-full bg-emerald-400" />
            <span className="text-[8px] text-white/90 font-black uppercase tracking-widest">
              Active Inventory
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Selection */}
        <div className="space-y-3">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Info size={12} className="text-blue-500" /> Selection
          </h4>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Stay Duration
              </span>
              <span className="text-[11px] font-black text-slate-900">
                {totalNights} Night(s)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Unit(s) Count
              </span>
              <span className="text-[11px] font-black text-slate-900">
                {numRooms} Unit(s)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Guest Mix
              </span>
              <span className="text-[11px] font-black text-slate-900">
                {numAdults}A {numChildren > 0 && `+ ${numChildren}C`}
              </span>
            </div>
          </div>
        </div>

        {/* Promo applied chip */}
        {promoCode && discountPercent > 0 && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
            <Tag size={12} className="text-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-emerald-800 font-mono tracking-wider block truncate">
                {promoCode}
              </span>
              <span className="text-[8px] text-emerald-600 font-bold uppercase tracking-tight">
                {discountPercent}% off applied
              </span>
            </div>
            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
          </div>
        )}

        {/* Pricing */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
              <DollarSign size={12} /> Rate/Night
            </span>
            <span className="text-[11px] font-black text-slate-900">
              ${basePrice}
            </span>
          </div>

          {discountPercent > 0 && (
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-[10px] font-bold uppercase tracking-tight flex items-center gap-1.5">
                <Tag size={12} /> Discount ({discountPercent}%)
              </span>
              <span className="text-[11px] font-black">
                -${discountAmount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-end justify-between">
            <div>
              <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest block mb-0.5">
                Final Total
              </span>
              <span className="text-[7px] text-slate-400 font-extrabold uppercase tracking-tighter">
                {discountPercent > 0 ? "Promo applied" : "Gross inclusive"}
              </span>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-0.5">
                <span className="text-[9px] font-black text-blue-600/40 uppercase mb-0.5">
                  {currency}
                </span>
                <span className="text-2xl font-black text-slate-900 tracking-tighter">
                  ${totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust markers */}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 bg-slate-50/30">
            <ShieldCheck size={14} className="text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-800 uppercase tracking-tight">
                Best Rate
              </span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter leading-none">
                Verified Quote
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 bg-slate-50/30">
            <Clock size={14} className="text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-800 uppercase tracking-tight">
                Flexible
              </span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter leading-none">
                Standard Rules
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-900 text-center">
        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">
          Protection
        </p>
        <p className="text-[9px] font-black text-white/70 uppercase tracking-tight">
          24/7 Support • Secure
        </p>
      </div>
    </div>
  );
}