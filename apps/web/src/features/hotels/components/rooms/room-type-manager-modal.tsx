"use client";

import { useAppForm } from "@/components/ui/tanstack-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RoomTypeInsert, roomTypeInsertSchema } from "core/zod";
import { Switch } from "@/components/ui/switch";
import { useGetRoomTypeByID } from "@/features/hotels/queries/use-get-room-type-by-id";
import {
  useCreateRoomType,
  useUpdateRoomType,
} from "@/features/hotels/queries/rooms.query";
import { useAddRoomTypeAmenities } from "@/features/hotels/queries/use-add-room-type-amenities";
import {
  BedIcon,
  Check,
  CheckCircle2,
  ImageIcon,
  Info,
  LinkIcon,
  Loader,
  Loader2,
  PlusIcon,
  XIcon,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { getClient } from "@/lib/rpc/client";
import GalleryView from "@/modules/media/components/gallery-view";
import { ManageRoomTypeAmenities } from "./update-room-type/manage-room-type-amenities";
import { ManageRoomTypeImages } from "./update-room-type/manage-room-type-images";
import { useGetGlobalAmenities } from "@/features/admin/property-attributes-management/api/use-get-amenities";



const defaultValues: Partial<RoomTypeInsert> = {
  name: "",
  description: "",
  price: "",
  maxOccupancy: 2,
  baseOccupancy: 2,
  extraBedCapacity: 0,
  roomSizeSqm: "",
  viewType: "interior",
  status: true,
  isSmoking: false,
  bedConfiguration: null,
  note: null,
};

type Props = {
  hotelId: string;
  roomTypeId?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RoomTypeManagerModal({ hotelId, roomTypeId, open, onOpenChange }: Props) {
  const isUpdateMode = !!roomTypeId;

  // Modals & States
  const [view, setView] = useState<"photos" | "amenities" | "basic">("basic");
  
  // Create Mode Specific States
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<{url: string, filename?: string}[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [shouldClose, setShouldClose] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to top when view changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [view]);

  // Queries & Mutations
  const { data: roomTypeData, error: roomTypeError, isPending: isLoadingData } = useGetRoomTypeByID(roomTypeId || "");
  const { mutateAsync: createRoomType, isPending: isCreating } = useCreateRoomType();
  const { mutateAsync: updateRoomType, isPending: isUpdating } = useUpdateRoomType();
  const { mutateAsync: addAmenities, isPending: isAddingAmenities } = useAddRoomTypeAmenities();
  const { data: globalAmenityPool } = useGetGlobalAmenities();

  const isPending = isCreating || isUpdating || isUploadingImages || isAddingAmenities;

  // Tanstack Form
  const form = useAppForm({
    validators: { onChange: roomTypeInsertSchema.omit({ hotelId: true }) as any },
    defaultValues,
    onSubmit: async ({ value: values }: any) => {
      try {
        if (isUpdateMode && roomTypeId) {
          // UPDATE MODE: Update the room type via patch
          await updateRoomType({ id: roomTypeId, data: values as any });
          // Note: Amenities and Images are automatically live-saved in update mode via their own components!
          toast.success("Room type updated successfully!");
          
          if (shouldClose) {
            onOpenChange(false);
          } else {
            nextStep();
          }
        } else {
          // CREATE MODE: Batch Create Room Type, then add Amenities and Images
          const newRoomType = await createRoomType({
            ...values,
            hotelId: hotelId,
          } as any);

          if (selectedAmenities.length > 0) {
            await addAmenities({
              roomTypeId: newRoomType.id,
              amenities: selectedAmenities.map((type) => ({ amenityType: type })),
            });
          }

          if (selectedImages.length > 0) {
            setIsUploadingImages(true);
            try {
              const client = await getClient();
              await Promise.all(
                selectedImages.map((img) =>
                  client.api.rooms.types[":id"].images.$post({
                    param: { id: newRoomType.id },
                    json: {
                      imageUrl: img.url,
                      altText: img.filename || "Room Image",
                    },
                  })
                )
              );
            } finally {
              setIsUploadingImages(false);
            }
          }

          toast.success("Room type built with media and amenities!");
          onOpenChange(false);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to save room type");
      }
    },
  });

  // Effect to load existing data into the form if we are in Update Mode
  useEffect(() => {
    if (isUpdateMode && roomTypeData) {
      form.setFieldValue("name", roomTypeData.name || "");
      form.setFieldValue("description", roomTypeData.description || "");
      form.setFieldValue("price", roomTypeData.price || "");
      form.setFieldValue("maxOccupancy", roomTypeData.maxOccupancy || 2);
      form.setFieldValue("baseOccupancy", roomTypeData.baseOccupancy || 2);
      form.setFieldValue("extraBedCapacity", roomTypeData.extraBedCapacity || 0);
      form.setFieldValue("roomSizeSqm", roomTypeData.roomSizeSqm || "");
      form.setFieldValue("viewType", roomTypeData.viewType || "interior");
      form.setFieldValue("status", roomTypeData.status ?? true);
      form.setFieldValue("isSmoking", roomTypeData.isSmoking ?? false);
    } else if (!isUpdateMode) {
      // Reset if we switch to create mode
      form.reset();
      setSelectedAmenities([]);
      setSelectedImages([]);
      setView("basic");
    }
  }, [roomTypeData, isUpdateMode, form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const nextStep = useCallback(() => {
    if (view === "basic") setView("amenities");
    else if (view === "amenities") setView("photos");
  }, [view]);

  const prevStep = useCallback(() => {
    if (view === "photos") setView("amenities");
    else if (view === "amenities") setView("basic");
  }, [view]);

  const toggleAmenity = (item: string) => {
    setSelectedAmenities(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          
          className="sm:max-w-6xl h-[95vh] flex flex-col gap-0 p-0 overflow-hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          {isUpdateMode && isLoadingData ? (
            <DialogHeader className="px-6 py-4 border-b">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </DialogHeader>
          ) : (
            <DialogHeader className="px-6 py-4 border-b flex flex-col gap-1">
              <DialogTitle className="text-2xl font-bold font-heading">
                {isUpdateMode ? roomTypeData?.name || "Edit Room Type" : "Create New Room Type"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {isUpdateMode 
                  ? "Manage the details, amenities, and photos for this room type." 
                  : "Fill in the details below to define a new room type matching your property."}
              </DialogDescription>
            </DialogHeader>
          )}

          <div className="flex-1 overflow-hidden grid grid-cols-5 bg-background">
            {/* Sidebar */}
            <ScrollArea className="h-full col-span-1 border-r bg-secondary/50">
              <div className="flex flex-col gap-0.5 p-2">
                <Button
                  variant={"ghost"}
                  size={"lg"}
                  icon={<Info />}
                  onClick={() => setView("basic")}
                  className={cn(
                    "w-full rounded-none cursor-pointer border-l flex items-center justify-start",
                    { "border-l-4 border-primary bg-secondary shadow-sm": view === "basic" }
                  )}
                >
                  Basic Information
                </Button>
                <Button
                  variant={"ghost"}
                  size={"lg"}
                  icon={<BedIcon />}
                  onClick={() => setView("amenities")}
                  className={cn(
                    "w-full rounded-none cursor-pointer border-l flex items-center justify-start",
                    { "border-l-4 border-primary bg-secondary shadow-sm": view === "amenities",}
                  )}
                >
                  Room Amenities
                </Button>
                <Button
                  variant={"ghost"}
                  size={"lg"}
                  icon={<ImageIcon />}
                  onClick={() => setView("photos")}
                  className={cn(
                    "w-full rounded-none cursor-pointer border-l flex items-center justify-start",
                    { "border-l-4 border-primary bg-secondary shadow-sm": view === "photos" }
                  )}
                >
                  Room Photos
                </Button>
              </div>
            </ScrollArea>

            <div ref={scrollAreaRef} className="h-full col-span-4 bg-muted/10 flex flex-col relative overflow-y-auto">
               {(isUpdateMode && isLoadingData) ? (
                  <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                    <Loader className="size-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (isUpdateMode && roomTypeError) ? (
                  <div className="w-full h-full flex items-center justify-center p-6 text-red-500">
                    {roomTypeError.message}
                  </div>
                ) : (
                  <div className="w-full p-8">
                    <form.AppForm>
                      <form id="room-type-form" onSubmit={handleSubmit}>
                       {/* Basic Information View */}
                        <div className={cn("space-y-8 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none", view !== "basic" && "hidden")}>
                          <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">System Identity</h3>
                            <div className="grid grid-cols-1 gap-4">
                              <form.AppField
                                name="name"
                                children={(field: any) => (
                                  <field.FormItem>
                                    <field.FormLabel>Room Type Name</field.FormLabel>
                                    <field.FormControl>
                                      <Input
                                        disabled={isPending}
                                        placeholder="Deluxe Ocean View Suite"
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
                                name="description"
                                children={(field: any) => (
                                  <field.FormItem>
                                    <field.FormLabel>Description</field.FormLabel>
                                    <field.FormControl>
                                      <Textarea
                                        disabled={isPending}
                                        placeholder="Spacious luxury suite overlooking the sea, perfect for couples."
                                        value={field.state.value || ""}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        className="h-24 resize-none"
                                      />
                                    </field.FormControl>
                                    <field.FormMessage />
                                  </field.FormItem>
                                )}
                              />
                            </div>
                          </div>

                          <div className="space-y-4 pt-6 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Capacity & Limits</h3>
                            <div className="grid grid-cols-3 gap-4">
                              <form.AppField
                                name="baseOccupancy"
                                children={(field: any) => (
                                  <field.FormItem>
                                    <field.FormLabel>Base Occupancy</field.FormLabel>
                                    <field.FormControl>
                                      <Input
                                        disabled={isPending}
                                        type="number"
                                        min="1"
                                        max="10"
                                        placeholder="2"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(Number(e.target.value))}
                                        onBlur={field.handleBlur}
                                      />
                                    </field.FormControl>
                                    <field.FormMessage />
                                  </field.FormItem>
                                )}
                              />

                              <form.AppField
                                name="maxOccupancy"
                                children={(field: any) => (
                                  <field.FormItem>
                                    <field.FormLabel>Max Occupancy</field.FormLabel>
                                    <field.FormControl>
                                      <Input
                                        disabled={isPending}
                                        type="number"
                                        min="1"
                                        max="10"
                                        placeholder="2"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(Number(e.target.value))}
                                        onBlur={field.handleBlur}
                                      />
                                    </field.FormControl>
                                    <field.FormMessage />
                                  </field.FormItem>
                                )}
                              />

                              <form.AppField
                                name="extraBedCapacity"
                                children={(field: any) => (
                                  <field.FormItem>
                                    <field.FormLabel>Extra Bed Capacity</field.FormLabel>
                                    <field.FormControl>
                                      <Input
                                        disabled={isPending}
                                        type="number"
                                        min="0"
                                        max="5"
                                        placeholder="0"
                                        value={field.state.value ?? 0}
                                        onChange={(e) => field.handleChange(Number(e.target.value))}
                                        onBlur={field.handleBlur}
                                      />
                                    </field.FormControl>
                                    <field.FormMessage />
                                  </field.FormItem>
                                )}
                              />
                            </div>
                          </div>

                          <div className="space-y-4 pt-6 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Dimensions & Pricing</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <form.AppField
                                name="price"
                                children={(field: any) => (
                                  <field.FormItem>
                                    <field.FormLabel>Price per night (USD)</field.FormLabel>
                                    <field.FormControl>
                                      <Input
                                        disabled={isPending}
                                        placeholder="100.00"
                                        value={field.state.value?.toString() || ""}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                      />
                                    </field.FormControl>
                                    <field.FormMessage />
                                  </field.FormItem>
                                )}
                              />

                              <form.AppField
                                name="roomSizeSqm"
                                children={(field: any) => (
                                  <field.FormItem>
                                    <field.FormLabel>Room Size (sqm)</field.FormLabel>
                                    <field.FormControl>
                                      <Input
                                        disabled={isPending}
                                        placeholder="25.5"
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

                            <div className="grid grid-cols-2 gap-4">
                              <form.AppField
                                name="viewType"
                                children={(field: any) => (
                                  <field.FormItem>
                                    <field.FormLabel>View Type</field.FormLabel>
                                    <field.FormControl>
                                      <Select
                                        disabled={isPending}
                                        value={field.state.value!}
                                        onValueChange={field.handleChange as any}
                                      >
                                        <SelectTrigger className="h-14">
                                          <SelectValue placeholder="Select view type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="ocean">Ocean View</SelectItem>
                                          <SelectItem value="city">City View</SelectItem>
                                          <SelectItem value="garden">Garden View</SelectItem>
                                          <SelectItem value="mountain">Mountain View</SelectItem>
                                          <SelectItem value="pool">Pool View</SelectItem>
                                          <SelectItem value="courtyard">Courtyard View</SelectItem>
                                          <SelectItem value="street">Street View</SelectItem>
                                          <SelectItem value="interior">Interior View</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </field.FormControl>
                                    <field.FormMessage />
                                  </field.FormItem>
                                )}
                              />

                              <form.AppField
                                name="isSmoking"
                                children={(field: any) => (
                                  <field.FormItem className="flex flex-row items-center justify-between rounded-xl border p-4 bg-white/50 h-14">
                                    <div className="space-y-0.5">
                                      <field.FormLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Smoking Allowed</field.FormLabel>
                                      <field.FormDescription className="text-[10px]">
                                        Permit smoking in this room
                                      </field.FormDescription>
                                    </div>
                                    <field.FormControl>
                                      <Switch
                                        checked={field.state.value}
                                        onCheckedChange={field.handleChange}
                                        disabled={isPending}
                                      />
                                    </field.FormControl>
                                  </field.FormItem>
                                )}
                              />
                            </div>
                          </div>
                            
                          <form.Subscribe selector={(state: any) => ({ canSubmit: state.canSubmit, fieldMeta: state.fieldMeta })}>
                            {({ canSubmit, fieldMeta }: any) => canSubmit === false ? (
                              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm space-y-2 mt-4">
                                <p className="font-bold">Please fix the following issues in the Basic Information tab:</p>
                                <ul className="list-disc list-inside">
                                  {Object.entries(fieldMeta || {}).map(([name, meta]: [string, any]) =>
                                    (meta?.errors?.length ?? 0) > 0 ? (
                                      <li key={name}>
                                        <span className="capitalize font-medium">{name}</span>:{" "}
                                        {meta?.errors?.map((e: any) => e?.message || e).join(", ")}
                                      </li>
                                    ) : null
                                  )}
                                </ul>
                              </div>
                            ) : null}
                          </form.Subscribe>

                          <div className="flex justify-end pt-8 gap-3 border-t border-slate-100">
                            {isUpdateMode && (
                              <Button
                                type="submit"
                                variant="outline"
                                onClick={() => setShouldClose(true)}
                                className="rounded-xl text-xs font-bold px-6 h-12 shadow-none"
                              >
                                Save & Close
                              </Button>
                            )}
                            <Button
                              type="submit"
                              onClick={() => setShouldClose(false)}
                              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold px-8 shadow-sm h-12"
                            >
                              {isUpdateMode ? "Next Step" : "Create Room Type"}
                              <ArrowRight className="size-4 ml-2" />
                            </Button>
                          </div>
                        </div> 
                      </form>
                    </form.AppForm>

                    {/* Amenities View */}
                    <div className={cn("animate-in fade-in slide-in-from-bottom-2 h-full flex flex-col", view !== "amenities" && "hidden")}>
                        <div className="flex-1 overflow-y-auto pr-2">
                          {isUpdateMode && roomTypeData ? (
                              <ManageRoomTypeAmenities roomType={roomTypeData as any} />
                          ) : (
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">Select Room Amenities</h3>
                                {(!globalAmenityPool || globalAmenityPool.length === 0) ? (
                                  <p className="text-sm text-muted-foreground border border-dashed rounded-xl p-6 text-center">
                                    No amenities configured yet. Ask an admin to add amenities in Property Attributes.
                                  </p>
                                ) : (
                                  <div className="flex flex-wrap gap-2">
                                    {globalAmenityPool.map((item) => {
                                      const isSelected = selectedAmenities.includes(item.name);
                                      return (
                                        <button
                                          key={item.id}
                                          type="button"
                                          onClick={() => toggleAmenity(item.name)}
                                          className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border",
                                            isSelected
                                              ? "bg-slate-900 border-slate-900 text-white"
                                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                                          )}
                                        >
                                          {isSelected && <Check className="w-3 h-3" />}
                                          {item.name}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center gap-2">
                                <Info className="size-4 text-blue-500" />
                                These amenities will be saved along with your room type when you submit the form.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-8 gap-3 border-t border-slate-100 mt-auto">
                            <Button 
                              variant="secondary" 
                              className="shadow-none rounded-xl font-bold h-12 px-6" 
                              onClick={prevStep}
                            >
                              <ArrowLeft className="size-4 mr-2" />
                              Back
                            </Button>
                            <div className="flex gap-3">
                              {isUpdateMode && (
                                <Button
                                  variant="outline"
                                  onClick={() => onOpenChange(false)}
                                  className="rounded-xl text-xs font-bold px-6 h-12 shadow-none"
                                >
                                  Save & Close
                                </Button>
                              )}
                              <Button
                                onClick={nextStep}
                                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold px-8 shadow-sm h-12"
                              >
                                Next Step
                                <ArrowRight className="size-4 ml-2" />
                              </Button>
                            </div>
                        </div>
                    </div>

                    {/* Photos View */}
                    <div className={cn("animate-in fade-in slide-in-from-bottom-2 h-full flex flex-col", view !== "photos" && "hidden")}>
                        <div className="flex-1 overflow-y-auto pr-2">
                          {isUpdateMode && roomTypeData ? (
                              <ManageRoomTypeImages roomType={roomTypeData as any} />
                          ) : (
                            <div className="space-y-6">
                              <div>
                                  <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4">Initial Room Images</h3>
                                  <div className="space-y-4">
                                    {showUrlInput && (
                                      <div className="flex flex-row gap-2 items-center">
                                        <Input 
                                          placeholder="https://example.com/image.jpg" 
                                          value={urlInput}
                                          onChange={(e) => setUrlInput(e.target.value)}
                                          className="max-w-sm h-10"
                                        />
                                        <Button 
                                          type="button" 
                                          variant="default"
                                          className="h-10 text-xs font-bold px-4 bg-slate-900 text-white rounded-xl shadow-none"
                                          onClick={() => {
                                            if (urlInput.trim()) {
                                              setSelectedImages(prev => [...prev, { url: urlInput.trim(), filename: "External Link" }]);
                                              setUrlInput("");
                                              setShowUrlInput(false);
                                            }
                                          }}
                                        >
                                          Add
                                        </Button>
                                        <Button 
                                          type="button" 
                                          variant="ghost"
                                          className="h-10 w-10 p-0 text-slate-400 hover:text-slate-900"
                                          onClick={() => {
                                            setShowUrlInput(false);
                                            setUrlInput("");
                                          }}
                                        >
                                          <XIcon className="size-4" />
                                        </Button>
                                      </div>
                                    )}

                                    <div className="flex flex-row gap-3 flex-wrap">
                                      <div
                                        onClick={() => setShowGallery(true)}
                                        className="size-24 bg-white hover:bg-slate-50 cursor-pointer rounded-xl border-dashed border-2 border-slate-200 flex flex-col items-center justify-center transition-colors"
                                      >
                                        <PlusIcon className="text-slate-500 size-5" strokeWidth={2} />
                                        <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest leading-none">Upload</span>
                                      </div>

                                      <div
                                        onClick={() => setShowUrlInput(true)}
                                        className="size-24 bg-white hover:bg-slate-50 cursor-pointer rounded-xl border-dashed border-2 border-slate-200 flex flex-col items-center justify-center transition-colors space-y-2"
                                      >
                                        <LinkIcon className="text-slate-500 size-4" strokeWidth={2} />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none text-center px-1">Add URL</span>
                                      </div>

                                      {selectedImages.map((image, index) => (
                                        <div key={index} className="relative size-24 group">
                                          <img
                                            className="rounded-xl w-full h-full object-cover border border-slate-200"
                                            src={image.url}
                                            alt={image.filename || "room image"}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <XIcon className="size-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                              </div>
                              <p className="text-xs text-muted-foreground bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center gap-2">
                                  <Info className="size-4 text-blue-500" />
                                  Like amenities, photos chosen here will be uploaded and mapped to the room type upon saving.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-8 border-t border-slate-100 mt-auto">
                            <Button 
                              variant="secondary" 
                              className="shadow-none rounded-xl font-bold h-12 px-6" 
                              onClick={prevStep}
                            >
                              <ArrowLeft className="size-4 mr-2" />
                              Back
                            </Button>
                            <Button 
                              type="submit"
                              form="room-type-form"
                              disabled={isPending}
                              onClick={() => {
                                if (isUpdateMode) {
                                  onOpenChange(false);
                                }
                              }}
                              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold px-8 shadow-sm h-12"
                            >
                              {isPending ? (
                                <Loader2 className="size-4 animate-spin mr-2" />
                              ) : (
                                <Check className="size-4 mr-2" />
                              )}
                              {isUpdateMode ? "Save & Close" : "Create Room Type"}
                            </Button>
                        </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {showGallery && (
        <GalleryView
          modal={true}
          activeTab="library"
          onUseSelected={async (selectedFiles: any[]) => {
              setSelectedImages(prev => [...prev, ...selectedFiles.map((f: any) => ({ url: f.url, filename: f.filename }))]);
              setShowGallery(false);
          }}
          modalOpen={showGallery}
          setModalOpen={setShowGallery}
        />
      )}
    </>
  );
}
