"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, toKebabCase } from "@/lib/utils";

import AddressAutoComplete, {
  AddressType,
} from "@/components/address-autocomplete";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Edit3, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCreateHotel } from "../queries/use-create-hotel";
import {
  hotelInsertSchema,
  type HotelInsertType,
} from "core/zod";
import { HotelTypesDropdown } from "./hotel-types-dropdown";
import { PropertyClassDropdown } from "./property-class-dropdown";
import { TagSelector } from "@/components/tag-selector";

type Props = {
  className?: string;
};

// Now use that type for your default values
const defaultValues: Partial<HotelInsertType> = {
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
  formattedAddress: "",
  starRating: 0,
  checkInTime: "15:00",
  checkOutTime: "11:00",
  status: "pending_approval",
  phone: "",
  email: "",
  website: "",
  hotelType: null,
  propertyClass: null,
  slug: "",
  tags: [],
};

export function SetupHotel({ className }: Props) {
  const { mutate, isPending } = useCreateHotel();
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [isManualAddress, setIsManualAddress] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
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
      toast.info("Validating form data...", { id: "form-submit" });

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
        formattedAddress: value.formattedAddress || null,
      } as HotelInsertType;

      console.log("Mutation payload:", payload);

      mutate(payload, {
        onSuccess: () => {
          toast.success("Hotel created successfully!", { id: "form-submit" });
          form.reset();
          window.location.href = "/account/manage";
        },
        onError: (error) => {
          toast.error(`Error: ${error.message}`, { id: "form-submit" });
        },
      });
    },
  });
  
  // Sync address state with form values
  useEffect(() => {
    if (!isManualAddress && address.formattedAddress) {
      form.setFieldValue("street", address.address1);
      form.setFieldValue("city", address.city);
      form.setFieldValue("state", address.region || "");
      form.setFieldValue("country", address.country);
      form.setFieldValue("postalCode", address.postalCode || "");
      // Sync coordinates and formatted address
      form.setFieldValue("latitude", address.lat !== undefined ? address.lat.toString() : "");
      form.setFieldValue("longitude", address.lng !== undefined ? address.lng.toString() : "");
      form.setFieldValue("formattedAddress", address.formattedAddress || "");
    }
  }, [address, isManualAddress, form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("HandleSubmit triggered");
      toast.info("Attempting to submit...", { id: "form-submit" });
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Card className={cn("w-full max-w-4xl mx-auto px-4", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-heading">
          Setup your Property
        </CardTitle>
        <CardDescription>
          {`To get started, please fill out the details of your hotel. This will help us tailor the experience to your needs.`}
          <br />
          {`If you have any questions, feel free to reach out to our support team.`}
        </CardDescription>
      </CardHeader>

      

      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
              <form.AppField
                name="hotelType"
                children={(field) => (
                  <field.FormItem>
                    <field.FormControl>
                      <HotelTypesDropdown
                        onSelect={(hotelType) =>
                          field.handleChange(hotelType?.id || null)
                        }
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.AppField
                name="propertyClass"
                children={(field) => (
                  <field.FormItem>
                    <field.FormControl>
                      <PropertyClassDropdown
                        onSelect={(propertyClass) =>
                          field.handleChange(propertyClass?.id || null)
                        }
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Property Name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Enter property name"
                        value={field.state.value || ""}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          if (!isSlugManuallyEdited) {
                            form.setFieldValue("slug", toKebabCase(e.target.value));
                          }
                        }}
                        onBlur={field.handleBlur}
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
                    <field.FormLabel>Hotel Slug (URL Path)</field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="e.g., my-luxury-hotel"
                        value={field.state.value || ""}
                        onChange={(e) => {
                          setIsSlugManuallyEdited(true);
                          field.handleChange(e.target.value);
                        }}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      The unique URL for your hotel: <b>blonsoo.com/hotel/{field.state.value || "..."}</b>
                    </p>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
            </div>
            <form.AppField
                name="brandName"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Brand Name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Enter hotel brand name"
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
                      placeholder="Enter hotel description"
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
              name="tags"
              children={(field) => (
                <field.FormItem className="pt-4">
                  <field.FormLabel className="text-lg font-bold">Property Tags & Highlights</field.FormLabel>
                  <field.FormControl>
                    <TagSelector
                      selectedTags={field.state.value || []}
                      onChange={(tags) => field.handleChange(tags)}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            {/* Address Section with Auto/Manual Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Hotel Address</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Auto Detect
                    </span>
                  </div>
                  <Switch
                    checked={isManualAddress}
                    onCheckedChange={setIsManualAddress}
                  />
                  <div className="flex items-center space-x-2">
                    <Edit3 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Manual Entry
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {!isManualAddress && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <AddressAutoComplete
                      address={address}
                      setAddress={setAddress}
                      searchInput={searchInput}
                      setSearchInput={setSearchInput}
                      dialogTitle="Enter Address"
                      placeholder="Search for your hotel address..."
                    />
                  </div>
                )}

                {(isManualAddress || address.formattedAddress) && (
                  <div className={cn(
                    "grid gap-4 animate-in fade-in slide-in-from-top-4 duration-500",
                    !isManualAddress && "opacity-80 grayscale-[0.2]"
                  )}>
                    {!isManualAddress && (
                      <div className="flex items-center gap-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <div className="h-[1px] flex-1 bg-border" />
                        Detected Address Details
                        <div className="h-[1px] flex-1 bg-border" />
                      </div>
                    )}
                    
                    <form.AppField
                      name="street"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>Street Address</field.FormLabel>
                          <field.FormControl>
                            <Input
                              disabled={isPending}
                              readOnly={!isManualAddress}
                              placeholder="Enter street address"
                              value={field.state.value || ""}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                              className={cn(!isManualAddress && "bg-muted/50 cursor-default")}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <form.AppField
                        name="city"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel>City</field.FormLabel>
                            <field.FormControl>
                              <Input
                                disabled={isPending}
                                readOnly={!isManualAddress}
                                placeholder="Enter city"
                                value={field.state.value || ""}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                className={cn(!isManualAddress && "bg-muted/50 cursor-default")}
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />

                      <form.AppField
                        name="state"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel>State/Province</field.FormLabel>
                            <field.FormControl>
                              <Input
                                disabled={isPending}
                                readOnly={!isManualAddress}
                                placeholder="Enter state/province"
                                value={field.state.value || ""}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                className={cn(!isManualAddress && "bg-muted/50 cursor-default")}
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <form.AppField
                        name="country"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel>Country</field.FormLabel>
                            <field.FormControl>
                              <Input
                                disabled={isPending}
                                readOnly={!isManualAddress}
                                placeholder="Enter country"
                                value={field.state.value || ""}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                className={cn(!isManualAddress && "bg-muted/50 cursor-default")}
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />

                      <form.AppField
                        name="postalCode"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel>Postal Code</field.FormLabel>
                            <field.FormControl>
                              <Input
                                disabled={isPending}
                                readOnly={!isManualAddress}
                                placeholder="Enter postal code"
                                value={field.state.value || ""}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                className={cn(!isManualAddress && "bg-muted/50 cursor-default")}
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <form.AppField
                        name="latitude"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel>Latitude</field.FormLabel>
                            <field.FormControl>
                              <Input
                                disabled={isPending}
                                readOnly={!isManualAddress}
                                type={isManualAddress ? "number" : "text"}
                                step="0.00000001"
                                placeholder="e.g., 40.7128"
                                value={field.state.value || ""}
                                onChange={(e) => field.handleChange(e.target.value as any)}
                                onBlur={field.handleBlur}
                                className={cn(!isManualAddress && "bg-muted/50 cursor-default")}
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
                                readOnly={!isManualAddress}
                                type={isManualAddress ? "number" : "text"}
                                step="0.00000001"
                                placeholder="e.g., -74.0060"
                                value={field.state.value || ""}
                                onChange={(e) => field.handleChange(e.target.value as any)}
                                onBlur={field.handleBlur}
                                className={cn(!isManualAddress && "bg-muted/50 cursor-default")}
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          

            {/* Error display for debugging */}
            {form.state.canSubmit === false && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm space-y-1">
                <p className="font-bold">Please fix the following issues:</p>
                <ul className="list-disc list-inside">
                  {Object.entries(form.state.fieldMeta).map(([name, meta]) =>
                    meta && meta.errors && meta.errors.length > 0 ? (
                      <li key={name}>
                        <span className="capitalize font-medium">{name}</span>:{" "}
                        {meta.errors.map((e: any) => e?.message || e).join(", ")}
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
            )}
          </CardContent>

          <CardFooter className="mt-8 flex">
            <Button
              icon={<CheckCircle2 />}
              loading={isPending}
              type="submit"
              className="w-full py-6 text-base font-semibold shadow-sm shadow-primary/5 transition-all hover:scale-[1.01] active:scale-[0.99]"
              disabled={isPending}
            >
              Complete Setup
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}

export default SetupHotel;

