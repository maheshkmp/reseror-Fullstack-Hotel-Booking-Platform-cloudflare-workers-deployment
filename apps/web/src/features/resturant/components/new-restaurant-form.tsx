"use client";
 

import { useGetMyHotel } from "@/features/hotels/api/use-get-my-hotel";
import { authClient } from "@/lib/auth-client";
import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BuildingIcon,
  CheckCircle2Icon,
  ClockIcon,
  GlobeIcon,
  InfoIcon,
  CheckIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PlusCircleIcon,
  StarIcon,
  UtensilsIcon,
  ImageIcon,
  TrashIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAddRestaurantImage } from "../actions/use-add-restaurant-images";
import { useCreateRestaurant } from "../actions/use-create-restaurant";

// ─── Types ───────────────────────────────────────────────────────────────────

type FormState = {
  hotelId: string;
  createdBy: string;
  organizationId: string;
  name: string;
  description: string;
  brandName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  phone: string;
  email: string;
  website: string;
  buffetMetadata: string;
  starRating: string;
  checkInTime: string;
  checkOutTime: string;
  totalSeats: string;
  allocatedSeats: string;
  breakfastPrice: string;
  lunchPrice: string;
  dinnerPrice: string;
  buffetPrice: string;
  pricePerSeat: string;
  cuisineType: string;
  dressCode: string;
  menuUrl: string;
  customPrices: { label: string; price: number }[];
  images: { url: string; altText: string }[];
  status: "active" | "inactive" | "under_maintenance" | "pending_approval";
};

type FieldError = Partial<Record<keyof FormState, string>>;

const defaultForm: FormState = {
  hotelId: "",
  createdBy: "",
  organizationId: "",
  name: "",
  description: "",
  brandName: "",
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  phone: "",
  email: "",
  website: "",
  buffetMetadata: "",
  starRating: "",
  checkInTime: "",
  checkOutTime: "",
  totalSeats: "",
  allocatedSeats: "",
  breakfastPrice: "",
  lunchPrice: "",
  dinnerPrice: "",
  buffetPrice: "",
  pricePerSeat: "",
  cuisineType: "",
  dressCode: "",
  menuUrl: "",
  customPrices: [],
  images: [],
  status: "active",
};

// ─── Steps Config ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 1,
    title: "Basic Info",
    subtitle: "Name & identity",
    icon: UtensilsIcon,
    color: "from-blue-500 to-indigo-600",
    lightColor: "from-blue-50 to-indigo-50",
    ring: "ring-blue-400",
    text: "text-blue-700",
    bg: "bg-blue-600",
    border: "border-blue-200",
    focusRing: "focus:ring-blue-400",
  },
  {
    id: 2,
    title: "Location",
    subtitle: "Where to find you",
    icon: MapPinIcon,
    color: "from-blue-500 to-indigo-600",
    lightColor: "from-blue-50 to-indigo-50",
    ring: "ring-blue-400",
    text: "text-blue-700",
    bg: "bg-blue-600",
    border: "border-blue-200",
    focusRing: "focus:ring-blue-400",
  },
  {
    id: 3,
    title: "Details",
    subtitle: "Contact & hours",
    icon: ClockIcon,
    color: "from-blue-500 to-indigo-600",
    lightColor: "from-blue-50 to-indigo-50",
    ring: "ring-blue-400",
    text: "text-blue-700",
    bg: "bg-blue-600",
    border: "border-blue-200",
    focusRing: "focus:ring-blue-400",
  },
  {
    id: 4,
    title: "Dining",
    subtitle: "Prices & Seats",
    icon: UtensilsIcon,
    color: "from-blue-500 to-indigo-600",
    lightColor: "from-blue-50 to-indigo-50",
    ring: "ring-blue-400",
    text: "text-blue-700",
    bg: "bg-blue-600",
    border: "border-blue-200",
    focusRing: "focus:ring-blue-400",
  },
  {
    id: 5,
    title: "Gallery",
    subtitle: "Photos",
    icon: ImageIcon,
    color: "from-blue-500 to-indigo-600",
    lightColor: "from-blue-50 to-indigo-50",
    ring: "ring-blue-400",
    text: "text-blue-700",
    bg: "bg-blue-600",
    border: "border-blue-200",
    focusRing: "focus:ring-blue-400",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
function isValidPhone(phone: string) {
  return /^[+\d\s\-().]{7,20}$/.test(phone);
}

function validateStep(step: number, form: FormState): FieldError {
  const errors: FieldError = {};
  if (step === 1) {
    if (!form.name.trim()) errors.name = "Restaurant name is required.";
  }
  if (step === 3) {
    if (form.email && !isValidEmail(form.email))
      errors.email = "Enter a valid email address.";
    if (form.phone && !isValidPhone(form.phone))
      errors.phone = "Enter a valid phone number.";
    if (form.starRating) {
      const n = Number(form.starRating);
      if (isNaN(n) || n < 1 || n > 5)
        errors.starRating = "Star rating must be between 1 and 5.";
    }
    if (form.checkInTime && form.checkOutTime) {
      if (form.checkInTime === form.checkOutTime)
        errors.checkOutTime =
          "Opening and closing time cannot be the same.";
    }
  }
  return errors;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SmartField({
  label,
  hint,
  conflict,
  required,
  autoFilled,
  children,
}: {
  label: string;
  hint?: string;
  conflict?: string;
  required?: boolean;
  autoFilled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 transition-all duration-300">
      <div className="flex items-center justify-between gap-1">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          {label}
          {required && <span className="text-red-500">*</span>}
          {autoFilled && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-50 text-slate-600 border border-slate-200 uppercase tracking-tighter">
              Prefilled
            </span>
          )}
        </label>
        {hint && (
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{hint}</span>
        )}
      </div>
      <div className="relative group">
        {children}
      </div>
      {conflict && (
        <div className="flex items-start gap-1.5 mt-1 p-2 rounded-lg bg-slate-50 border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none absolute z-10 w-full top-full">
          <InfoIcon className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-slate-600 leading-snug font-medium">{conflict}</p>
        </div>
      )}
    </div>
  );
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <AlertCircleIcon className="w-3 h-3" /> {error}
    </p>
  );
}

function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const StepIcon = step.icon;
        const isActive = current === step.id;
        const isDone = current > step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "scale-105" : ""
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isDone
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? `bg-gradient-to-br ${step.color} border-transparent text-white shadow-md`
                    : "bg-gray-100 border-gray-200 text-gray-400"
                )}
              >
                {isDone ? (
                  <CheckCircle2Icon className="w-3 h-3" />
                ) : (
                  <StepIcon className="w-3 h-3" />
                )}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    isActive ? step.text : isDone ? "text-green-600" : "text-gray-400"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-[8px] text-gray-400 hidden sm:block">
                  {step.subtitle}
                </p>
              </div>
            </div>
            {idx < total - 1 && (
              <div
                className={cn(
                  "h-0.5 w-12 sm:w-16 mx-1 mb-6 rounded-full transition-all duration-500",
                  isDone ? "bg-green-400" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Components ──────────────────────────────────────────────────────────

type Props = { onSuccess?: () => void };

export function CreateRestaurantForm({ onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<FieldError>({});
  const [emailAutoFilled, setEmailAutoFilled] = useState(false);
  const [brandAutoFilled, setBrandAutoFilled] = useState(false);
  const [locationAutoFilled, setLocationAutoFilled] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

  const { mutate, isPending } = useCreateRestaurant();
  const { mutate: addImage } = useAddRestaurantImage();
  const { data: hotelData } = useGetMyHotel();
  const { data: session } = authClient.useSession();

  // Smart auto-fill from session/hotel
  useEffect(() => {
    if (!hotelData && !session) return;

    setForm((prev) => {
      const nextEmail = !prev.email && session?.user?.email ? session.user.email : prev.email;
      
      // Auto-fill address and brand from hotel if not already set
      const nextBrandName = !prev.brandName && hotelData?.brandName ? hotelData.brandName : prev.brandName;
      const nextStreet = !prev.street && hotelData?.street ? hotelData.street : prev.street;
      const nextCity = !prev.city && hotelData?.city ? hotelData.city : prev.city;
      const nextState = !prev.state && hotelData?.state ? hotelData.state : prev.state;
      const nextCountry = !prev.country && hotelData?.country ? hotelData.country : prev.country;
      const nextPostalCode = !prev.postalCode && hotelData?.postalCode ? hotelData.postalCode : prev.postalCode;
      const nextLat = !prev.latitude && hotelData?.latitude ? hotelData.latitude : prev.latitude;
      const nextLng = !prev.longitude && hotelData?.longitude ? hotelData.longitude : prev.longitude;

      if (nextEmail !== prev.email) setEmailAutoFilled(true);
      if (nextBrandName && nextBrandName !== prev.brandName) setBrandAutoFilled(true);
      if (nextStreet && nextStreet !== prev.street) setLocationAutoFilled(true);

      return {
        ...prev,
        hotelId: hotelData?.id || prev.hotelId,
        createdBy: session?.user?.id || prev.createdBy,
        organizationId: (session?.user as any)?.organizationId || prev.organizationId,
        email: nextEmail,
        brandName: nextBrandName || "",
        street: nextStreet || "",
        city: nextCity || "",
        state: nextState || "",
        country: nextCountry || "",
        postalCode: nextPostalCode || "",
        latitude: nextLat || "",
        longitude: nextLng || "",
      };
    });
  }, [hotelData, session]);

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for that field on change
    if (errors[field as keyof FieldError]) setErrors((e) => ({ ...e, [field]: undefined }));
    if (field === "email") setEmailAutoFilled(false);
    if (field === "brandName") setBrandAutoFilled(false);
    if (field === "street" || field === "city" || field === "country") setLocationAutoFilled(false);
  };

  const goNext = () => {
    const stepErrors = validateStep(step, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      
      // If not on the last step, just go to next step on Enter/Submit
      if (step < 5) {
        goNext();
        return;
      }

      const stepErrors = validateStep(5, form);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      mutate(
        {
          ...form,
          hotelId: hotelData?.id || form.hotelId || "",
          buffetMetadata: form.buffetMetadata || null,
          latitude: form.latitude || null,
          longitude: form.longitude || null,
          starRating: form.starRating || null,
          checkInTime: form.checkInTime || null,
          checkOutTime: form.checkOutTime || null,
          description: form.description || null,
          brandName: form.brandName || null,
          phone: form.phone || null,
          email: form.email || null,
          website: form.website || null,
          street: form.street || "",
          city: form.city || "",
          state: form.state || "",
          country: form.country || "",
          postalCode: form.postalCode || "",
          totalSeats: form.totalSeats ? parseInt(form.totalSeats) : null,
          allocatedSeats: form.allocatedSeats ? parseInt(form.allocatedSeats) : null,
          breakfastPrice: form.breakfastPrice || null,
          lunchPrice: form.lunchPrice || null,
          dinnerPrice: form.dinnerPrice || null,
          buffetPrice: form.buffetPrice || null,
          pricePerSeat: form.pricePerSeat || null,
          cuisineType: form.cuisineType || null,
          dressCode: form.dressCode || null,
          menuUrl: form.menuUrl || null,
          customPrices: form.customPrices,
        },
        {
          onSuccess: (newRestaurant) => {
            // After restaurant is created, add images if any
            if (form.images.length > 0) {
              const uploads = form.images.map((img, idx) => 
                new Promise((resolve, reject) => {
                  addImage({
                    restaurantId: newRestaurant.id,
                    imageUrl: img.url,
                    altText: img.altText,
                    displayOrder: idx + 1,
                    isThumbnail: idx === 0
                  }, {
                    onSuccess: resolve,
                    onError: reject
                  });
                })
              );

              Promise.all(uploads)
                .then(() => toast.success("Restaurant and images saved"))
                .catch(() => toast.error("Restaurant created, but some images failed to upload"));
            } else {
              toast.success("Restaurant created successfully");
            }

            setForm(defaultForm);
            setStep(1);
            setErrors({});
            if (onSuccess) onSuccess();
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to create restaurant");
          },
        }
      );
    },
    [form, mutate, onSuccess, addImage]
  );

  const currentStep = STEPS[step - 1];
  const StepIcon = currentStep.icon;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Gradient Header */}
      <div
        className={cn(
          "relative px-8 pt-4 pb-2 border-b",
          "transition-all duration-500"
        )}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-6 w-32 h-32 rounded-full bg-blue-500/5 blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-blue-500/5 blur-xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center">
              <StepIcon className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
                Create New Restaurant
              </h2>
              <p className="text-gray-500 text-xs">
                Step {step} of {STEPS.length} — {currentStep.subtitle}
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-1">
            <StepIndicator current={step} total={STEPS.length} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
        <div className="px-8 py-8 space-y-6 flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                <div className="flex gap-4 items-start">
                  <InfoIcon className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">System Information</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      To optimize your experience, we have automatically mapped established data from your profile.
                    </p>
                  </div>
                </div>
              </div> */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SmartField
                  label="Restaurant Name"
                  required
                >
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. The Golden Fork"
                    className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)}
                    disabled={isPending}
                  />
                  <FieldError error={errors.name} />
                </SmartField>

                <SmartField label="Brand Name" hint="Optional" autoFilled={brandAutoFilled} conflict="If your restaurant belongs to a chain or franchise, enter the brand name here.">
                  <Input
                    id="brandName"
                    value={form.brandName}
                    onChange={(e) => handleChange("brandName", e.target.value)}
                    placeholder="e.g. Spice Garden Group"
                    className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing, brandAutoFilled && "border-violet-300 bg-violet-50/50")}
                    disabled={isPending}
                  />
                </SmartField>
              </div>

              <SmartField label="Description" hint="Optional — helps guests discover you">
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe your restaurant's cuisine, ambiance, and what makes it special..."
                  className={cn("min-h-[100px] resize-none transition-all duration-200 focus:ring-2", currentStep.focusRing)}
                  disabled={isPending}
                />
              </SmartField>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                <div className="flex gap-4 items-start">
                  <MapPinIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-blue-900">Address Synced</p>
                    <p className="text-xs text-blue-700/70 mt-1 leading-relaxed">
                      Your restaurant's primary location has been synced with your hotel for consistency across our platform.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SmartField label="Street Address" autoFilled={locationAutoFilled}>
                  <Input value={form.street} onChange={(e) => handleChange("street", e.target.value)} placeholder="123 Harbour Front Rd" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing, locationAutoFilled && "border-emerald-300 bg-emerald-50/50")} disabled={isPending} />
                </SmartField>
                <SmartField label="City" autoFilled={locationAutoFilled}>
                  <Input value={form.city} onChange={(e) => handleChange("city", e.target.value)} placeholder="Galle" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing, locationAutoFilled && "border-emerald-300 bg-emerald-50/50")} disabled={isPending} />
                </SmartField>
                <SmartField label="State / Province" hint="Optional" autoFilled={locationAutoFilled}>
                  <Input value={form.state} onChange={(e) => handleChange("state", e.target.value)} placeholder="Southern Province" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing, locationAutoFilled && "border-emerald-300 bg-emerald-50/50")} disabled={isPending} />
                </SmartField>
                <SmartField label="Country" hint="Optional" autoFilled={locationAutoFilled}>
                  <Input value={form.country} onChange={(e) => handleChange("country", e.target.value)} placeholder="Sri Lanka" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing, locationAutoFilled && "border-emerald-300 bg-emerald-50/50")} disabled={isPending} />
                </SmartField>
                <SmartField label="Postal Code" hint="Optional">
                  <Input value={form.postalCode} onChange={(e) => handleChange("postalCode", e.target.value)} placeholder="80000" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                </SmartField>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">GPS Coordinates</label>
                  <span className="text-xs text-gray-400 italic">Optional</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" step="any" value={form.latitude} onChange={(e) => handleChange("latitude", e.target.value)} placeholder="Latitude" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                  <Input type="number" step="any" value={form.longitude} onChange={(e) => handleChange("longitude", e.target.value)} placeholder="Longitude" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PhoneIcon className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-gray-700">Contact Information</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SmartField label="Phone">
                    <Input id="phone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+94 712 568 568" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                    <FieldError error={errors.phone} />
                  </SmartField>
                  <SmartField label="Email" hint={emailAutoFilled ? "Auto-filled ✨" : undefined}>
                    <Input id="email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="info@restaurant.com" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing, emailAutoFilled && "border-amber-300 bg-amber-50/50")} disabled={isPending} />
                    <FieldError error={errors.email} />
                  </SmartField>
                  <SmartField label="Website">
                    <Input id="website" type="url" value={form.website} onChange={(e) => handleChange("website", e.target.value)} placeholder="https://restaurant.com" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                    <FieldError error={errors.website} />
                  </SmartField>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ClockIcon className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-gray-700">Hours & Rating</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <SmartField label="Opening Time"><Input type="time" value={form.checkInTime} onChange={(e) => handleChange("checkInTime", e.target.value)} className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} /></SmartField>
                  <SmartField label="Closing Time"><Input type="time" value={form.checkOutTime} onChange={(e) => handleChange("checkOutTime", e.target.value)} className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} /><FieldError error={errors.checkOutTime} /></SmartField>
                  <SmartField label="Star Rating"><Input type="number" step={0.1} value={form.starRating} onChange={(e) => handleChange("starRating", e.target.value)} className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} /><FieldError error={errors.starRating} /></SmartField>
                  <SmartField label="Status">
                    <select value={form.status} onChange={(e) => handleChange("status", e.target.value as FormState["status"])} className={cn("w-full border rounded-md px-3 py-2 text-sm", currentStep.focusRing)} disabled={isPending}>
                      <option value="active">🟢 Active</option>
                      <option value="inactive">🔴 Inactive</option>
                      <option value="under_maintenance">🟡 Under Maintenance</option>
                      <option value="pending_approval">🟠 Pending Approval</option>
                    </select>
                  </SmartField>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <UtensilsIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Capacity & Cuisine</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SmartField label="Cuisine Type" hint="e.g. Italian, Fusion">
                    <Input value={form.cuisineType} onChange={(e) => handleChange("cuisineType", e.target.value)} placeholder="e.g. Mediterranean" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                  </SmartField>
                  <SmartField label="Dress Code" hint="e.g. Casual, Formal">
                    <Input value={form.dressCode} onChange={(e) => handleChange("dressCode", e.target.value)} placeholder="e.g. Smart Casual" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                  </SmartField>
                  <SmartField label="Total Seats">
                    <Input type="number" value={form.totalSeats} onChange={(e) => handleChange("totalSeats", e.target.value)} placeholder="100" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                  </SmartField>
                  <SmartField label="Allocated Seats (for Reseror)">
                    <Input type="number" value={form.allocatedSeats} onChange={(e) => handleChange("allocatedSeats", e.target.value)} placeholder="50" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                  </SmartField>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-gray-700">Pricing & Menu</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <SmartField label="Breakfast Price">
                    <Input type="number" step="0.01" value={form.breakfastPrice} onChange={(e) => handleChange("breakfastPrice", e.target.value)} placeholder="0.00" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                  </SmartField>
                  <SmartField label="Lunch Price">
                    <Input type="number" step="0.01" value={form.lunchPrice} onChange={(e) => handleChange("lunchPrice", e.target.value)} placeholder="0.00" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                  </SmartField>
                  <SmartField label="Dinner Price">
                    <Input type="number" step="0.01" value={form.dinnerPrice} onChange={(e) => handleChange("dinnerPrice", e.target.value)} placeholder="0.00" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                  </SmartField>
                  <SmartField label="Buffet Price">
                    <Input type="number" step="0.01" value={form.buffetPrice} onChange={(e) => handleChange("buffetPrice", e.target.value)} placeholder="0.00" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                  </SmartField>
                </div>

                <div className="mt-6 p-5 rounded-2xl bg-amber-50/80 border border-amber-200/60 shadow-sm">
                  <div className="flex items-start gap-4">
                    <AlertCircleIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-amber-900">Anti-Fraud Chair Booking Deposit</h4>
                      <p className="text-xs text-amber-800/80 mt-1.5 leading-relaxed max-w-3xl">
                        To eliminate fraudulent reservations and prevent no-shows, customers must pay a temporary deposit per booked chair.
                        Upon arrival at your restaurant, you can trigger a <strong>100% refund</strong> back to the customer.
                        <span className="block mt-1.5 font-medium text-amber-900">
                          Note: Reseror will charge a small platform commission from your hotel account for providing this security service.
                        </span>
                      </p>
                      <div className="mt-4 w-full sm:w-1/2">
                        <SmartField label="Deposit Price Per Chair" hint="Fully refunded on arrival">
                          <Input type="number" step="0.01" value={form.pricePerSeat} onChange={(e) => handleChange("pricePerSeat", e.target.value)} placeholder="e.g. 5.00" className={cn("transition-all duration-200 focus:ring-2 border-amber-200 bg-white shadow-sm", currentStep.focusRing)} disabled={isPending} />
                        </SmartField>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <SmartField label="Menu URL" hint="Link to PDF or website">
                    <Input type="url" value={form.menuUrl} onChange={(e) => handleChange("menuUrl", e.target.value)} placeholder="https://example.com/menu.pdf" className={cn("transition-all duration-200 focus:ring-2", currentStep.focusRing)} disabled={isPending} />
                  </SmartField>
                </div>

                <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">Custom Prices</h3>
                      <p className="text-xs text-gray-500 mt-1">Add special menu items or custom pricing categories.</p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setForm(prev => ({ ...prev, customPrices: [...prev.customPrices, { label: "", price: 0 }] }))} 
                      className="gap-2 bg-white"
                      disabled={isPending}
                    >
                      <PlusCircleIcon className="w-4 h-4" />
                      Add Custom Price
                    </Button>
                  </div>
                  
                  {form.customPrices.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-white text-gray-400 text-sm">
                      No custom prices added yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {form.customPrices.map((cp, idx) => (
                        <div key={idx} className="flex items-start sm:items-end gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                          <div className="flex-1">
                            <SmartField label={`Label`}>
                              <Input 
                                value={cp.label} 
                                onChange={(e) => {
                                  const newPrices = [...form.customPrices];
                                  newPrices[idx].label = e.target.value;
                                  setForm(prev => ({ ...prev, customPrices: newPrices }));
                                }} 
                                placeholder="e.g. Kids Meal" 
                                disabled={isPending}
                              />
                            </SmartField>
                          </div>
                          <div className="flex-1">
                            <SmartField label="Price">
                              <Input 
                                type="number" 
                                step="0.01" 
                                value={cp.price} 
                                onChange={(e) => {
                                  const newPrices = [...form.customPrices];
                                  newPrices[idx].price = parseFloat(e.target.value) || 0;
                                  setForm(prev => ({ ...prev, customPrices: newPrices }));
                                }} 
                                placeholder="0.00" 
                                disabled={isPending}
                              />
                            </SmartField>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 mb-[2px] shrink-0" 
                            onClick={() => {
                              setForm(prev => ({ ...prev, customPrices: prev.customPrices.filter((_, i) => i !== idx) }));
                            }}
                            disabled={isPending}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Restaurant Gallery</h3>
                    <p className="text-xs text-gray-500">Add photos to attract more guests.</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowGallery(true)}
                    className="gap-2 border-dashed"
                  >
                    <PlusCircleIcon className="w-4 h-4" />
                    Select Photos
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <img 
                        src={img.url} 
                        alt={img.altText} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <PlusCircleIcon className="w-3 h-3 rotate-45" />
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-0 inset-x-0 bg-yellow-500/90 text-white text-[10px] font-bold text-center py-0.5">
                          Main Photo
                        </div>
                      )}
                    </div>
                  ))}
                  {form.images.length === 0 && (
                    <div className="col-span-full py-8 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-xs font-medium">No photos added yet</p>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Direct Image Link</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="https://example.com/photo.jpg" 
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="bg-white"
                    />
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={() => {
                        if (imageUrlInput) {
                          setForm(prev => ({ ...prev, images: [...prev.images, { url: imageUrlInput, altText: "Linked image" }] }));
                          setImageUrlInput("");
                        }
                      }}
                    >
                      Add Link
                    </Button>
                  </div>
                </div>
              </div>

              {showGallery && (
                <GalleryView
                  modal={true}
                  activeTab="library"
                  onUseSelected={async (selectedFiles) => {
                    setForm(prev => ({
                      ...prev,
                      images: [...prev.images, ...selectedFiles.map(f => ({ url: f.url, altText: f.filename }))]
                    }));
                    setShowGallery(false);
                  }}
                  modalOpen={showGallery}
                  setModalOpen={setShowGallery}
                />
              )}
            </div>
          )}
        </div>

        <div className={cn("px-6 py-4 bg-gradient-to-r border-t flex items-center justify-between", currentStep.lightColor, currentStep.border)}>
          <Button type="button" variant="ghost" onClick={goBack} disabled={step === 1 || isPending}><ArrowLeftIcon className="w-4 h-4 mr-1"/>Back</Button>
          <div className="flex items-center gap-2">
            {STEPS.map((s) => (
              <div key={s.id} className={cn("h-1.5 rounded-full transition-all duration-300", step === s.id ? cn("w-6 bg-gradient-to-r", s.color) : step > s.id ? "w-3 bg-green-400" : "w-3 bg-gray-200")} />
            ))}
          </div>
          {step < STEPS.length ? (
            <Button type="button" onClick={goNext} className={cn("gap-1.5 bg-gradient-to-r text-white", currentStep.color)}>Continue<ArrowRightIcon className="w-4 h-4" /></Button>
          ) : (
            <Button type="submit" disabled={isPending} loading={isPending} className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">{isPending ? "Creating..." : "Create Restaurant"}</Button>
          )}
        </div>
      </form>
    </div>
  );
}


