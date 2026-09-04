"use client";

import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useCreateRoomBooking, type CreateRoomBookingInput } from "../hooks/create-room-booking";
import { Stepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, ShieldCheck, Lock, CreditCard, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getBrowserFingerprint } from "@/lib/utils/fingerprint";
import { useGetSettings } from "../../admin/settings/api/use-get-settings";

import RoomBookingSummary from "./room-booking-summary";
import StayDetailsStep from "./booking-steps/StayDetailsStep";
import GuestInfoStep from "./booking-steps/GuestInfoStep";
import PaymentReviewStep from "./booking-steps/PaymentReviewStep";
import BookingSummarySidebar from "./BookingSummarySidebar";

// Configuration constants to avoid hardcoding
const BOOKING_CONFIG = {
  DEFAULTS: {
    CHECK_IN_TIME: "14:00",
    CHECK_OUT_TIME: "11:00",
    CURRENCY: "USD",
    CURRENCY_SYMBOL: "$",
    NUM_ROOMS: 1,
    NUM_ADULTS: 2,
    NUM_CHILDREN: 0,
    COMMISSION_PCT: parseFloat(process.env.NEXT_PUBLIC_COMMISSION_AMOUNT || "10"),
  },
  STEPS: [
    { title: "Stay", description: "Dates" },
    { title: "Guests", description: "Details" },
    { title: "Review", description: "Payment" },
  ],
  PAYMENT_TYPES: {
    CASH: "cash",
    ONLINE: "online",
  }
};

// Define the Zod schema for validation
const roomBookingSchema = z.object({
  hotelId: z.string().min(1, "Hotel is required"),
  roomTypeId: z.string().min(1, "Room type is required"),
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email("Invalid email address").min(1, "Email is required"),
  guestPhone: z.string().optional(),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  numRooms: z.coerce.number().min(1, "Must book at least one room").default(1),
  numAdults: z.coerce.number().min(1, "At least one adult is required").default(2),
  numChildren: z.coerce.number().min(0).default(0),
  paymentType: z.enum(["cash", "online"], {
    required_error: "Please select a payment type",
    invalid_type_error: "Payment type must be either cash or online",
  }),
  totalAmount: z.string().optional(),
  commissionAmount: z.string().optional(),
  netPayableToHotel: z.string().optional(),
  currency: z.string().optional().default("USD"),
  specialRequests: z.string().optional(),
  notes: z.string().optional(),
  isPaid: z.boolean().optional(),
  paymentDetails: z.any().optional(),
  // Promo code support
  promoCode: z.string().optional(),
  discountPercent: z.coerce.number().min(0).max(100).optional().default(0),
  isConfirmed: z.boolean().refine(val => val === true, {
    message: "You must confirm the booking details",
  }),
});

type RoomBookingFormValues = z.infer<typeof roomBookingSchema>;

interface RoomBookingFormProps {
  hotelId: string;
  roomTypeId: string;
  initialStayData?: {
    checkInDate?: string;
    checkOutDate?: string;
    numAdults?: number;
    numChildren?: number;
  };
  onSuccess?: () => void;
  onClose?: () => void;
  isAdmin?: boolean;
}

export default function RoomBookingForm({
  hotelId,
  roomTypeId,
  initialStayData,
  onSuccess,
  onClose,
  isAdmin = false,
}: RoomBookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [bookingResponse, setBookingResponse] = useState<any>(null);
  const [formData, setFormData] = useState<CreateRoomBookingInput | null>(null);
  const [roomTypeData, setRoomTypeData] = useState<any>(null);
  const [loadingRoomType, setLoadingRoomType] = useState(false);
  const [availableRoomsCount, setAvailableRoomsCount] = useState<number>(0);
  const [isHotelOwnedPromo, setIsHotelOwnedPromo] = useState(false);

  // Read ?promoCode from URL on mount
  const searchParams = useSearchParams();
  const urlPromoCode = searchParams?.get("promoCode") || "";

  const steps = BOOKING_CONFIG.STEPS;

  const { data: session } = authClient.useSession();
  const { data: settings } = useGetSettings();
  const isOnlinePaymentEnabled = settings?.isOnlinePaymentEnabled || false;

  const methods = useForm<RoomBookingFormValues>({
    resolver: zodResolver(roomBookingSchema) as any,
    mode: "onBlur",
    defaultValues: {
      hotelId,
      roomTypeId,
      checkInDate: initialStayData?.checkInDate || new Date().toISOString().split('T')[0],
      checkOutDate: initialStayData?.checkOutDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      checkInTime: BOOKING_CONFIG.DEFAULTS.CHECK_IN_TIME,
      checkOutTime: BOOKING_CONFIG.DEFAULTS.CHECK_OUT_TIME,
      numRooms: BOOKING_CONFIG.DEFAULTS.NUM_ROOMS,
      numAdults: initialStayData?.numAdults || BOOKING_CONFIG.DEFAULTS.NUM_ADULTS,
      numChildren: initialStayData?.numChildren || BOOKING_CONFIG.DEFAULTS.NUM_CHILDREN,
      currency: BOOKING_CONFIG.DEFAULTS.CURRENCY,
      paymentType: BOOKING_CONFIG.PAYMENT_TYPES.CASH as any,
      promoCode: urlPromoCode || "",
      discountPercent: 0,
      isConfirmed: false,
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { isSubmitting, errors },
  } = methods;

  const paymentType = watch("paymentType");

  useEffect(() => {
    if (!isOnlinePaymentEnabled && paymentType !== BOOKING_CONFIG.PAYMENT_TYPES.CASH) {
      setValue("paymentType", BOOKING_CONFIG.PAYMENT_TYPES.CASH as any);
    }
  }, [paymentType, setValue, isOnlinePaymentEnabled]);

  // Fetch room type data when component mounts or roomTypeId changes
  useEffect(() => {
    const fetchRoomType = async () => {
      if (!roomTypeId) return;

      setLoadingRoomType(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms/types/${roomTypeId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch room type data");
        }
        const data = await response.json();
        setRoomTypeData(data);

        if (data.price) {
          setValue("totalAmount", data.price.toString());
        }

        const availableRooms =
          data.rooms?.filter((room: any) => room.status === "available") || [];
        setAvailableRoomsCount(availableRooms.length);
      } catch (err) {
        setError("Failed to load room type information");
      } finally {
        setLoadingRoomType(false);
      }
    };

    fetchRoomType();
  }, [roomTypeId, setValue]);

  // Auto-fill session data
  useEffect(() => {
    if (session?.user) {
      if (session.user.email) setValue("guestEmail", session.user.email);
      if (session.user.name) setValue("guestName", session.user.name);
    }
  }, [session, setValue]);

  // Auto-validate promo code from URL
  useEffect(() => {
    if (urlPromoCode) {
      handleValidatePromo();
    }
  }, [urlPromoCode]); // Runs once when urlPromoCode is available

  const commissionRate = BOOKING_CONFIG.DEFAULTS.COMMISSION_PCT;

  const totalAmount = watch("totalAmount");
  const numRooms = watch("numRooms");
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");

  // Recalculate financials
  useEffect(() => {
    const amount = parseFloat(totalAmount || "0");
    const rooms = numRooms || 1;
    const discountPct = watch("discountPercent") || 0;

    if (!isNaN(amount) && checkInDate && checkOutDate) {
      const stayNights = Math.max(
        1,
        Math.ceil(
          (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );
      const grossPrice = amount * rooms * stayNights;
      const discountAmt = (grossPrice * discountPct) / 100;
      const finalPrice = Math.max(0, grossPrice - discountAmt);

      // Rule: If it's a hotel-owned promo, commission is from GROSS. 
      // Else, commission is from FINAL.
      let commission = 0;
      if (isHotelOwnedPromo) {
        commission = (grossPrice * commissionRate) / 100;
      } else {
        commission = (finalPrice * commissionRate) / 100;
      }
      
      const net = finalPrice - commission;

      setValue("commissionAmount", commission.toFixed(2));
      setValue("netPayableToHotel", net.toFixed(2));
    }
  }, [totalAmount, numRooms, commissionRate, setValue, checkInDate, checkOutDate, watch("discountPercent"), isHotelOwnedPromo]);

  const mutation = useCreateRoomBooking();

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof RoomBookingFormValues)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["checkInDate", "checkOutDate", "numRooms", "numAdults"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["guestName", "guestEmail"];
    }

    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      if (currentStep === 1 && numRooms > availableRoomsCount) {
        toast.error(`Only ${availableRoomsCount} rooms available`);
        return;
      }
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Please fill/correct all required fields");
    }
  };

  const handleBackStep = () => setCurrentStep((prev) => prev - 1);

  const [validatingPromo, setValidatingPromo] = useState(false);

  const handleValidatePromo = async () => {
    const code = watch("promoCode");
    if (!code) return;

    setValidatingPromo(true);
    const fingerprint = getBrowserFingerprint();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/affiliate/validate/${code}?fingerprint=${fingerprint}&hotelId=${hotelId}`);
      const result = await response.json();
      
      if (response.ok && result.valid) {
        const minVal = parseFloat(result.minBookingValue || "0");
        const currentTotal = parseFloat(watch("totalAmount") || "0");
        
        if (currentTotal < minVal) {
          setValue("discountPercent", 0);
          setIsHotelOwnedPromo(false);
          toast.error(`Minimum booking value of $${minVal} required for this code`);
          return;
        }

        setValue("discountPercent", parseFloat(result.discountRate));
        setIsHotelOwnedPromo(!!result.isHotelPromo);
        toast.success(`Promo code applied! ${result.discountRate}% discount.`);
      } else {
        setValue("discountPercent", 0);
        setIsHotelOwnedPromo(false);
        toast.error(result.message || "Invalid promo code");
      }
    } catch (err) {
      toast.error("Failed to validate promo code");
    } finally {
      setValidatingPromo(false);
    }
  };

  const onSubmit = async (data: RoomBookingFormValues) => {
    setError(null);

    if (data.numRooms > availableRoomsCount) {
      setError(`Only ${availableRoomsCount} rooms available.`);
      return;
    }

    try {
      const baseAmount = parseFloat(data.totalAmount || "0");
      const unitCount = data.numRooms || 1;
      const stayNights = data.checkInDate && data.checkOutDate
        ? Math.max(1, Math.ceil((new Date(data.checkOutDate).getTime() - new Date(data.checkInDate).getTime()) / (1000 * 60 * 60 * 24)))
        : 1;
      
      const subtotal = baseAmount * unitCount * stayNights;
      const discountPct = data.discountPercent || 0;
      const discountAmt = discountPct > 0 ? (subtotal * discountPct) / 100 : 0;
      const finalTotal = Math.max(0, subtotal - discountAmt);

      // Final recalculation of commission and net to match finalTotal
      const finalCommission = (finalTotal * commissionRate) / 100;
      const finalNet = finalTotal - finalCommission;

      const transformedData: CreateRoomBookingInput = {
        hotelId: data.hotelId,
        roomTypeId: data.roomTypeId,
        guestName: data.guestName,
        guestEmail: data.guestEmail || null,
        guestPhone: data.guestPhone || null,
        checkInDate: data.checkInDate || null,
        checkInTime: data.checkInTime || null,
        checkOutDate: data.checkOutDate || null,
        checkOutTime: data.checkOutTime || null,
        numRooms: data.numRooms || 1,
        numAdults: data.numAdults || 1,
        numChildren: data.numChildren || 0,
        totalAmount: subtotal.toFixed(2), // SEND GROSS AMOUNT TO SERVER
        commissionAmount: (watch("commissionAmount") as any)?.toString() || "0.00",
        netPayableToHotel: (watch("netPayableToHotel") as any)?.toString() || "0.00",
        currency: data.currency || BOOKING_CONFIG.DEFAULTS.CURRENCY,
        paymentType: data.paymentType || BOOKING_CONFIG.PAYMENT_TYPES.CASH,
        specialRequests: data.specialRequests || null,
        notes: data.notes || null,
        isPaid: data.isPaid || false,
        status: "pending",
        paymentDetails: {
          ...(data.paymentDetails || {}),
        },
        promoCode: data.promoCode || null,
        discountAmount: discountAmt.toFixed(2),
        browserFingerprint: getBrowserFingerprint(),
        rooms: null,
      };

      const response = await mutation.mutateAsync(transformedData);
      setBookingResponse(response);
      setFormData(transformedData);

      reset();
      toast.success("Booking confirmed!");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create booking");
      toast.error(err.message || "Booking failed");
    }
  };

  if (bookingResponse && formData) {
    return (
      <RoomBookingSummary
        bookingId={bookingResponse.id}
        bookingData={{
          ...formData,
          id: bookingResponse.id,
          ...bookingResponse,
        }}
      />
    );
  }

  const isProcessing = isSubmitting || mutation.isPending;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-1">
      <FormProvider {...methods}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* Main Booking Form */}
          <div className="relative bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
            {/* UI Freeze / Loading Overlay */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4"
                >
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xl flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    <p className="text-sm font-bold text-slate-900">Processing Booking...</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Please do not refresh</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header - More compact */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">Complete Reservation</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded border border-blue-100">
                      Step {currentStep} of 3
                    </div>
                    {currentStep === 1 && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Stay Details</span>}
                    {currentStep === 2 && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Guest Information</span>}
                    {currentStep === 3 && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Payment & Review</span>}
                  </div>
                </div>
                {onClose && (
                  <Button variant="ghost" size="sm" onClick={onClose} className="rounded-lg h-8 w-8 p-0 text-slate-400 hover:text-slate-900">
                    <ArrowLeft size={16} />
                  </Button>
                )}
              </div>
              
              <div className="max-w-md mx-auto">
                <Stepper steps={steps} currentStep={currentStep} className="py-1" />
              </div>
            </div>

            {/* Content Body - Compact padding */}
            <div className="p-4 flex-1">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  <div className="min-h-[280px]">
                    {currentStep === 1 && (
                      <StayDetailsStep 
                        key="stay"
                        availableRoomsCount={availableRoomsCount}
                        loadingRoomType={loadingRoomType}
                      />
                    )}
                    {currentStep === 2 && (
                      <GuestInfoStep key="guest" />
                    )}
                    {currentStep === 3 && (
                      <PaymentReviewStep 
                        key="payment"
                        roomTypeData={roomTypeData}
                        isAdmin={isAdmin}
                        commissionRate={commissionRate}
                        handleValidatePromo={handleValidatePromo}
                        validatingPromo={validatingPromo}
                        isOnlinePaymentEnabled={isOnlinePaymentEnabled}
                      />
                    )}
                  </div>
                </AnimatePresence>

                {/* Inline Error Handling */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-6 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[11px] font-bold flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Compact Action Buttons - Focused Blue theme */}
                <div className="mt-8 flex items-center gap-3">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBackStep}
                      disabled={isProcessing}
                      className="rounded-lg h-10 px-6 border-slate-200 hover:bg-slate-50 font-bold text-xs"
                    >
                      Back
                    </Button>
                  )}

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      disabled={loadingRoomType || isProcessing}
                      className="flex-1 rounded-lg h-10 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs group transition-all"
                    >
                      Continue to {currentStep === 1 ? "Guest Info" : "Payment"}
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isProcessing || availableRoomsCount === 0 || !watch("isConfirmed")}
                      className={cn(
                        "flex-1 rounded-lg h-10 font-bold text-xs transition-all shadow-lg",
                        watch("isConfirmed") 
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20" 
                          : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      )}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Finalizing...
                        </div>
                      ) : (
                        <span className="flex items-center justify-center gap-2 uppercase tracking-wide">
                          Confirm Reservation <ShieldCheck size={16} />
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Compact Footer Trust Elements */}
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-6">
              <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck size={12} className="text-blue-500" /> Secure
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Lock size={12} className="text-blue-500" /> Privacy
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <CreditCard size={12} className="text-blue-500" /> Instant
              </div>
            </div>
          </div>

          {/* Compact Sidebar Information Panel */}
          <BookingSummarySidebar 
            roomTypeData={roomTypeData} 
            loadingRoomType={loadingRoomType} 
          />
        </div>
      </FormProvider>
    </div>
  );
}
