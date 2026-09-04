"use client";

import AddressAutoComplete, {
  AddressType
} from "@/components/address-autocomplete";
import { HotelTypesDropdown } from "@/features/hotels/components/hotel-types-dropdown";
import { PropertyClassDropdown } from "@/features/hotels/components/property-class-dropdown";
import { useCreateHotelByAdmin } from "@/features/hotels/queries/use-create-hotel-by-admin";
import {
  hotelInsertSchema,
  type HotelInsertByAdminType
} from "core/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCreateHotelStore } from "./store";
import { Stepper } from "@/components/ui/stepper";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

// Now use that type for your default values
let defaultValues: Partial<HotelInsertByAdminType> = {
  name: "",
  brandName: "",
  description: "",
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  starRating: 0,
  checkInTime: "15:00",
  checkOutTime: "11:00",
  status: "pending_approval",
  organizationId: "",
  createdBy: "",
  phone: "",
  email: "",
  website: "",
  hotelType: null,
  propertyClass: null,
  commissionRate: null,
};

export function CreateHotel() {
  const router = useRouter();
  const { userId, organizationId } = useCreateHotelStore();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { title: "General", description: "Basic hotel details" },
    { title: "Location", description: "Address and coordinates" },
    { title: "Category", description: "Type and classification" },
    { title: "Contact", description: "Contact and timing" },
  ];

  const { mutate, isPending } = useCreateHotelByAdmin();

  const [searchInput, setSearchInput] = useState("");
  const [address, setAddress] = useState<AddressType>({
    address1: "",
    address2: "",
    formattedAddress: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    lat: 0,
    lng: 0,
  });

  const form = useAppForm({
    validators: { onChange: hotelInsertSchema },
    defaultValues,
    onSubmit: ({ value }) => {
      console.log("OnSubmit called with values:", value);
      toast.info("Validating form data...", { id: "admin-hotel-create" });

      const payload = {
        ...value,
        brandName: value.brandName || null,
        description: value.description || null,
        phone: value.phone || null,
        email: value.email || null,
        website: value.website || null,
        state: value.state || null,
        postalCode: value.postalCode || null,
        latitude: value.latitude ? value.latitude.toString() : null,
        longitude: value.longitude ? value.longitude.toString() : null,
        starRating: Number(value.starRating) || 0,
        commissionRate: value.commissionRate ? value.commissionRate.toString() : null,
        organizationId: organizationId!,
        createdBy: userId!,
      } as HotelInsertByAdminType;

      mutate(payload, {
        onSuccess: () => {
          toast.success("Hotel created successfully!", {
            id: "admin-hotel-create",
          });
          form.reset();
          router.push("/admin/hotels");
        },
        onError: (error) => {
          toast.error(`Error: ${error.message}`, { id: "admin-hotel-create" });
        },
      });
    },
  });

  // Sync address state with form values
  useEffect(() => {
    if (address.formattedAddress) {
      form.setFieldValue("street", address.address1);
      form.setFieldValue("city", address.city);
      form.setFieldValue("state", address.region || "");
      form.setFieldValue("country", address.country);
      form.setFieldValue("postalCode", address.postalCode || "");
      form.setFieldValue("latitude", address.lat ? address.lat.toString() : "");
      form.setFieldValue("longitude", address.lng ? address.lng.toString() : "");
    }
  }, [address, form]);

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Basic validation for each step
    if (currentStep === 1) {
      const name = form.getFieldValue("name");
      if (!name) {
        toast.error("Hotel name is required");
        return;
      }
    } else if (currentStep === 2) {
      const street = form.getFieldValue("street");
      if (!street) {
        toast.error("Location details are required. Use the search box.");
        return;
      }
    } else if (currentStep === 3) {
      const type = form.getFieldValue("hotelType");
      if (!type) {
        toast.error("Please select a property type");
        return;
      }
    }
    
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <Card className="border-none shadow-md overflow-hidden bg-white">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black font-heading tracking-tight">
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="text-sm font-medium">
                {steps[currentStep - 1].description}
              </CardDescription>
            </div>
            <div className="px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-bold uppercase tracking-widest">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </CardHeader>

        <form.AppForm>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-8">
              {/* Step 1: General Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <form.AppField
                    name="name"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Hotel Name</field.FormLabel>
                        <field.FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="e.g. Grand Paradise Resort"
                            className="h-12 border-slate-200 focus:border-primary"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                  <form.AppField
                    name="brandName"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Brand Name (Optional)</field.FormLabel>
                        <field.FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="e.g. Hilton, Marriott"
                            className="h-12 border-slate-200 focus:border-primary"
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                  <form.AppField
                    name="description"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Description</field.FormLabel>
                        <field.FormControl>
                          <Textarea
                            disabled={isPending}
                            placeholder="Describe the hotel facilities, views, and unique features..."
                            className="min-h-[150px] border-slate-200 focus:border-primary resize-none"
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 mb-2">
                    <p className="text-sm font-medium text-primary">
                      Search for the hotel address below. We'll automatically fill in the details.
                    </p>
                  </div>
                  <div className="">
                    <AddressAutoComplete
                      address={address}
                      setAddress={setAddress}
                      searchInput={searchInput}
                      setSearchInput={setSearchInput}
                      dialogTitle="Find Hotel Location"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Street</label>
                      <p className="text-sm font-medium truncate">{form.getFieldValue("street") || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">City</label>
                      <p className="text-sm font-medium">{form.getFieldValue("city") || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Region/State</label>
                      <p className="text-sm font-medium">{form.getFieldValue("state") || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Country</label>
                      <p className="text-sm font-medium">{form.getFieldValue("country") || "—"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Categorization */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <form.AppField
                      name="hotelType"
                      children={(field) => (
                        <field.FormItem className="flex flex-col">
                          <field.FormLabel className="mb-2">Property Type</field.FormLabel>
                          <field.FormControl>
                            <HotelTypesDropdown
                              onSelect={(hotelType) =>
                                field.handleChange(hotelType?.id || null)
                              }
                            />
                          </field.FormControl>
                          <p className="text-[10px] text-muted-foreground mt-2 italic">Select the category that best describes this property.</p>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                    <form.AppField
                      name="propertyClass"
                      children={(field) => (
                        <field.FormItem className="flex flex-col">
                          <field.FormLabel className="mb-2">Property Class</field.FormLabel>
                          <field.FormControl>
                            <PropertyClassDropdown
                              onSelect={(propertyClass) =>
                                field.handleChange(propertyClass?.id || null)
                              }
                            />
                          </field.FormControl>
                           <p className="text-[10px] text-muted-foreground mt-2 italic">How many stars or what level of luxury is this?</p>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>
                  
                  <form.AppField
                    name="starRating"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Star Rating (0-5)</field.FormLabel>
                        <field.FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={5}
                            step={1}
                            disabled={isPending}
                            className="h-12 border-slate-200 focus:border-primary max-w-[150px]"
                            value={field.state.value ?? 0}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <form.AppField
                      name="commissionRate"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel className="text-slate-900 font-semibold tracking-tight uppercase text-[10px]">Commission Rate Override (%)</field.FormLabel>
                          <field.FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              disabled={isPending}
                              placeholder="Defaults to global rate (e.g. 10.00)"
                              className="h-12 border-slate-200 focus:border-primary bg-white"
                              value={field.state.value || ""}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                            />
                          </field.FormControl>
                          <p className="text-[10px] text-muted-foreground mt-2 italic text-left">Leave empty to use the global default rate defined in Site Settings.</p>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Contact & Policy */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form.AppField
                      name="phone"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>Phone Number</field.FormLabel>
                          <field.FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="+94 11 234 5678"
                              className="h-12 border-slate-200 focus:border-primary"
                              value={field.state.value || ""}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                    <form.AppField
                      name="email"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>Email Address</field.FormLabel>
                          <field.FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="reservations@hotel.com"
                              className="h-12 border-slate-200 focus:border-primary"
                              value={field.state.value || ""}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form.AppField
                      name="checkInTime"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>Check-in Time</field.FormLabel>
                          <field.FormControl>
                            <Input
                              type="time"
                              disabled={isPending}
                              className="h-12 border-slate-200 focus:border-primary"
                              value={field.state.value || "15:00"}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                    <form.AppField
                      name="checkOutTime"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>Check-out Time</field.FormLabel>
                          <field.FormControl>
                            <Input
                              type="time"
                              disabled={isPending}
                              className="h-12 border-slate-200 focus:border-primary"
                              value={field.state.value || "11:00"}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>

                  <form.AppField
                    name="website"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Website URL</field.FormLabel>
                        <field.FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="https://www.hotel.com"
                            className="h-12 border-slate-200 focus:border-primary"
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                </div>
              )}

              {/* Error display for debugging */}
              {form.state.canSubmit === false && currentStep === steps.length && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm mt-8 space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <p className="font-black uppercase tracking-widest text-[10px]">Form Incomplete</p>
                  <ul className="list-disc list-inside font-medium italic">
                    {Object.entries(form.state.fieldMeta).map(([name, meta]) =>
                      meta.errors.length > 0 ? (
                        <li key={name}>
                          <span className="capitalize">{name.replace(/([A-Z])/g, ' $1')}</span> is required or invalid
                        </li>
                      ) : null
                    )}
                  </ul>
                </div>
              )}
            </CardContent>

            <CardFooter className="bg-slate-50 border-t p-6 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isPending}
                className={cn("h-12 px-8 font-bold uppercase tracking-widest text-xs", currentStep === 1 && "invisible")}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="h-12 px-8 font-bold uppercase tracking-widest text-xs shadow-sm shadow-primary/5"
                >
                  <span className="flex items-center gap-2">
                    Next Step <ChevronRight className="w-4 h-4" />
                  </span>
                </Button>
              ) : (
                <Button
                  type="submit"
                  loading={isPending}
                  disabled={isPending}
                  className="h-12 px-8 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/30 bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all"
                  icon={<Check className="w-4 h-4" />}
                >
                  Create Property
                </Button>
              )}
            </CardFooter>
          </form>
        </form.AppForm>
      </Card>
    </div>
  );
}
