"use client";

import { useGetAdById } from "@/features/admin/ad/actions/use-get-ad-by-id";
import { useGetHotelById } from "@/features/hotels/actions/get-hotel-by-id";
import { Navbar } from "@/modules/layouts/navbar";
import { Footer } from "@/modules/layouts/footer";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Star,
  Tag,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const dealBookingSchema = z.object({
  guestName: z.string().min(2, "Full name is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestPhone: z.string().optional(),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  adults: z.coerce.number().min(1, "At least 1 adult").default(2),
  children: z.coerce.number().min(0).default(0),
  specialRequests: z.string().optional(),
  isConfirmed: z.boolean().refine((v) => v === true, {
    message: "Please confirm the details",
  }),
});

type DealBookingForm = z.infer<typeof dealBookingSchema>;

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 animate-pulse">
        <div className="h-5 bg-gray-100 rounded w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="bg-white rounded-xl border h-[480px]" />
          <div className="bg-white rounded-xl border h-[300px]" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success screen
// ---------------------------------------------------------------------------
function BookingSuccess({ deal, form }: { deal: any; form: DealBookingForm }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-16">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-white p-8 text-center border-b border-slate-100">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BadgeCheck className="w-7 h-7 text-emerald-500" />
            </div>
            <h1 className="text-xl font-black text-slate-900 mb-1">Inquiry Sent!</h1>
            <p className="text-sm text-slate-500">
              We've received your request for <span className="font-semibold text-slate-700">"{deal.title}"</span>.
              <br />A confirmation has been sent to <span className="font-semibold text-slate-700">{form.guestEmail}</span>.
            </p>
          </div>

          {/* Details */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stay Details</h2>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3 text-blue-500" /> Check-in
                  </p>
                  <p className="text-sm font-black text-slate-900">
                    {new Date(form.checkInDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-blue-500" /> Check-out
                  </p>
                  <p className="text-sm font-black text-slate-900">
                    {new Date(form.checkOutDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-200 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Adults</p>
                  <p className="text-lg font-black text-slate-900">{form.adults}</p>
                </div>
                <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-200 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Children</p>
                  <p className="text-lg font-black text-slate-900">{form.children}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest Info</h2>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#07143d] flex items-center justify-center text-white font-black text-xs shrink-0">
                    {form.guestName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase">{form.guestName}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Primary Guest</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-blue-500" /> {form.guestEmail}
                </div>
                {form.guestPhone && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-blue-500" /> {form.guestPhone}
                  </div>
                )}
              </div>
              {form.specialRequests && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-blue-500" /> Special Requests
                  </p>
                  <p className="text-xs text-slate-600 italic">"{form.specialRequests}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
            <Button onClick={() => router.push("/")} className="flex-1 bg-[#07143d] hover:bg-[#07143d]/90 text-white h-11 rounded-xl font-bold text-xs">
              Back to Home
            </Button>
            {deal.redirectUrl && (
              <a
                href={deal.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 border border-[#07143d] text-[#07143d] hover:bg-[#07143d]/5 h-11 rounded-xl font-bold text-xs transition-colors"
              >
                Visit Property Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <p className="text-center pb-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Need help? <span className="text-blue-600 underline cursor-pointer">Contact support</span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
const STEPS = [
  { label: "Your Info", desc: "Contact" },
  { label: "Stay", desc: "Dates" },
  { label: "Review", desc: "Confirm" },
];

export default function BookDealPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data: deal, isLoading, error } = useGetAdById(id);
  const hotelId = (deal as any)?.hotelId ?? null;
  const { data: hotel } = useGetHotelById(hotelId ?? "");

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<DealBookingForm | null>(null);

  const { data: session } = authClient.useSession();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<DealBookingForm>({
    resolver: zodResolver(dealBookingSchema) as any,
    mode: "onBlur",
    defaultValues: {
      adults: 2,
      children: 0,
      checkInDate: deal?.startDate ?? "",
      checkOutDate: deal?.endDate ?? "",
      isConfirmed: false,
    },
  });

  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setValue("guestName", session.user.name);
      if (session.user.email) setValue("guestEmail", session.user.email);
    }
  }, [session, setValue]);

  useEffect(() => {
    if (deal?.startDate) setValue("checkInDate", deal.startDate);
    if (deal?.endDate) setValue("checkOutDate", deal.endDate);
  }, [deal, setValue]);

  const nextStep = async () => {
    let fields: (keyof DealBookingForm)[] = [];
    if (step === 1) fields = ["guestName", "guestEmail"];
    if (step === 2) fields = ["checkInDate", "checkOutDate", "adults"];
    const ok = await trigger(fields);
    if (ok) setStep((s) => s + 1);
    else toast.error("Please fill in all required fields");
  };

  const onSubmit = async (data: DealBookingForm) => {
    setSubmitting(true);
    // Simulate an API call / inquiry submission
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmittedData(data);
    setSubmitted(true);
    toast.success("Inquiry submitted successfully!");
  };

  if (isLoading) return <PageSkeleton />;
  if (error || !deal) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-5xl mb-4">🎫</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Deal not found</h1>
            <Link href="/" className="text-sm text-[#07143d] underline underline-offset-4">Back to home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (submitted && submittedData) {
    return <BookingSuccess deal={deal} form={submittedData} />;
  }

  const hotelData = hotel as any;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      {/* Sticky back bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center">
          <Link href={`/deals/${id}`} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to deal
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

          {/* ----------------------------------------------------------------
              Main form card
          ---------------------------------------------------------------- */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden relative">

              {/* Loading overlay */}
              {submitting && (
                <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xl flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-[#07143d]" />
                    <p className="text-sm font-bold text-slate-900">Submitting Inquiry…</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Please do not refresh</p>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h1 className="text-base font-black tracking-tight text-slate-900">Book This Deal</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="px-1.5 py-0.5 bg-[#07143d]/10 text-[#07143d] text-[9px] font-black uppercase tracking-widest rounded">
                        Step {step} of {STEPS.length}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        {STEPS[step - 1].desc}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step progress bar */}
                <div className="flex items-center gap-2">
                  {STEPS.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col items-center gap-1 min-w-0">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-colors",
                          i + 1 < step ? "bg-emerald-500 text-white" : i + 1 === step ? "bg-[#07143d] text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          {i + 1 < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        <span className={cn("text-[9px] font-black uppercase tracking-widest", i + 1 === step ? "text-[#07143d]" : "text-slate-400")}>
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={cn("h-px flex-1 mb-4 transition-colors", i + 1 < step ? "bg-emerald-400" : "bg-slate-200")} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 min-h-[320px]">

                {/* ── Step 1: Guest Info ── */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="guestName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <User className="w-3 h-3 text-blue-500" /> Full Name <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="guestName"
                          {...register("guestName")}
                          placeholder="As per ID / Passport"
                          className={cn("h-10 rounded-lg text-sm", errors.guestName ? "border-red-300 bg-red-50/30" : "bg-slate-50/40 focus:bg-white")}
                        />
                        {errors.guestName && <p className="text-red-500 text-[9px] font-bold">{errors.guestName.message}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="guestEmail" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-blue-500" /> Email <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="guestEmail"
                          type="email"
                          {...register("guestEmail")}
                          placeholder="For confirmation"
                          className={cn("h-10 rounded-lg text-sm", errors.guestEmail ? "border-red-300 bg-red-50/30" : "bg-slate-50/40 focus:bg-white")}
                        />
                        {errors.guestEmail && <p className="text-red-500 text-[9px] font-bold">{errors.guestEmail.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="guestPhone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-blue-500" /> Phone (optional)
                      </Label>
                      <Input
                        id="guestPhone"
                        type="tel"
                        {...register("guestPhone")}
                        placeholder="+1 234 567 8900"
                        className="h-10 rounded-lg text-sm bg-slate-50/40 focus:bg-white"
                      />
                    </div>

                    <div className="text-[9px] text-center text-slate-500 bg-blue-50/40 p-3 rounded-lg border border-blue-100/50 leading-relaxed font-bold uppercase tracking-tight">
                      Your confirmation & voucher will be sent to the email provided.
                    </div>
                  </div>
                )}

                {/* ── Step 2: Stay Dates ── */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="checkInDate" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <CalendarDays className="w-3 h-3 text-blue-500" /> Check-in Date <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="checkInDate"
                          type="date"
                          {...register("checkInDate")}
                          className={cn("h-10 rounded-lg text-sm", errors.checkInDate ? "border-red-300 bg-red-50/30" : "bg-slate-50/40 focus:bg-white")}
                        />
                        {errors.checkInDate && <p className="text-red-500 text-[9px] font-bold">{errors.checkInDate.message}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="checkOutDate" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-blue-500" /> Check-out Date <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="checkOutDate"
                          type="date"
                          {...register("checkOutDate")}
                          className={cn("h-10 rounded-lg text-sm", errors.checkOutDate ? "border-red-300 bg-red-50/30" : "bg-slate-50/40 focus:bg-white")}
                        />
                        {errors.checkOutDate && <p className="text-red-500 text-[9px] font-bold">{errors.checkOutDate.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="adults" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Users className="w-3 h-3 text-blue-500" /> Adults <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="adults"
                          type="number"
                          min={1}
                          {...register("adults")}
                          className="h-10 rounded-lg text-sm bg-slate-50/40 focus:bg-white"
                        />
                        {errors.adults && <p className="text-red-500 text-[9px] font-bold">{errors.adults.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="children" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Users className="w-3 h-3 text-blue-500" /> Children
                        </Label>
                        <Input
                          id="children"
                          type="number"
                          min={0}
                          {...register("children")}
                          className="h-10 rounded-lg text-sm bg-slate-50/40 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="specialRequests" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3 text-blue-500" /> Special Requests (optional)
                      </Label>
                      <textarea
                        id="specialRequests"
                        {...register("specialRequests")}
                        rows={3}
                        placeholder="Dietary requirements, accessibility needs, room preferences…"
                        className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-slate-50/40 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* ── Step 3: Review & Confirm ── */}
                {step === 3 && (
                  <div className="space-y-5">
                    {/* Summary rows */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-100">
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <User className="w-3 h-3" /> Guest
                        </span>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-800">{watch("guestName")}</p>
                          <p className="text-[10px] text-slate-500">{watch("guestEmail")}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <CalendarDays className="w-3 h-3" /> Dates
                        </span>
                        <p className="text-xs font-bold text-slate-800">
                          {watch("checkInDate")} → {watch("checkOutDate")}
                        </p>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Users className="w-3 h-3" /> Guests
                        </span>
                        <p className="text-xs font-bold text-slate-800">
                          {watch("adults")} Adults{watch("children") > 0 ? `, ${watch("children")} Children` : ""}
                        </p>
                      </div>
                      {watch("guestPhone") && (
                        <div className="flex items-center justify-between px-4 py-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Phone className="w-3 h-3" /> Phone
                          </span>
                          <p className="text-xs font-bold text-slate-800">{watch("guestPhone")}</p>
                        </div>
                      )}
                      {watch("specialRequests") && (
                        <div className="flex items-start justify-between px-4 py-3 gap-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 shrink-0 mt-0.5">
                            <MessageSquare className="w-3 h-3" /> Note
                          </span>
                          <p className="text-xs text-slate-600 italic text-right">"{watch("specialRequests")}"</p>
                        </div>
                      )}
                    </div>

                    {/* Confirm checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-slate-200 hover:border-[#07143d]/30 transition-colors">
                      <input
                        type="checkbox"
                        {...register("isConfirmed")}
                        className="mt-0.5 w-4 h-4 rounded accent-[#07143d] shrink-0"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        I confirm the details above are correct and agree to be contacted regarding this deal inquiry.
                      </span>
                    </label>
                    {errors.isConfirmed && (
                      <p className="text-red-500 text-[9px] font-bold">{errors.isConfirmed.message}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="px-6 pb-5 flex items-center gap-3">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep((s) => s - 1)}
                    disabled={submitting}
                    className="rounded-lg h-10 px-6 border-slate-200 font-bold text-xs"
                  >
                    Back
                  </Button>
                )}

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 h-10 rounded-lg bg-[#07143d] hover:bg-[#07143d]/90 text-white font-bold text-xs"
                  >
                    Continue to {step === 1 ? "Stay Dates" : "Review"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitting || !watch("isConfirmed")}
                    className={cn(
                      "flex-1 h-10 rounded-lg font-bold text-xs transition-all",
                      watch("isConfirmed")
                        ? "bg-[#07143d] hover:bg-[#07143d]/90 text-white shadow-lg"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</span>
                    ) : (
                      <span className="flex items-center gap-2">Confirm Inquiry <ShieldCheck className="w-4 h-4" /></span>
                    )}
                  </Button>
                )}
              </div>

              {/* Trust footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-6">
                {[
                  { icon: <ShieldCheck className="w-3 h-3 text-blue-500" />, label: "Secure" },
                  { icon: <Lock className="w-3 h-3 text-blue-500" />, label: "Privacy" },
                  { icon: <CreditCard className="w-3 h-3 text-blue-500" />, label: "No Card Required" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {t.icon} {t.label}
                  </div>
                ))}
              </div>
            </div>
          </form>

          {/* ----------------------------------------------------------------
              Sidebar
          ---------------------------------------------------------------- */}
          <div className="sticky top-20 space-y-4">
            {/* Deal card */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {deal.imageUrl && (
                <div className="relative h-36 overflow-hidden">
                  <img src={deal.imageUrl} alt={deal.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {deal.placement && (
                    <span className="absolute bottom-3 left-3 bg-[#07143d] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {deal.placement}
                    </span>
                  )}
                </div>
              )}
              <div className="p-4 space-y-3">
                <h2 className="font-black text-slate-900 text-sm leading-tight">{deal.title}</h2>

                <div className="space-y-1.5">
                  {deal.priority && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                      <Tag className="w-3 h-3 text-[#07143d]" /> {deal.priority} priority
                    </div>
                  )}
                  {(deal.startDate || deal.endDate) && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                      <Calendar className="w-3 h-3 text-[#07143d]" />
                      {deal.startDate} → {deal.endDate ?? "Open"}
                    </div>
                  )}
                </div>

                {/* Hotel snippet */}
                {hotelData && (
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{hotelData.name}</p>
                        {hotelData.starRating > 0 && (
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {Array.from({ length: hotelData.starRating }).map((_: any, i: number) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        )}
                        {hotelData.city && (
                          <p className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                            <MapPin className="w-2.5 h-2.5" /> {hotelData.city}, {hotelData.country}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-[10px] text-blue-700 font-semibold leading-relaxed">
              This is a <strong>deal inquiry</strong>. No payment is charged now. The hotel will contact you to finalise the booking.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
