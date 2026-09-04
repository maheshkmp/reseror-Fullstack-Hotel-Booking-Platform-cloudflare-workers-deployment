"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PaymentReviewStepProps {
  roomTypeData: any;
  isAdmin?: boolean;
  commissionRate: number;
  handleValidatePromo?: () => void;
  validatingPromo?: boolean;
  isOnlinePaymentEnabled?: boolean;
}

export default function PaymentReviewStep({
  roomTypeData,
  isAdmin = false,
  commissionRate,
  handleValidatePromo,
  validatingPromo,
  isOnlinePaymentEnabled = false,
}: PaymentReviewStepProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const [isOpen, setIsOpen] = useState(false);

  const selection = watch();
  const paymentType = watch("paymentType");
  const discountPercent = parseFloat(String(watch("discountPercent") || "0")) || 0;
  const promoCode = watch("promoCode");

  useEffect(() => {
    if (!isOnlinePaymentEnabled && paymentType !== "cash") {
      setValue("paymentType", "cash");
    }
  }, [paymentType, setValue, isOnlinePaymentEnabled]);

  const baseTotal = parseFloat(selection.totalAmount || "0") * (selection.numRooms || 1);
  const discountAmount = discountPercent > 0 ? (baseTotal * discountPercent) / 100 : 0;
  const finalTotal = Math.max(0, baseTotal - discountAmount);

  const checkInDate = selection.checkInDate
    ? format(new Date(selection.checkInDate), "MMM dd")
    : "—";
  const checkOutDate = selection.checkOutDate
    ? format(new Date(selection.checkOutDate), "MMM dd")
    : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Summary header */}
      <div className="py-2 border-b border-slate-100 flex items-baseline justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            {roomTypeData?.name || "Premium Accommodation"}
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            {checkInDate} — {checkOutDate} • {selection.numRooms} Room(s),{" "}
            {selection.numAdults} Adult(s)
          </p>
        </div>
        <div className="text-right">
          {discountPercent > 0 ? (
            <>
              <span className="text-base font-semibold text-slate-400 line-through tracking-tighter mr-2">
                ${baseTotal.toFixed(2)}
              </span>
              <span className="text-2xl font-semibold text-emerald-700 tracking-tighter">
                ${finalTotal.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-semibold text-slate-900 tracking-tighter">
              ${finalTotal.toFixed(2)}
            </span>
          )}
          <p className="text-[10px] text-slate-400 font-normal uppercase tracking-widest leading-none">
            {selection.currency || "USD"} Total
          </p>
        </div>
      </div>

      {/* Promo Code Section */}
      <div className="space-y-3">
        <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Tag size={12} className="text-blue-500" /> Promo Code
        </Label>
        <div className="flex gap-2">
          <Input
            {...register("promoCode")}
            placeholder="Enter code"
            className="h-10 text-xs font-mono tracking-wider bg-slate-50 border-slate-200 rounded-lg"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleValidatePromo}
            disabled={validatingPromo || !watch("promoCode")}
            className="h-10 px-4 rounded-lg font-bold text-[10px] uppercase tracking-wider border-slate-200 hover:bg-slate-50"
          >
            {validatingPromo ? "..." : "Apply"}
          </Button>
        </div>
        {promoCode && discountPercent > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
            <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 font-mono tracking-wider">
                  {promoCode}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase">
                  Applied
                </span>
              </div>
              <p className="text-[10px] text-emerald-600 font-normal mt-0.5">
                {discountPercent}% discount — saving ${discountAmount.toFixed(2)}
              </p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          </div>
        )}
      </div>

      {/* Payment method */}
      <div className="space-y-3">
        <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Payment Method
        </Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Card 1: Pay at Counter */}
          <div 
            onClick={() => setValue("paymentType", "cash")}
            className={cn(
              "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all",
              paymentType === "cash" 
                ? "border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500" 
                : "border-slate-200 bg-white hover:border-emerald-200"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg border shadow-sm transition-colors",
                paymentType === "cash" ? "bg-white border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-100 text-slate-400"
              )}>
                <ShieldCheck size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className={cn(
                  "font-semibold text-sm leading-tight",
                  paymentType === "cash" ? "text-slate-900" : "text-slate-600"
                )}>
                  Pay at Counter
                </span>
                <span className="text-[10px] text-emerald-600/70 font-normal uppercase tracking-wider">
                  In-person Settlement
                </span>
              </div>
            </div>
            {paymentType === "cash" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          </div>

          {/* Card 2: Online Payment (Optionally Shown) */}
          {isOnlinePaymentEnabled && (
            <div 
              onClick={() => setValue("paymentType", "online")}
              className={cn(
                "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all",
                paymentType === "online" 
                  ? "border-blue-500 bg-blue-50/30 ring-1 ring-blue-500" 
                  : "border-slate-200 bg-white hover:border-blue-200"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg border shadow-sm transition-colors",
                  paymentType === "online" ? "bg-white border-blue-100 text-blue-600" : "bg-slate-50 border-slate-100 text-slate-400"
                )}>
                  <CreditCard size={18} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className={cn(
                    "font-semibold text-sm leading-tight",
                    paymentType === "online" ? "text-slate-900" : "text-slate-600"
                  )}>
                    Pay Online
                  </span>
                  <span className="text-[10px] text-blue-600/70 font-normal uppercase tracking-wider">
                    Card Payment
                  </span>
                </div>
              </div>
              {paymentType === "online" && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
            </div>
          )}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="rounded-lg bg-slate-50 border border-slate-100 divide-y divide-slate-100 text-[11px]">
        <div className="flex justify-between px-4 py-2.5">
          <span className="text-slate-500 font-medium">
            Room × {selection.numRooms}
          </span>
          <span className="font-bold text-slate-800">${baseTotal.toFixed(2)}</span>
        </div>
        {discountPercent > 0 && (
          <div className="flex justify-between px-4 py-2.5 text-emerald-700">
            <span className="font-medium flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Promo Discount ({discountPercent}%)
            </span>
            <span className="font-bold">-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between px-4 py-3 bg-slate-100/60 rounded-b-lg">
          <span className="font-black text-slate-700 uppercase tracking-wide">
            Total Due
          </span>
          <span className="font-black text-slate-900">${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Admin financials */}
      {isAdmin && (
        <div className="grid grid-cols-3 gap-3 p-4 border border-blue-100 rounded-lg bg-blue-50/20">
          <div className="space-y-1">
            <Label className="text-[8px] uppercase font-black text-slate-400 tracking-widest text-center block">
              Base
            </Label>
            <Input
              type="text"
              {...register("totalAmount")}
              className="h-8 text-center text-xs font-black bg-white border-slate-200 rounded"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[8px] uppercase font-black text-slate-400 tracking-widest text-center block">
              Comm.
            </Label>
            <Input
              type="text"
              {...register("commissionAmount")}
              disabled
              className="h-8 text-center text-[10px] font-black bg-slate-100/50 border-none opacity-60 rounded"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[8px] uppercase font-black text-slate-400 tracking-widest text-center block">
              Net
            </Label>
            <Input
              type="text"
              {...register("netPayableToHotel")}
              disabled
              className="h-8 text-center text-[10px] font-black bg-slate-100/50 border-none opacity-60 rounded"
            />
          </div>
        </div>
      )}

      {/* Special requests */}
      <div className="space-y-2">
        <Label
          htmlFor="specialRequests"
          className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"
        >
          <FileText size={14} className="text-blue-500" /> Special Instructions
        </Label>
        <Textarea
          id="specialRequests"
          {...register("specialRequests")}
          placeholder="Allergies, floor preference, etc..."
          className="min-h-[80px] rounded-lg text-xs bg-slate-50/50 border-slate-200 focus:bg-white focus-visible:ring-blue-500/20 resize-none p-3 font-medium"
        />
      </div>

      {/* Confirmation checkbox & Detailed Agreement */}
      <div className="pt-2">
        <div className="flex flex-col gap-3 p-4 bg-white border border-slate-100 rounded-xl group hover:border-slate-200 transition-all">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("isConfirmed")}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                Review &amp; Agreement
              </span>
              <p className="text-[10px] text-slate-500 font-normal leading-relaxed uppercase tracking-tight">
                I have verified the dates, guest info, and total amount. I agree
                to the property policies and terms of service.
              </p>
            </div>
          </label>
          
          <div className="pl-7">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <button 
                  type="button"
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2 uppercase tracking-widest"
                >
                  Read Full Agreement & Policies
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 bg-slate-50 border-b border-slate-100">
                  <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600" size={24} />
                    Booking Agreement
                  </DialogTitle>
                </DialogHeader>
                
                <ScrollArea className="max-h-[60vh] p-6">
                  <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
                    <section className="space-y-2">
                      <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">1. Booking Confirmation</h4>
                      <p>By confirming this reservation, you acknowledge that the information provided (dates, guest names, contact details) is accurate. Any changes may be subject to availability and additional fees.</p>
                    </section>
                    
                    <section className="space-y-2">
                      <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">2. Cancellation Policy</h4>
                      <p>Cancellations made up to 48 hours before the check-in date are eligible for a full refund (if prepaid). Cancellations made within 48 hours of check-in may incur a penalty of one night's stay.</p>
                    </section>
                    
                    <section className="space-y-2">
                      <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">3. Property Rules</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Strictly no smoking inside the rooms.</li>
                        <li>Quiet hours are observed from 10:00 PM to 7:00 AM.</li>
                        <li>Pets are only allowed in designated areas with prior notice.</li>
                        <li>Guests are responsible for any damages caused to the property.</li>
                      </ul>
                    </section>
                    
                    <section className="space-y-2">
                      <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">4. Check-in/Check-out</h4>
                      <p>Standard check-in time is 2:00 PM (14:00) and check-out is 11:00 AM. Early check-in or late check-out requests are subject to availability and may involve extra charges.</p>
                    </section>
                    
                    <section className="space-y-2">
                      <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">5. Payment Terms</h4>
                      <p>For 'Pay at Counter' bookings, the full amount is due upon arrival. The property reserves the right to authorize credit cards provided at the time of booking for the total amount plus incidentals.</p>
                    </section>

                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 italic text-[11px] text-emerald-800">
                      By proceeding, you agree to these terms and the property's specific house rules as displayed at the premises.
                    </div>
                  </div>
                </ScrollArea>
                
                <DialogFooter className="p-4 bg-slate-50 border-t border-slate-100 flex sm:justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" className="text-xs font-bold rounded-lg px-6">Close</Button>
                  </DialogClose>
                  <Button 
                    onClick={() => {
                      setValue("isConfirmed", true);
                      setIsOpen(false);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg px-8"
                  >
                    I Agree & Accept
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {errors.isConfirmed && (
            <span className="text-[9px] text-red-500 font-semibold uppercase tracking-widest ml-7">
              {errors.isConfirmed.message as string}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
