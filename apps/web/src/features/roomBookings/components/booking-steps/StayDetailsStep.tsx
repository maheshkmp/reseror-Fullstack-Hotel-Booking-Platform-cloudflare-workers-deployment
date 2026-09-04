"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Users, Bed, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface StayDetailsStepProps {
  availableRoomsCount: number;
  loadingRoomType: boolean;
}

export default function StayDetailsStep({
  availableRoomsCount,
  loadingRoomType,
}: StayDetailsStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 flex-1">
          <Label htmlFor="checkInDate" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Check-in Date
          </Label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-500 opacity-70 pointer-events-none" />
            <Input
              id="checkInDate"
              type="date"
              {...register("checkInDate")}
              className={`pl-10 h-10 rounded-lg border-slate-200 text-sm focus-visible:ring-blue-500/20 ${errors.checkInDate ? "border-red-200 bg-red-50/30" : "bg-slate-50/30 focus:bg-white"}`}
            />
          </div>
          {errors.checkInDate && (
            <p className="text-red-500 text-[9px] ml-1 font-bold">{errors.checkInDate.message as string}</p>
          )}
        </div>

        <div className="space-y-1.5 flex-1">
          <Label htmlFor="checkOutDate" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Check-out Date
          </Label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-500 opacity-70 pointer-events-none" />
            <Input
              id="checkOutDate"
              type="date"
              {...register("checkOutDate")}
              className={`pl-10 h-10 rounded-lg border-slate-200 text-sm focus-visible:ring-blue-500/20 ${errors.checkOutDate ? "border-red-200 bg-red-50/30" : "bg-slate-50/30 focus:bg-white"}`}
            />
          </div>
          {errors.checkOutDate && (
            <p className="text-red-500 text-[9px] ml-1 font-bold">{errors.checkOutDate.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="checkInTime" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Estimated Arrival
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-500 opacity-70 pointer-events-none" />
            <Input id="checkInTime" type="time" {...register("checkInTime")} className="pl-10 h-10 rounded-lg border-slate-200 text-sm bg-slate-50/30 focus:bg-white focus-visible:ring-blue-500/20" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="checkOutTime" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Expected Departure
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-500 opacity-70 pointer-events-none" />
            <Input id="checkOutTime" type="time" {...register("checkOutTime")} className="pl-10 h-10 rounded-lg border-slate-200 text-sm bg-slate-50/30 focus:bg-white focus-visible:ring-blue-500/20" />
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-4">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
          <Users size={12} className="text-blue-500" /> Selection Density
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="numRooms" className="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-center">
              Rooms
            </Label>
            <Input
              id="numRooms"
              type="number"
              min={1}
              max={availableRoomsCount || 999}
              {...register("numRooms", { valueAsNumber: true })}
              className="h-10 px-2 text-center rounded-lg border-slate-200 bg-white font-black text-base focus-visible:ring-blue-500/10"
            />
            {availableRoomsCount > 0 && (
               <p className="text-[8px] text-center text-blue-500/60 font-black uppercase tracking-tighter">Stock: {availableRoomsCount}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="numAdults" className="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-center">
              Adults
            </Label>
            <Input
              id="numAdults"
              type="number"
              min={1}
              {...register("numAdults", { valueAsNumber: true })}
              className="h-10 px-2 text-center rounded-lg border-slate-200 bg-white font-black text-base focus-visible:ring-blue-500/10"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="numChildren" className="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-center">
               Children
            </Label>
            <Input
              id="numChildren"
              type="number"
              min={0}
              {...register("numChildren", { valueAsNumber: true })}
              className="h-10 px-2 text-center rounded-lg border-slate-200 bg-white font-black text-base focus-visible:ring-blue-500/10"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
