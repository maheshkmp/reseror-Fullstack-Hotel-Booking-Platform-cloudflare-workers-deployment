"use client";

import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { 
  PlusCircleIcon, 
  LinkIcon, 
  Check, 
  ChevronsUpDown,
  ExternalLinkIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCreateDestination } from "../actions/create-action";
import { useGetHotelTypes } from "../actions/get-hotel-types";
import AddressAutoComplete, { AddressType } from "@/components/address-autocomplete";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import {
  destinationInsertSchema,
  type destinationInsertType,
} from "core/zod";

const defaultValues: Partial<destinationInsertType> = {
  title: "",
  slug: "",
  content: "",
  featuredImage: "",
  latitude: undefined,
  longitude: undefined,
  category: "",
  externalLink: "",
  popularityScore: 0,
  recommended: false,
};

export function CreateDestination({
  triggerRef,
}: {
  triggerRef?: React.RefObject<HTMLButtonElement>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateDestination();
  const { data: hotelTypes = [] } = useGetHotelTypes();
  const [open, setOpen] = useState(false);
  const [linksPopoverOpen, setLinksPopoverOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [isManualLocation, setIsManualLocation] = useState(false);
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
    validators: { onChange: destinationInsertSchema },
    defaultValues,
    onSubmit: ({ value }) =>
      mutate(value as destinationInsertType, {
        onSuccess: () => {
          form.reset();
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["destinations"] });
        },
      }),
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  // Sync address state with form values
  useEffect(() => {
    if (!isManualLocation && address.formattedAddress) {
      form.setFieldValue("latitude", address.lat ? address.lat : undefined);
      form.setFieldValue("longitude", address.lng ? address.lng : undefined);
    }
  }, [address, isManualLocation, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          ref={triggerRef}
          size="sm"
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground font-bold uppercase tracking-tight text-[11px] h-8 shadow-none"
        >
          <PlusCircleIcon className="w-3.5 h-3.5" />
          New Destination
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Destination</DialogTitle>
        </DialogHeader>
        <Card className="w-full rounded-sm shadow-none border-none">
          <CardHeader>
            <CardDescription>
              Provide the details of the destination
            </CardDescription>
          </CardHeader>
          <form.AppForm>
            <form onSubmit={handleSubmit}>
              <CardContent className="flex flex-col gap-y-5 mb-6">
                <form.AppField
                  name="title"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="required">
                        Title <span className="text-red-500">*</span>
                      </field.FormLabel>
                      <field.FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Enter destination title"
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          required
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="slug"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="required">
                        Slug <span className="text-red-500">*</span>
                      </field.FormLabel>
                      <field.FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Enter slug"
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          required
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="content"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Content</field.FormLabel>
                      <field.FormControl>
                        <Textarea
                          disabled={isPending}
                          placeholder="Enter destination content"
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
                  name="category"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="required">
                        Category <span className="text-red-500">*</span>
                      </field.FormLabel>
                      <field.FormControl>
                        <Select
                          disabled={isPending}
                          value={field.state.value || ""}
                          onValueChange={(value) => field.handleChange(value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Property Type">
                              Property Type
                            </SelectItem>
                            <SelectItem value="Popular Destinations">
                              Popular Destinations
                            </SelectItem>
                            <SelectItem value="Region">Region</SelectItem>
                            <SelectItem value="Nearby Places">
                              Nearby Places
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 px-2">
                       <MapPin className="w-4 h-4 text-primary" />
                       <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Location Setup</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-md border shadow-sm">
                       <Button 
                         type="button" 
                         variant={!isManualLocation ? "secondary" : "ghost"} 
                         size="sm" 
                         className="h-7 text-[10px] uppercase font-bold px-3"
                         onClick={() => setIsManualLocation(false)}
                       >Auto</Button>
                       <Button 
                         type="button" 
                         variant={isManualLocation ? "secondary" : "ghost"} 
                         size="sm" 
                         className="h-7 text-[10px] uppercase font-bold px-3"
                         onClick={() => setIsManualLocation(true)}
                       >Manual</Button>
                    </div>
                  </div>

                  {!isManualLocation ? (
                    <div className="space-y-2 animate-in fade-in duration-300">
                      <AddressAutoComplete
                        address={address}
                        setAddress={setAddress}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        dialogTitle="Find Destination Location"
                        placeholder="Search for a city, landmark or address..."
                      />
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-slate-50 p-3 rounded-md border border-dashed border-slate-300">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Latitude</p>
                          <p className="font-mono text-sm">{address.lat || "Not set"}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border border-dashed border-slate-300">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Longitude</p>
                          <p className="font-mono text-sm">{address.lng || "Not set"}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <form.AppField
                        name="latitude"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel>Latitude</field.FormLabel>
                            <field.FormControl>
                              <Input
                                disabled={isPending}
                                type="number"
                                step="any"
                                placeholder="Enter latitude"
                                value={field.state.value?.toString() || ""}
                                onChange={(e) =>
                                  field.handleChange(
                                    parseFloat(e.target.value) || undefined
                                  )
                                }
                                onBlur={field.handleBlur}
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />
                      <form.AppField
                        name="longitude"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel>Longitude</field.FormLabel>
                            <field.FormControl>
                              <Input
                                disabled={isPending}
                                type="number"
                                step="any"
                                placeholder="Enter longitude"
                                value={field.state.value?.toString() || ""}
                                onChange={(e) =>
                                  field.handleChange(
                                    parseFloat(e.target.value) || undefined
                                  )
                                }
                                onBlur={field.handleBlur}
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
                <form.AppField
                  name="popularityScore"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Popularity Score</field.FormLabel>
                      <field.FormControl>
                        <Input
                          disabled={isPending}
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Enter popularity score (0-100)"
                          value={field.state.value?.toString() || "0"}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value) || 0)
                          }
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="externalLink"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="flex items-center gap-2">
                        External Link
                      </field.FormLabel>
                      <div className="flex gap-2">
                        <field.FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="Enter external link (e.g. /search?type=villa)"
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="flex-1"
                          />
                        </field.FormControl>
                        <Popover open={linksPopoverOpen} onOpenChange={setLinksPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="shrink-0"
                              title="Quick suggestions"
                            >
                              <ChevronsUpDown className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0" align="end">
                            <Command>
                              <CommandInput placeholder="Search suggestions..." />
                              <CommandList>
                                <CommandEmpty>No suggestions found.</CommandEmpty>
                                <CommandGroup heading="General Links">
                                  <CommandItem
                                    onSelect={() => {
                                      field.handleChange("/search");
                                      setLinksPopoverOpen(false);
                                    }}
                                  >
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    Main Search Page
                                  </CommandItem>
                                </CommandGroup>
                                <CommandGroup heading="Category Filters">
                                  {["Nearby Places", "Popular Destinations", "Region", "Property Type"].map((cat) => (
                                    <CommandItem
                                      key={cat}
                                      onSelect={() => {
                                        field.handleChange(`/search?category=${encodeURIComponent(cat)}`);
                                        setLinksPopoverOpen(false);
                                      }}
                                    >
                                      <LinkIcon className="mr-2 h-4 w-4" />
                                      {cat} Results
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                {hotelTypes.length > 0 && (
                                  <CommandGroup heading="Specific Property Types">
                                    {hotelTypes.map((type: any) => (
                                      <CommandItem
                                        key={type.id}
                                        onSelect={() => {
                                          field.handleChange(`/search?hotelType=${type.id}`);
                                          setLinksPopoverOpen(false);
                                        }}
                                      >
                                        <LinkIcon className="mr-2 h-4 w-4" />
                                        {type.name} Accommodations
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="recommended"
                  children={(field) => (
                    <field.FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <field.FormControl>
                        <Checkbox
                          disabled={isPending}
                          checked={field.state.value || false}
                          onCheckedChange={(checked) =>
                            field.handleChange(!!checked)
                          }
                        />
                      </field.FormControl>
                      <div className="space-y-1 leading-none">
                        <field.FormLabel>
                          Recommended Destination
                        </field.FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Mark this destination as recommended for featured
                          display
                        </p>
                      </div>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="featuredImage"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Featured Image</field.FormLabel>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <field.FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="Paste image URL here..."
                              value={field.state.value || ""}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                              className="flex-1"
                            />
                          </field.FormControl>
                          <Button
                            type="button"
                            variant="secondary"
                            className="shrink-0"
                            onClick={() => setMediaDialogOpen(true)}
                          >
                            Browse
                          </Button>
                        </div>
                        {field.state.value && (
                          <div className="relative w-32 h-20 rounded-md overflow-hidden border">
                            <img 
                              src={field.state.value} 
                              alt="Featured preview" 
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 rounded-full scale-75"
                              onClick={() => field.handleChange("")}
                            >
                              ×
                            </Button>
                          </div>
                        )}
                      </div>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                {/* Media Picker Dialog */}
                <GalleryView
                  modal={true}
                  modalOpen={mediaDialogOpen}
                  setModalOpen={setMediaDialogOpen}
                  activeTab="library"
                  onUseSelected={(selectedFiles) => {
                    if (selectedFiles && selectedFiles.length > 0) {
                      // Use the first selected media file's url
                      form.setFieldValue("featuredImage", selectedFiles[0].url);
                      setMediaDialogOpen(false);
                    }
                  }}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" loading={isPending} disabled={isPending}>
                  Create Destination
                </Button>
              </CardFooter>
            </form>
          </form.AppForm>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
