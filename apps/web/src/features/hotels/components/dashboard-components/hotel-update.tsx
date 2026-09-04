"use client";

import { Button } from "@/components/ui/button";
import {
  Building2,
  CheckCircle,
  Clock,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Star,
  Tag,
  Edit3,
  Navigation,
} from "lucide-react";
import React, { memo, useCallback, useEffect, useState, useMemo } from "react";
import { useSaveRegistry } from "../../context/save-context";
import { useGetHotelTypes } from "../../queries/use-get-hotel-types";
import { useGetPropertyClasses } from "../../queries/use-get-property-classes";
import {
  UpdateHotelPayload,
  useGetHotelByID,
  useGetMyHotel,
  useUpdateHotelByID,
} from "../../queries/use-update-hotel-by-id";
import AddressAutoComplete, { AddressType } from "@/components/address-autocomplete";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type OptionalHotelPayload = Partial<UpdateHotelPayload> & { name: string };

const InputField = memo(({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  name,
}: {
  label: string;
  value: string | number | undefined;
  onChange: (name: any, value: any) => void;
  type?: string;
  required?: boolean;
  icon?: React.ElementType; // Kept for interface compatibility but ignored in UI
  placeholder?: string;
  name: string;
}) => (
  <div className="space-y-1.5 flex flex-col">
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      {label}
      {required && <span className="text-rose-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(name, type === "number" ? (e.target.value === "" ? undefined : Number(e.target.value)) : e.target.value)}
      required={required}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-md text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
    />
  </div>
));
InputField.displayName = "InputField";

const SelectField = memo(({
  label,
  value,
  onChange,
  children,
  name,
}: {
  label: string;
  value: string | undefined;
  onChange: (name: any, value: any) => void;
  children: React.ReactNode;
  icon?: React.ElementType;
  name: string;
}) => (
  <div className="space-y-1.5 flex flex-col">
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      {label}
    </label>
    <select
      value={value ?? ""}
      onChange={(e) => onChange(name, e.target.value || undefined)}
      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
    >
      {children}
    </select>
  </div>
));
SelectField.displayName = "SelectField";

const TextareaField = memo(({
  label,
  value,
  onChange,
  placeholder = "",
  name,
}: {
  label: string;
  value: string | undefined;
  onChange: (name: any, value: any) => void;
  icon?: React.ElementType;
  placeholder?: string;
  name: string;
}) => (
  <div className="space-y-1.5 h-full flex flex-col">
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      {label}
    </label>
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(name, e.target.value)}
      rows={5}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-md text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors resize-none flex-grow"
    />
  </div>
));
TextareaField.displayName = "TextareaField";

const SectionCard = memo(({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="p-6 bg-white border border-slate-200 rounded-xl">
    <div className="mb-6 pb-4 border-b border-slate-100 flex flex-col">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
    {children}
  </div>
));
SectionCard.displayName = "SectionCard";

export function HotelUpdate({ hotelId }: { hotelId?: string }) {
  const myHotelQuery = useGetMyHotel();
  const hotelByIdQuery = useGetHotelByID(hotelId || "");

  const { data: myHotel, isLoading } = hotelId ? hotelByIdQuery : myHotelQuery;
  const { mutate, isPending } = useUpdateHotelByID();
  const { data: hotelTypes, isLoading: isHotelTypesLoading } =
    useGetHotelTypes();
  const { data: propertyClasses, isLoading: isPropertyClassesLoading } =
    useGetPropertyClasses();

  const { register, unregister } = useSaveRegistry();

  const [form, setForm] = useState<OptionalHotelPayload>({
    name: "",
    description: "",
    brandName: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    latitude: undefined,
    longitude: undefined,
    phone: "",
    email: "",
    website: "",
    hotelType: "",
    starRating: undefined,
    propertyClass: "",
    checkInTime: "",
    checkInEnd: "",
    checkOutStart: "",
    checkOutTime: "",
    status: "active" as any,
    formattedAddress: "",
    commissionRate: undefined,
  });

  const [searchInput, setSearchInput] = useState("");
  const [isManualAddress, setIsManualAddress] = useState(false);
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

  useEffect(() => {
    if (myHotel) {
      setForm({
        name: myHotel.name ?? "",
        description: myHotel.description ?? "",
        brandName: myHotel.brandName ?? "",
        street: myHotel.street ?? "",
        city: myHotel.city ?? "",
        state: myHotel.state ?? "",
        country: myHotel.country ?? "",
        postalCode: myHotel.postalCode ?? "",
        latitude:
          myHotel.latitude !== undefined && myHotel.latitude !== null
            ? Number(myHotel.latitude)
            : undefined,
        longitude:
          myHotel.longitude !== undefined && myHotel.longitude !== null
            ? Number(myHotel.longitude)
            : undefined,
        phone: myHotel.phone ?? "",
        email: myHotel.email ?? "",
        website: myHotel.website ?? "",
        hotelType: myHotel.hotelType?.id ?? "",
        starRating: myHotel.starRating ? Number(myHotel.starRating) : undefined,
        propertyClass: myHotel.propertyClass?.id ?? "",
        checkInTime: myHotel.checkInTime ?? "",
        checkInEnd: myHotel.checkInEnd ?? "",
        checkOutStart: myHotel.checkOutStart ?? "",
        checkOutTime: myHotel.checkOutTime ?? "",
        status: (myHotel.status as any) ?? "active",
        formattedAddress: myHotel.formattedAddress ?? "",
        commissionRate: myHotel.commissionRate ? Number(myHotel.commissionRate) : undefined,
      });

      if (myHotel.formattedAddress) {
        setAddress({
          address1: myHotel.street ?? "",
          address2: "",
          formattedAddress: myHotel.formattedAddress,
          city: myHotel.city ?? "",
          region: myHotel.state ?? "",
          postalCode: myHotel.postalCode ?? "",
          country: myHotel.country ?? "",
          lat: myHotel.latitude ? Number(myHotel.latitude) : 0,
          lng: myHotel.longitude ? Number(myHotel.longitude) : 0,
        });
      }
    }
  }, [myHotel]);

  // Sync address state with form values - only if changed and visible
  useEffect(() => {
    if (!isManualAddress && address.formattedAddress) {
      setForm((prev) => {
        const hasChanged = 
          prev.street !== address.address1 ||
          prev.city !== address.city ||
          prev.state !== (address.region || "") ||
          prev.country !== address.country ||
          prev.postalCode !== (address.postalCode || "") ||
          prev.latitude !== (address.lat !== undefined ? address.lat : undefined) ||
          prev.longitude !== (address.lng !== undefined ? address.lng : undefined) ||
          prev.formattedAddress !== (address.formattedAddress || "");

        if (!hasChanged) return prev;

        return {
          ...prev,
          street: address.address1,
          city: address.city,
          state: address.region || "",
          country: address.country,
          postalCode: address.postalCode || "",
          latitude: address.lat !== undefined ? address.lat : undefined,
          longitude: address.lng !== undefined ? address.lng : undefined,
          formattedAddress: address.formattedAddress || "",
        };
      });
    }
  }, [address, isManualAddress]);

  const handleChange = useCallback(
    (field: keyof OptionalHotelPayload, value: any) => {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleHotelTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleChange("hotelType", e.target.value || undefined);
    },
    [handleChange]
  );

  const handlePropertyClassChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleChange("propertyClass", e.target.value || undefined);
    },
    [handleChange]
  );

  const isFormDirty = useMemo(() => {
    if (!myHotel) return false;

    const normalizeString = (val: any) => (val === null || val === undefined ? "" : String(val).trim());
    const normalizeNumber = (val: any) => (val === null || val === undefined || val === "" ? undefined : Number(val));

    return (
      normalizeString(form.name) !== normalizeString(myHotel.name) ||
      normalizeString(form.description) !== normalizeString(myHotel.description) ||
      normalizeString(form.brandName) !== normalizeString(myHotel.brandName) ||
      normalizeString(form.street) !== normalizeString(myHotel.street) ||
      normalizeString(form.city) !== normalizeString(myHotel.city) ||
      normalizeString(form.state) !== normalizeString(myHotel.state) ||
      normalizeString(form.country) !== normalizeString(myHotel.country) ||
      normalizeString(form.postalCode) !== normalizeString(myHotel.postalCode) ||
      normalizeNumber(form.latitude) !== normalizeNumber(myHotel.latitude) ||
      normalizeNumber(form.longitude) !== normalizeNumber(myHotel.longitude) ||
      normalizeString(form.phone) !== normalizeString(myHotel.phone) ||
      normalizeString(form.email) !== normalizeString(myHotel.email) ||
      normalizeString(form.website) !== normalizeString(myHotel.website) ||
      normalizeString(form.hotelType) !== normalizeString(myHotel.hotelType?.id) ||
      normalizeNumber(form.starRating) !== normalizeNumber(myHotel.starRating) ||
      normalizeString(form.propertyClass) !== normalizeString(myHotel.propertyClass?.id) ||
      normalizeString(form.checkInTime) !== normalizeString(myHotel.checkInTime) ||
      normalizeString(form.checkInEnd) !== normalizeString(myHotel.checkInEnd) ||
      normalizeString(form.checkOutStart) !== normalizeString(myHotel.checkOutStart) ||
      normalizeString(form.checkOutTime) !== normalizeString(myHotel.checkOutTime) ||
      normalizeString(form.status) !== normalizeString(myHotel.status) ||
      normalizeNumber(form.commissionRate) !== normalizeNumber(myHotel.commissionRate)
    );
  }, [form, myHotel]);

  const { mutateAsync } = useUpdateHotelByID();

  useEffect(() => {
    register({
      id: "hotel-update",
      isDirty: isFormDirty,
      onSave: async () => {
        if (myHotel?.id && form.name.trim()) {
          await mutateAsync({ id: myHotel.id, data: form as any });
        }
      },
    });
    return () => unregister("hotel-update");
  }, [register, unregister, isFormDirty, form, myHotel, mutateAsync]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (myHotel?.id && form.name.trim()) {
        mutateAsync({ id: myHotel.id, data: form as any });
      }
    },
    [myHotel?.id, form, mutateAsync]
  );

  if (isLoading || isHotelTypesLoading || isPropertyClassesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading your property...</p>
        </div>
      </div>
    );
  }

  if (!myHotel) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Property Found</h3>
          <p className="text-sm text-slate-500">
            You don't have a configured hotel profile associated with your account yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-2">
            Update Property
          </h1>
          <p className="text-sm text-slate-500">
            Ensure your property details are accurate for optimal conversions.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard
          title="General Information"
          description="The essential details guests see first when viewing your property."
          icon={Building2}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InputField
                label="Property Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                icon={Building2}
                placeholder="e.g. The Grand View Hotel"
              />
              <InputField
                label="Brand or Chain Name"
                name="brandName"
                value={form.brandName ?? ""}
                onChange={handleChange}
                icon={Tag}
                placeholder="e.g. Marriott International"
              />
            </div>
            <div>
              <TextareaField
                label="Property Description"
                name="description"
                value={form.description ?? ""}
                onChange={handleChange}
                placeholder="Highlight what makes your property unique..."
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Location Details"
          description="Help guests find you easily with precise location and coordinates."
          icon={MapPin}
        >
          <div className="flex items-center justify-between mb-6 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-600">Property Location</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className={cn("text-[10px] font-bold uppercase tracking-wider transition-colors", !isManualAddress ? "text-slate-900" : "text-slate-400")}>
                  Auto Detect
                </span>
              </div>
              <Switch
                checked={isManualAddress}
                onCheckedChange={setIsManualAddress}
              />
              <div className="flex items-center space-x-2">
                <Edit3 className={cn("w-3.5 h-3.5 transition-colors", isManualAddress ? "text-slate-900" : "text-slate-400")} />
                <span className={cn("text-[10px] font-bold uppercase tracking-wider transition-colors", isManualAddress ? "text-slate-900" : "text-slate-400")}>
                  Manual Entry
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {!isManualAddress ? (
                <div className="space-y-1.5 flex flex-col animate-in fade-in duration-300">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Search Address
                  </label>
                  <AddressAutoComplete
                    address={address}
                    setAddress={setAddress}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    dialogTitle="Enter Address"
                    placeholder="Search for your hotel address..."
                  />
                </div>
              ) : (
                <InputField
                  label="Street Address"
                  name="street"
                  value={form.street ?? ""}
                  onChange={handleChange}
                  icon={MapPin}
                  placeholder="123 Main Street"
                />
              )}
              
              <div className={cn(
                "grid grid-cols-2 gap-4 transition-all duration-300",
                !isManualAddress && "opacity-60 grayscale-[0.5]"
              )}>
                <InputField
                  label="City"
                  name="city"
                  value={form.city ?? ""}
                  onChange={handleChange}
                  placeholder="City"
                />
                <InputField
                  label="State/Province"
                  name="state"
                  value={form.state ?? ""}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>
              <div className={cn(
                "grid grid-cols-2 gap-4 transition-all duration-300",
                !isManualAddress && "opacity-60 grayscale-[0.5]"
              )}>
                <InputField
                  label="Country"
                  name="country"
                  value={form.country ?? ""}
                  onChange={handleChange}
                  placeholder="Country"
                />
                <InputField
                  label="Postal Code"
                  name="postalCode"
                  value={form.postalCode ?? ""}
                  onChange={handleChange}
                  placeholder="ZIP / Postal"
                />
              </div>
            </div>
            <div className={cn(
                "space-y-4 transition-all duration-300",
                !isManualAddress && "opacity-60 grayscale-[0.5]"
              )}>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-start gap-3 mt-1 mb-4">
                <Navigation className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Map Coordinates</h4>
                  <p className="text-xs text-slate-500">Provide exact coordinates to improve search visibility.</p>
                </div>
              </div>
              <InputField
                label="Latitude"
                name="latitude"
                value={form.latitude ?? ""}
                onChange={handleChange}
                type="number"
                placeholder="-34.6037"
              />
              <InputField
                label="Longitude"
                name="longitude"
                value={form.longitude ?? ""}
                onChange={handleChange}
                type="number"
                placeholder="-58.3816"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Contact Options"
          description="How guests can get in touch with your front desk."
          icon={Phone}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Phone Number"
              name="phone"
              value={form.phone ?? ""}
              onChange={handleChange}
              icon={Phone}
              placeholder="+1 234 567 8900"
            />
            <InputField
              label="Email Address"
              name="email"
              value={form.email ?? ""}
              onChange={handleChange}
              icon={Mail}
              placeholder="reservations@hotel.com"
            />
            <div className="md:col-span-2">
              <InputField
                label="Official Website"
                name="website"
                value={form.website ?? ""}
                onChange={handleChange}
                icon={Globe}
                placeholder="https://www.yourhotel.com"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Classification & Status"
          description="Administrative and categorization settings for accurate filtering."
          icon={Tag}
        > 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <SelectField
                label="Property Type"
                name="hotelType"
                value={form.hotelType ?? ""}
                onChange={handleChange}
                icon={Building2}
              >
                <option value="">Select an option</option>
                {hotelTypes?.map((type: { id: string; name: string }) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </SelectField>

              <SelectField
                label="Property Class"
                name="propertyClass"
                value={form.propertyClass ?? ""}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                {propertyClasses?.map((pc: { id: string; name: string }) => (
                  <option key={pc.id} value={pc.id}>{pc.name}</option>
                ))}
              </SelectField>

              <InputField
                label="Star Rating"
                name="starRating"
                value={form.starRating ?? ""}
                onChange={handleChange}
                type="number"
                icon={Star}
                placeholder="e.g. 4 or 5"
              />

              <SelectField
                label="Listing Status"
                name="status"
                value={form.status ?? ""}
                onChange={handleChange}
                icon={CheckCircle}
              >
                <option value="">Select an option</option>
                <option value="active">Active Listing</option>
                <option value="inactive">Inactive</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="pending_approval">Pending Approval</option>
              </SelectField>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Check-In Window</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="From"
                    name="checkInTime"
                    type="time"
                    value={form.checkInTime ?? "15:00"}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Until"
                    name="checkInEnd"
                    type="time"
                    value={form.checkInEnd ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Check-Out Window</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="From"
                    name="checkOutStart"
                    type="time"
                    value={form.checkOutStart ?? ""}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Until"
                    name="checkOutTime"
                    type="time"
                    value={form.checkOutTime ?? "11:00"}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          </SectionCard>
        <SectionCard
          title="Revenue Management"
          description="Configure financial settings and commission overrides for this property."
        >
          <div className="max-w-md">
            <InputField
              label="Commission Override (%)"
              name="commissionRate"
              type="number"
              value={form.commissionRate ?? ""}
              onChange={handleChange}
              placeholder="e.g. 10.00"
            />
            <p className="text-[10px] text-slate-400 mt-2 italic">
              Leave blank to use the global site default rate.
            </p>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}
