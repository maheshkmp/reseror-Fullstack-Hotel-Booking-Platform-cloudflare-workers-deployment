"use client";

import React, { useCallback, useEffect, useId } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppForm, FormMessage } from "@/components/ui/tanstack-form";
import { HotelTypesDropdown } from "@/features/hotels/components/hotel-types-dropdown";
import { PropertyClassDropdown } from "@/features/hotels/components/property-class-dropdown";

import { useUpdateHotelByID, useGetHotelByID } from "@/features/hotels/queries/use-update-hotel-by-id";
import { hotelUpdateSchema, type HotelUpdateType } from "core/zod";

interface UpdateHotelSheetProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hotelId: string;
}

export function UpdateHotelSheet({
  open,
  setOpen,
  hotelId
}: UpdateHotelSheetProps) {
  const toastId = useId();

  const {
    data: hotel,
    error: hotelErr,
    isPending: isFetching
  } = useGetHotelByID(hotelId);

  const { mutate, isPending } = useUpdateHotelByID();

  const form = useAppForm({
    validators: { onChange: hotelUpdateSchema },
    defaultValues: {
      name: "",
      brandName: null,
      description: null,
      street: "",
      city: "",
      state: null,
      country: "",
      postalCode: null,
      phone: null,
      email: null,
      website: null,
      starRating: null,
      checkInTime: null,
      checkOutTime: null,
      status: "active",
      hotelType: null,
      propertyClass: null,
      latitude: null,
      longitude: null,
      commissionRate: null,
    } as HotelUpdateType,
    onSubmit: ({ value }) => handleUpdateHotel(value)
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const errors = form.state.errors;
      if (errors.length > 0) {
        toast.error("Please fix the validation errors before submitting.", { id: toastId });
      }
      
      form.handleSubmit();
    },
    [form, toastId]
  );

  const handleUpdateHotel = async (values: HotelUpdateType) => {
    mutate({ id: hotelId, data: values as any }, {
      onSuccess() {
        toast.success("Hotel updated successfully!", { id: toastId });
        setOpen(false);
      },
      onError(error) {
        toast.error(`Failed to update hotel: ${error.message}`, { id: toastId });
      }
    });
  };

  useEffect(() => {
    if (hotelErr) {
      toast.error("Failed to fetch hotel details", {
        description: hotelErr.message
      });
    }

    if (hotel) {
      form.setFieldValue("name", hotel.name);
      form.setFieldValue("brandName", hotel.brandName || "");
      form.setFieldValue("description", hotel.description || "");
      form.setFieldValue("street", hotel.street);
      form.setFieldValue("city", hotel.city);
      form.setFieldValue("state", hotel.state || "");
      form.setFieldValue("country", hotel.country);
      form.setFieldValue("postalCode", hotel.postalCode || "");
      form.setFieldValue("phone", hotel.phone || "");
      form.setFieldValue("email", hotel.email || "");
      form.setFieldValue("website", hotel.website || "");
      form.setFieldValue("starRating", hotel.starRating ?? 0);
      form.setFieldValue("checkInTime", hotel.checkInTime || "");
      form.setFieldValue("checkOutTime", hotel.checkOutTime || "");
      form.setFieldValue("status", hotel.status as any);
      
      const hotelTypeId = (hotel as any).hotelTypeId || (hotel as any).hotelType?.id || (typeof (hotel as any).hotelType === 'string' ? (hotel as any).hotelType : null);
      const propertyClassId = (hotel as any).propertyClassId || (hotel as any).propertyClass?.id || (typeof (hotel as any).propertyClass === 'string' ? (hotel as any).propertyClass : null);
      
      form.setFieldValue("hotelType", hotelTypeId);
      form.setFieldValue("propertyClass", propertyClassId);
      form.setFieldValue("commissionRate", (hotel as any).commissionRate ?? "");
    }
  }, [hotelErr, hotel, hotelId, form]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto border-l shadow-none p-0">
        <div className="p-6 border-b bg-slate-50/50">
          <SheetHeader>
            <SheetTitle className="text-xl font-black tracking-tight">Quick Property Update</SheetTitle>
            <SheetDescription className="text-xs font-medium">
              Rapidly edit essential details of the hotel.
            </SheetDescription>
          </SheetHeader>
        </div>

        {isFetching ? (
          <div className="grid gap-6 py-8 px-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          hotel && (
            <form.AppForm>
              <form onSubmit={handleSubmit}>
                <fieldset disabled={isPending} className="flex flex-col gap-y-6 py-6 px-6 text-sm">
                  {/* Status Section */}
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                    <form.AppField
                      name="status"
                      children={(field) => (
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-blue-900/70">Hotel Status</Label>
                          <Select
                            value={field.state.value}
                            onValueChange={(value) => field.handleChange(value as any)}
                          >
                            <SelectTrigger className="bg-white border-blue-200">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending_approval">Pending Approval</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      )}
                    />
                  </div>

                  {/* General Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="h-px flex-1 bg-slate-100" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Basic Information</span>
                       <div className="h-px flex-1 bg-slate-100" />
                    </div>
                    
                    <form.AppField
                      name="name"
                      children={(field) => (
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Hotel Name</Label>
                          <Input
                            className="h-9"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Hotel Name"
                          />
                          <FormMessage />
                        </div>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <form.AppField
                        name="brandName"
                        children={(field) => (
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Brand Name</Label>
                            <Input
                              className="h-9"
                              value={field.state.value || ""}
                              onChange={(e) => field.handleChange(e.target.value)}
                              placeholder="Brand Name"
                            />
                            <FormMessage />
                          </div>
                        )}
                      />
                      <form.AppField
                        name="starRating"
                        children={(field) => (
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Star Rating</Label>
                            <Input
                              className="h-9"
                              type="number"
                              value={field.state.value || 0}
                              onChange={(e) => field.handleChange(Number(e.target.value))}
                              placeholder="Star Rating"
                            />
                            <FormMessage />
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  {/* Financial Override */}
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                    <form.AppField
                      name="commissionRate"
                      children={(field) => (
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/70">Commission Override (%)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. 15.00"
                            className="bg-white border-emerald-200 h-9"
                          />
                          <FormMessage />
                          <p className="text-[10px] text-emerald-600/70 italic font-medium italic">Empty defaults to site-wide rate.</p>
                        </div>
                      )}
                    />
                  </div>

                  {/* Classification */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="h-px flex-1 bg-slate-100" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Classification</span>
                       <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <form.AppField
                        name={"hotelType" as any}
                        children={(field) => (
                          <div className="space-y-1.5 font-medium">
                            <Label className="text-xs font-semibold">Property Type</Label>
                            <HotelTypesDropdown
                              value={field.state.value}
                              onSelect={(type) => field.handleChange(type?.id || null as any)}
                            />
                            <FormMessage />
                          </div>
                        )}
                      />
                      <form.AppField
                        name={"propertyClass" as any}
                        children={(field) => (
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Property Class</Label>
                            <PropertyClassDropdown
                              value={field.state.value}
                              onSelect={(pc) => field.handleChange(pc?.id || null as any)}
                            />
                            <FormMessage />
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  {/* Operational Settings */}
                   <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="h-px flex-1 bg-slate-100" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Operations</span>
                       <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <form.AppField
                        name="checkInTime"
                        children={(field) => (
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Check-in</Label>
                            <Input
                              className="h-9"
                              value={field.state.value || ""}
                              onChange={(e) => field.handleChange(e.target.value)}
                              placeholder="HH:MM"
                            />
                            <FormMessage />
                          </div>
                        )}
                      />
                      <form.AppField
                        name="checkOutTime"
                        children={(field) => (
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Check-out</Label>
                            <Input
                              className="h-9"
                              value={field.state.value || ""}
                              onChange={(e) => field.handleChange(e.target.value)}
                              placeholder="HH:MM"
                            />
                            <FormMessage />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </fieldset>

                <div className="p-6 border-t bg-slate-50/50 mt-4">
                  <SheetFooter>
                    <Button
                      type="submit"
                      loading={isPending}
                      className="w-full h-11 font-bold uppercase tracking-widest text-xs"
                    >
                      Apply Quick Changes
                    </Button>
                  </SheetFooter>
                </div>
              </form>
            </form.AppForm>
          )
        )}
      </SheetContent>
    </Sheet>
  );
}
