"use client";

import GalleryView from "@/modules/media/components/gallery-view";
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
  PlusIcon,
  TagIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateAd } from "../actions/use-create-ad";
import { adInsertType } from "core/zod";
import { useGetHotels } from "@/features/hotels/queries/use-get-hotels";
import { useGetRoomTypes } from "@/features/hotels/queries/use-get-rooms";

const initialState: any = {
  hotelId: "",
  roomId: "",
  restaurantId: "",
  title: "",
  description: "",
  imageUrl: "",
  redirectUrl: "",
  startDate: "",
  endDate: "",
  isActive: true,
  priority: "normal",
  placement: "",
  promoCode: "",
  discountPercent: "",
  isUniquePerUser: false,
  usageLimit: "",
  minBookingValue: "0",
};

export function CreateNewAd() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<adInsertType>(initialState);
  const [showGallery, setShowGallery] = useState(false);
  const createAd = useCreateAd();

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
      const payload: adInsertType = {
        ...formData,
        hotelId: formData.hotelId?.trim() || null,
        roomId: formData.roomId?.trim() || null,
        restaurantId: formData.restaurantId?.trim() || null,
        description: formData.description?.trim() || null,
        imageUrl: formData.imageUrl?.trim() || null,
        redirectUrl: formData.redirectUrl?.trim() || null,
        isActive: Boolean(formData.isActive),
        priority: (formData.priority as any) || "normal",
        placement: formData.placement?.trim() || null,
        promoCode: (formData as any).promoCode?.toUpperCase().trim() || null,
        discountPercent: (formData as any).discountPercent
          ? parseFloat((formData as any).discountPercent)
          : null,
        isUniquePerUser: Boolean(formData.isUniquePerUser),
        usageLimit: (formData as any).usageLimit
          ? parseInt((formData as any).usageLimit)
          : null,
        minBookingValue: (formData as any).minBookingValue
          ? parseFloat((formData as any).minBookingValue)
          : 0,
      };
      await createAd.mutateAsync(payload);
      toast.success("Ad created successfully!");
      setFormData(initialState);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create ad. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="flex items-center gap-2 bg-primary text-primary-foreground font-bold uppercase tracking-tight text-[11px] h-8 shadow-none"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          New Ad
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px] h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Create New Ad</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new ad. Required fields are
              marked with *.
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
                    value={formData.title}
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
                  <Label className="font-medium">Banner Image</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.imageUrl ? (
                      <div className="relative group">
                        <img
                          src={formData.imageUrl}
                          alt="ad-image"
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, imageUrl: "" }))
                          }
                          aria-label="Remove image"
                        >
                          <Trash2Icon className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setShowGallery(true)}
                      className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-blue-400 rounded hover:bg-blue-50 transition"
                      aria-label="Add image"
                    >
                      <PlusIcon className="w-6 h-6 text-blue-600" />
                    </button>
                  </div>
                  <GalleryView
                    modal={true}
                    activeTab="library"
                    onUseSelected={(selectedFiles: { url: string }[]) => {
                      if (selectedFiles.length > 0) {
                        setFormData((prev) => ({
                          ...prev,
                          imageUrl: selectedFiles[0].url,
                        }));
                      }
                      setShowGallery(false);
                    }}
                    modalOpen={showGallery}
                    setModalOpen={setShowGallery}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="redirectUrl" className="font-medium">
                    Redirect URL
                    <span className="ml-1 text-[10px] text-muted-foreground font-normal">(overrides auto-link from hotel/room)</span>
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
                    <span className="ml-1 text-[10px] text-muted-foreground font-normal">(auto-UPPERCASE)</span>
                  </Label>
                  <Input
                    id="promoCode"
                    name="promoCode"
                    placeholder="e.g. SUMMER40"
                    value={(formData as any).promoCode || ""}
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
                    value={(formData as any).discountPercent || ""}
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
                  <span className="ml-1 text-[10px] text-muted-foreground font-normal">(optional — e.g. "first 100 people")</span>
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
                  <span className="ml-1 text-[10px] text-muted-foreground font-normal">(optional — e.g. "orders over $200")</span>
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: e.target.value as "normal" | "high" | "low",
                        }))
                      }
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
                    checked={formData.isActive === true}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                    Make this ad active immediately
                  </Label>
                </div>
              </div>
            </div>

            {/* Section 4: Relations */}
            <div className="p-4 rounded-lg border bg-muted/10">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <MapPinIcon className="h-4 w-4 text-blue-600" />
                Link to Property
                <span className="ml-1 text-[10px] text-muted-foreground font-normal">(used for smart CTA link in ad)</span>
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
                        roomId: "", // reset room when hotel changes
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
                      <span className="ml-1 text-[10px] text-muted-foreground font-normal">(optional — links directly to booking page)</span>
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
              {isSubmitting ? "Creating..." : "Create Ad"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewAd;
