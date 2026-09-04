"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarIcon,
  ImageIcon,
  MapPinIcon,
  PencilIcon,
  TagIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateAd } from "../actions/use-update-ad";
import type { ad, adUpdateType } from "core/zod";
import { useGetHotels } from "@/features/hotels/queries/use-get-hotels";
import { useGetRoomTypes } from "@/features/hotels/queries/use-get-rooms";

function toStr(val: any) {
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}

interface Props {
  ad: ad;
}

export default function EditAdDialog({ ad }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<adUpdateType>({
    hotelId: ad.hotelId || "",
    roomId: ad.roomId || "",
    restaurantId: ad.restaurantId || "",
    title: ad.title || "",
    description: ad.description || null,
    imageUrl: ad.imageUrl || null,
    redirectUrl: ad.redirectUrl || null,
    startDate: ad.startDate
      ? new Date(ad.startDate).toISOString().split("T")[0]
      : "",
    endDate: ad.endDate ? new Date(ad.endDate).toISOString().split("T")[0] : "",
    isActive: !!ad.isActive,
    priority: ad.priority || "normal",
    placement: ad.placement || null,
    promoCode: (ad as any).promoCode || null,
    discountPercent: (ad as any).discountPercent != null
      ? Number((ad as any).discountPercent)
      : null,
    isUniquePerUser: !!(ad as any).isUniquePerUser,
    usageLimit: (ad as any).usageLimit || "",
    minBookingValue: (ad as any).minBookingValue || "0",
  });
  const updateAd = useUpdateAd();

  // Hotel + room type dropdowns
  const { data: hotelsData } = useGetHotels({ limit: "100" });
  const hotels = hotelsData?.data || hotelsData || [];
  const { data: roomTypesData } = useGetRoomTypes(formData.hotelId || undefined);
  const roomTypes = roomTypesData?.data || roomTypesData || [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: adUpdateType = {
        hotelId: formData.hotelId?.trim() || null,
        roomId: formData.roomId?.trim() || null,
        restaurantId: formData.restaurantId?.trim() || null,
        title: formData.title?.trim() || "",
        description: formData.description?.trim() || null,
        imageUrl: formData.imageUrl?.trim() || null,
        redirectUrl: formData.redirectUrl?.trim() || null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        isActive: formData.isActive,
        priority: (formData.priority as any) || "normal",
        placement: formData.placement?.trim() || null,
        promoCode: formData.promoCode?.toUpperCase().trim() || null,
        discountPercent: formData.discountPercent
          ? Number(formData.discountPercent)
          : null,
        isUniquePerUser: Boolean(formData.isUniquePerUser),
        usageLimit: (formData as any).usageLimit
          ? parseInt(String((formData as any).usageLimit))
          : null,
        minBookingValue: (formData as any).minBookingValue
          ? parseFloat(String((formData as any).minBookingValue))
          : 0,
      } as any;

      await updateAd.mutateAsync({ id: toStr(ad.id), data: payload });
      toast.success("Ad updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update ad. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 px-2">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px] h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Edit Ad</DialogTitle>
            <DialogDescription>
              Make changes to your ad below. Required fields are marked with *.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-4 space-y-6 pb-2">
            {/* Section 1: Ad Information */}
            <div className="mt-6 p-4 rounded-lg border bg-muted/10">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <ImageIcon className="h-4 w-4 text-blue-600" />
                Ad Information
              </h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="font-medium">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter ad title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the offer shown in this ad"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl" className="font-medium">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    placeholder="https://..."
                    value={formData.imageUrl || ""}
                    onChange={handleChange}
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="preview"
                      className="w-20 h-14 object-cover rounded border"
                    />
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="redirectUrl" className="font-medium">
                    Redirect URL
                    <span className="ml-1 text-[10px] text-muted-foreground font-normal">(overrides auto-link)</span>
                  </Label>
                  <Input
                    id="redirectUrl"
                    name="redirectUrl"
                    placeholder="https://... (leave blank to auto-link)"
                    value={formData.redirectUrl || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Promo / Discount */}
            <div className="p-4 rounded-lg border bg-muted/10">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <TagIcon className="h-4 w-4 text-emerald-600" />
                Promo Code & Discount
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="promoCode" className="font-medium">
                    Promo Code
                  </Label>
                  <Input
                    id="promoCode"
                    name="promoCode"
                    placeholder="e.g. SUMMER40"
                    value={formData.promoCode || ""}
                    onChange={handleChange}
                    maxLength={50}
                    className="font-mono tracking-wider"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Guests enter this at booking checkout.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discountPercent" className="font-medium">
                    Discount %
                  </Label>
                  <Input
                    id="discountPercent"
                    name="discountPercent"
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    placeholder="e.g. 40"
                    value={formData.discountPercent || ""}
                    onChange={handleChange}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Applied to the room rate total.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-2 border-t">
                <input
                  type="checkbox"
                  id="isUniquePerUser"
                  name="isUniquePerUser"
                  checked={formData.isUniquePerUser === true}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isUniquePerUser: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <Label htmlFor="isUniquePerUser" className="text-sm font-normal cursor-pointer">
                  Unique per user (Limit to one use per customer)
                </Label>
              </div>

              <div className="grid gap-2 mt-4 pt-4 border-t">
                <Label htmlFor="usageLimit" className="font-medium text-xs">
                  Total Usage Limit
                  <span className="ml-1 text-[10px] text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="usageLimit"
                  name="usageLimit"
                  type="number"
                  min={1}
                  placeholder="Unlimited"
                  value={(formData as any).usageLimit || ""}
                  onChange={handleChange}
                  className="max-w-[150px]"
                />
              </div>

              <div className="grid gap-2 mt-4 pt-4 border-t">
                <Label htmlFor="minBookingValue" className="font-medium text-xs">
                  Minimum Booking Value
                  <span className="ml-1 text-[10px] text-muted-foreground font-normal">(optional)</span>
                </Label>
                <div className="relative max-w-[150px]">
                  <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">$</span>
                  <Input
                    id="minBookingValue"
                    name="minBookingValue"
                    type="number"
                    min={0}
                    placeholder="0.00"
                    value={(formData as any).minBookingValue || ""}
                    onChange={handleChange}
                    className="pl-6"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Ad Configuration */}
            <div className="p-4 rounded-lg border bg-muted/10">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
                Campaign Configuration
              </h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate" className="font-medium">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate" className="font-medium">
                      End Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="priority" className="font-medium">
                      Priority
                    </Label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority || "normal"}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="placement" className="font-medium">
                      Placement
                    </Label>
                    <Input
                      id="placement"
                      name="placement"
                      placeholder="homepage, search, etc."
                      value={formData.placement || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={
                      formData.isActive === true
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                    Active — visible on landing page
                  </Label>
                </div>
              </div>
            </div>

            {/* Section 4: Relations */}
            <div className="p-4 rounded-lg border bg-muted/10">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <MapPinIcon className="h-4 w-4 text-blue-600" />
                Link to Property
                <span className="ml-1 text-[10px] text-muted-foreground font-normal">(used for smart CTA link)</span>
              </h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hotelId" className="font-medium">Hotel</Label>
                  <select
                    id="hotelId"
                    name="hotelId"
                    value={formData.hotelId || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        hotelId: e.target.value,
                        roomId: "",
                      }));
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">— No hotel linked —</option>
                    {hotels.map((h: any) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.hotelId && (
                  <div className="grid gap-2">
                    <Label htmlFor="roomId" className="font-medium">
                      Room Type
                      <span className="ml-1 text-[10px] text-muted-foreground font-normal">(links directly to booking)</span>
                    </Label>
                    <select
                      id="roomId"
                      name="roomId"
                      value={formData.roomId || ""}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">— No room type —</option>
                      {roomTypes.map((rt: any) => (
                        <option key={rt.id} value={rt.id}>
                          {rt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 mt-4 px-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              <XIcon className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
