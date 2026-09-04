"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Tag, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useValidatePromo } from "../../actions/use-validate-promo";

export default function GuestInfoStep() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const [promoInput, setPromoInput] = useState<string>(
    watch("promoCode") || ""
  );
  const [debouncedPromo, setDebouncedPromo] = useState(promoInput);

  // Debounce promo input 600ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedPromo(promoInput.trim().toUpperCase()), 600);
    return () => clearTimeout(t);
  }, [promoInput]);

  const { data: promoAd, isLoading: promoLoading } = useValidatePromo(
    debouncedPromo || undefined
  );

  // Sync validated discount back to form
  useEffect(() => {
    if (promoAd) {
      setValue("promoCode", promoAd.promoCode);
      setValue(
        "discountPercent",
        promoAd.discountPercent != null
          ? parseFloat(String(promoAd.discountPercent))
          : 0
      );
    } else if (debouncedPromo && !promoLoading) {
      // invalid / expired
      setValue("promoCode", "");
      setValue("discountPercent", 0);
    }
  }, [promoAd, debouncedPromo, promoLoading, setValue]);

  const promoStatus =
    !debouncedPromo
      ? "idle"
      : promoLoading
      ? "loading"
      : promoAd
      ? "valid"
      : "invalid";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4">
        {/* Guest Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="guestName"
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"
          >
            <User className="w-3 h-3 text-blue-500" /> Primary Guest Name
          </Label>
          <Input
            id="guestName"
            type="text"
            {...register("guestName")}
            className={cn(
              "h-10 rounded-lg border-slate-200 text-sm focus-visible:ring-blue-500/20",
              errors.guestName
                ? "border-red-200 bg-red-50/30"
                : "bg-slate-50/30 focus:bg-white"
            )}
            placeholder="Matching ID card or Passport"
          />
          {errors.guestName && (
            <p className="text-red-500 text-[9px] ml-1 font-bold">
              {errors.guestName.message as string}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="guestEmail"
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"
          >
            <Mail className="w-3 h-3 text-blue-500" /> Email Address
          </Label>
          <Input
            id="guestEmail"
            type="email"
            {...register("guestEmail")}
            className={cn(
              "h-10 rounded-lg border-slate-200 text-sm focus-visible:ring-blue-500/20",
              errors.guestEmail
                ? "border-red-200 bg-red-50/30"
                : "bg-slate-50/30 focus:bg-white"
            )}
            placeholder="For digital confirmation"
          />
          {errors.guestEmail && (
            <p className="text-red-500 text-[9px] ml-1 font-bold">
              {errors.guestEmail.message as string}
            </p>
          )}
        </div>

        {/* Phone (optional) */}
        <div className="space-y-1.5">
          <Label
            htmlFor="guestPhone"
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"
          >
            <Phone className="w-3 h-3 text-blue-500" /> Phone
            <span className="text-slate-300 font-normal normal-case tracking-normal text-[9px]">optional</span>
          </Label>
          <Input
            id="guestPhone"
            type="tel"
            {...register("guestPhone")}
            className="h-10 rounded-lg border-slate-200 text-sm bg-slate-50/30 focus:bg-white focus-visible:ring-blue-500/20"
            placeholder="+1 555 000 0000"
          />
        </div>

        {/* Promo Code */}
        <div className="space-y-1.5">
          <Label
            htmlFor="promoCodeInput"
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"
          >
            <Tag className="w-3 h-3 text-emerald-500" /> Promo Code
            <span className="text-slate-300 font-normal normal-case tracking-normal text-[9px]">optional</span>
          </Label>
          <div className="relative">
            <Input
              id="promoCodeInput"
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              className={cn(
                "h-10 rounded-lg border-slate-200 text-sm font-mono tracking-wider pr-10 focus-visible:ring-blue-500/20",
                promoStatus === "valid" && "border-emerald-300 bg-emerald-50/30",
                promoStatus === "invalid" && "border-red-200 bg-red-50/20",
                promoStatus === "idle" && "bg-slate-50/30 focus:bg-white"
              )}
              placeholder="e.g. SUMMER40"
              maxLength={50}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {promoStatus === "loading" && (
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              )}
              {promoStatus === "valid" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
              {promoStatus === "invalid" && (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
            </span>
          </div>

          {promoStatus === "valid" && promoAd && (
            <p className="text-[10px] text-emerald-600 font-bold ml-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {promoAd.discountPercent
                ? `${parseFloat(String(promoAd.discountPercent))}% discount applied!`
                : "Promo code accepted"}
            </p>
          )}
          {promoStatus === "invalid" && (
            <p className="text-[10px] text-red-500 font-bold ml-1">
              Code not found or expired.
            </p>
          )}
        </div>
      </div>

      <div className="text-[9px] text-center text-slate-500 bg-blue-50/30 p-3 rounded-lg border border-blue-100/50 leading-relaxed font-bold uppercase tracking-tight">
        Voucher and arrival instructions will be sent to the email provided.
      </div>
    </motion.div>
  );
}
