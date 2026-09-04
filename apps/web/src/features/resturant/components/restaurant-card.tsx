"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManageRestaurantImages } from "./restaurant-images";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import {
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
  HashIcon,
  InfoIcon,
  LayoutGridIcon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  StarIcon,
  UserIcon,
  Settings2Icon,
  Image as ImageIcon,
  AlertCircleIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  Undo2Icon,
  ShieldCheck
} from "lucide-react";
import { useGetRestaurantBookings } from "../hooks/use-get-restaurant-bookings";
import { useUpdateRestaurantBooking } from "../hooks/use-update-restaurant-booking";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useUpdateRestaurant } from "../actions/use-update-restaurant";
import type { Restaurant } from "core/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDeleteRestaurant } from "../actions/use-delete-restaurant";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";

type Props = {
  restaurant: Restaurant;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "inactive":
      return "bg-gray-200 text-gray-600 border-gray-300";
    case "under_maintenance":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "pending_approval":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusEmoji = (status: string) => {
  switch (status) {
    case "active":
      return "🟢";
    case "inactive":
      return "⚫";
    case "under_maintenance":
      return "🟡";
    case "pending_approval":
      return "🟠";
    default:
      return "⚪";
  }
};

const formatStarRating = (rating: string | number | null) => {
  if (!rating) return "—";
  const numRating = Number(rating);
  if (isNaN(numRating)) return "—";
  const stars = "★".repeat(Math.floor(numRating));
  const emptyStars = "☆".repeat(5 - Math.floor(numRating));
  return `${stars}${emptyStars} ${numRating}`;
};

export function RestaurantCard({ restaurant }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: session } = authClient.useSession();
  const [form, setForm] = useState({
    name: restaurant.name,
    description: restaurant.description ?? "",
    brandName: restaurant.brandName ?? "",
    street: restaurant.street,
    city: restaurant.city,
    state: restaurant.state,
    country: restaurant.country,
    postalCode: restaurant.postalCode,
    latitude: restaurant.latitude ?? "",
    longitude: restaurant.longitude ?? "",
    phone: restaurant.phone ?? "",
    email: restaurant.email ?? "",
    website: restaurant.website ?? "",
    starRating: restaurant.starRating ?? "",
    checkInTime: restaurant.checkInTime ?? "",
    checkOutTime: restaurant.checkOutTime ?? "",
    cuisineType: restaurant.cuisineType ?? "",
    dressCode: restaurant.dressCode ?? "",
    totalSeats: restaurant.totalSeats?.toString() ?? "",
    allocatedSeats: restaurant.allocatedSeats?.toString() ?? "",
    breakfastPrice: restaurant.breakfastPrice ?? "",
    lunchPrice: restaurant.lunchPrice ?? "",
    dinnerPrice: restaurant.dinnerPrice ?? "",
    buffetPrice: restaurant.buffetPrice ?? "",
    pricePerSeat: restaurant.pricePerSeat ?? "",
    customPrices: Array.isArray(restaurant.customPrices) ? restaurant.customPrices : [],
    menuUrl: restaurant.menuUrl ?? "",
    status: restaurant.status,
  });

  const { mutate, isPending } = useUpdateRestaurant();
  const { mutate: deleteRestaurant, isPending: isDeleting } = useDeleteRestaurant();
  const queryClient = useQueryClient();

  // Update form when restaurant prop changes
  useEffect(() => {
    setForm({
      name: restaurant.name,
      description: restaurant.description ?? "",
      brandName: restaurant.brandName ?? "",
      street: restaurant.street,
      city: restaurant.city,
      state: restaurant.state,
      country: restaurant.country,
      postalCode: restaurant.postalCode,
      latitude: restaurant.latitude ?? "",
      longitude: restaurant.longitude ?? "",
      phone: restaurant.phone ?? "",
      email: restaurant.email ?? "",
      website: restaurant.website ?? "",
      starRating: restaurant.starRating ?? "",
      checkInTime: restaurant.checkInTime ?? "",
      checkOutTime: restaurant.checkOutTime ?? "",
      cuisineType: restaurant.cuisineType ?? "",
      dressCode: restaurant.dressCode ?? "",
      totalSeats: restaurant.totalSeats?.toString() ?? "",
      allocatedSeats: restaurant.allocatedSeats?.toString() ?? "",
      breakfastPrice: restaurant.breakfastPrice ?? "",
      lunchPrice: restaurant.lunchPrice ?? "",
      dinnerPrice: restaurant.dinnerPrice ?? "",
      buffetPrice: restaurant.buffetPrice ?? "",
      pricePerSeat: restaurant.pricePerSeat ?? "",
      customPrices: Array.isArray(restaurant.customPrices) ? restaurant.customPrices : [],
      menuUrl: restaurant.menuUrl ?? "",
      status: restaurant.status,
    });
  }, [restaurant]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      {
        id: restaurant.id,
        data: {
          ...form,
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
          cuisineType: form.cuisineType || null,
          dressCode: form.dressCode || null,
          totalSeats: form.totalSeats ? parseInt(form.totalSeats) : null,
          allocatedSeats: form.allocatedSeats ? parseInt(form.allocatedSeats) : null,
          breakfastPrice: form.breakfastPrice || null,
          lunchPrice: form.lunchPrice || null,
          dinnerPrice: form.dinnerPrice || null,
          buffetPrice: form.buffetPrice || null,
          pricePerSeat: form.pricePerSeat || null,
          customPrices: form.customPrices,
          menuUrl: form.menuUrl || null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Restaurant detailed successfully updated.");
          setActiveTab("overview");
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update restaurant data.");
        },
      }
    );
  };

  const handleDelete = () => {
    deleteRestaurant(restaurant.id, {
      onSuccess: () => {
        toast.success("Restaurant deleted successfully.");
        queryClient.invalidateQueries({ queryKey: ["myRestaurants"] });
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to delete restaurant.");
      },
    });
  };

  return (
    <div className="bg-white text-black w-full min-h-full">
      {/* Header Profile Area */}
      <div className="relative border-b border-gray-200 p-4 md:p-5 bg-blue-50/20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-gray-900">
             
              {restaurant.name}
            </h3>
            {restaurant.brandName && (
              <p className="text-gray-500 text-sm">
                Brand: <span className="font-medium text-gray-700">{restaurant.brandName}</span>
              </p>

              
            )}

            

            {/* <div className="flex items-center gap-3 mt-3 ml-[52px] flex-wrap">
              <Badge
                variant="outline"
                className={`${getStatusColor(restaurant.status)} px-2 py-0.5 text-[11px] font-semibold`}
              >
                {getStatusEmoji(restaurant.status)}{" "}
                {restaurant.status.replace("_", " ").toUpperCase()}
              </Badge>
              <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
                <CalendarIcon className="w-3.5 h-3.5" />
                Added {formatDistanceToNow(new Date(restaurant.createdAt))} ago
              </span>
            </div> */}
            

            <div className="relative  bg-blue-50/20">
  <div className="flex items-center justify-between">
    
    {/* Left Section */}
    <div className="flex items-start gap-3 flex-1">
      
     

      {/* Content */}
      <div className="flex flex-row justify-between item-center">
        

       

        {/* Meta Row */}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <Badge
            variant="outline"
            className={`${getStatusColor(restaurant.status)} px-2 py-0.5 text-[11px] font-semibold`}
          >
            {getStatusEmoji(restaurant.status)}{" "}
            {restaurant.status.replace("_", " ").toUpperCase()}
          </Badge>

          <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
            <CalendarIcon className="w-3.5 h-3.5" />
            Added{" "}
            {formatDistanceToNow(new Date(restaurant.createdAt))} ago
          </span>
        </div>

      </div>
    </div>

  </div>
</div>
          </div>
          {restaurant.starRating && (
            <div className="text-right bg-white p-3 rounded-xl border border-gray-100 mt-1">
              <div className="text-xl font-bold text-amber-500 tracking-wider">
                {formatStarRating(restaurant.starRating)}
              </div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Classification</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 bg-gray-100/80 p-1 rounded-lg">
            <TabsTrigger value="overview" className="rounded-md text-xs font-medium py-1.5">
              <InfoIcon className="w-3.5 h-3.5 mr-1.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-md text-xs font-medium py-1.5">
               <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
               Bookings
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-md text-xs font-medium py-1.5">
              <Settings2Icon className="w-3.5 h-3.5 mr-1.5" />
              Config
            </TabsTrigger>
            <TabsTrigger value="gallery" className="rounded-md text-xs font-medium py-1.5">
               <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
               Gallery
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="focus-visible:outline-none space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Description */}
            {restaurant.description && (
              <div className="bg-gray-50/80 rounded-xl p-3 md:p-4 border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-200">
                    <InfoIcon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mt-0.5">
                    {restaurant.description}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column Data */}
              <div className="space-y-4">
                {/* Location */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPinIcon className="w-3.5 h-3.5" /> Location
                  </h3>
                  <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 space-y-3">
                    <div className="flex gap-2">
                      <span className="text-xs font-medium text-gray-400 w-20 shrink-0">Address</span>
                      <div className="text-sm text-gray-900 font-medium">
                        <p>{restaurant.street}</p>
                        <p>{restaurant.city}{restaurant.state ? `, ${restaurant.state}` : ""}</p>
                        <p>{restaurant.country} {restaurant.postalCode}</p>
                      </div>
                    </div>
                    {restaurant.latitude && restaurant.longitude && (
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <span className="text-xs font-medium text-gray-400 w-20 shrink-0">Coords</span>
                        <div className="text-xs text-gray-900 font-mono bg-gray-50 px-1.5 py-0.5 rounded inline-block">
                          {restaurant.latitude}, {restaurant.longitude}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* System Information */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HashIcon className="w-3.5 h-3.5" /> Metrics
                  </h3>
                  <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-500">Restaurant ID</span>
                      <span className="font-mono text-gray-900">{restaurant.id}</span>
                    </div>
                
                    <div className="flex justify-between items-center pt-1 border-t border-gray-50">
                      <span className="font-medium text-gray-500">Created</span>
                      <span className="text-gray-900 font-medium">{new Date(restaurant.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
              </div>

              {/* Right Column Data */}
              <div className="space-y-4">
                {/* Contact Information */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <PhoneIcon className="w-3.5 h-3.5" /> Connectivity
                  </h3>
                  <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 space-y-3">
                    {restaurant.phone ? (
                       <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                         <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                           <PhoneIcon className="w-3.5 h-3.5 text-gray-500" />
                         </div>
                         <div>
                           <p className="text-[10px] font-semibold text-gray-400 uppercase">Phone</p>
                           <a href={`tel:${restaurant.phone}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">{restaurant.phone}</a>
                         </div>
                       </div>
                    ) : <div className="text-xs text-gray-400 italic">No phone</div>}

                    {restaurant.email ? (
                       <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                         <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                           <MailIcon className="w-3.5 h-3.5 text-gray-500" />
                         </div>
                         <div>
                           <p className="text-[10px] font-semibold text-gray-400 uppercase">Email</p>
                           <a href={`mailto:${restaurant.email}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">{restaurant.email}</a>
                         </div>
                       </div>
                    ) : <div className="text-xs text-gray-400 italic">No email</div>}

                    {restaurant.website ? (
                       <div className="flex items-center gap-3">
                         <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                           <GlobeIcon className="w-3.5 h-3.5 text-gray-500" />
                         </div>
                         <div>
                           <p className="text-[10px] font-semibold text-gray-400 uppercase">Website</p>
                           <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                             Visit Site &rarr;
                           </a>
                         </div>
                       </div>
                    ) : <div className="text-xs text-gray-400 italic flex items-center gap-2"><GlobeIcon className="w-3.5 h-3.5" /> No website</div>}
                  </div>
                </div>

                {/* Operations */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ClockIcon className="w-3.5 h-3.5" /> Hours
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check-in</p>
                        <p className="text-base font-bold text-gray-900">{restaurant.checkInTime || "—"}</p>
                     </div>
                     <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check-out</p>
                        <p className="text-base font-bold text-gray-900">{restaurant.checkOutTime || "—"}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings" className="focus-visible:outline-none space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <RestaurantBookingsTab restaurant={restaurant} />
          </TabsContent>

          {/* SETTINGS / CONFIGURATION TAB */}
          <TabsContent value="settings" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <form onSubmit={handleUpdate} className="space-y-6 bg-white border border-gray-200 rounded-xl p-4 md:p-6">
              <div className="border-b border-gray-100 pb-4">
                 <h2 className="text-lg font-bold text-gray-900">Settings</h2>
                 <p className="text-xs text-gray-500 mt-0.5">Modify identity and parameters.</p>
              </div>

              {/* General Config */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 flex flex-col">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Name</label>
                    <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} required disabled={isPending} className="bg-gray-50/50 h-9" />
                  </div>
                  <div className="space-y-1 flex flex-col">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Brand / Chain</label>
                    <Input value={form.brandName} onChange={(e) => handleChange("brandName", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                  </div>
                </div>

                <div className="space-y-1 flex flex-col">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Description</label>
                  <Textarea rows={3} value={form.description} onChange={(e) => handleChange("description", e.target.value)} disabled={isPending} className="resize-none bg-gray-50/50 text-sm" />
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Location Data */}
              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-gray-900">Location</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1 flex flex-col">
                     <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Street</label>
                     <Input value={form.street} onChange={(e) => handleChange("street", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1 flex flex-col">
                       <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">City</label>
                       <Input value={form.city} onChange={(e) => handleChange("city", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                     </div>
                     <div className="space-y-1 flex flex-col">
                       <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">State / Prov</label>
                       <Input value={form.state} onChange={(e) => handleChange("state", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                     </div>
                   </div>
                   <div className="space-y-1 flex flex-col">
                     <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Country</label>
                     <Input value={form.country} onChange={(e) => handleChange("country", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                   </div>
                   <div className="space-y-1 flex flex-col">
                     <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Postal Code</label>
                     <Input value={form.postalCode} onChange={(e) => handleChange("postalCode", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                   </div>
                   <div className="space-y-1 flex flex-col">
                     <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Latitude</label>
                     <Input type="number" step="any" value={form.latitude} onChange={(e) => handleChange("latitude", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                   </div>
                   <div className="space-y-1 flex flex-col">
                     <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Longitude</label>
                     <Input type="number" step="any" value={form.longitude} onChange={(e) => handleChange("longitude", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                   </div>
                 </div>
              </div>

              <hr className="border-gray-100" />

              {/* Administrative */}
              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-gray-900">Administrative</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1 flex flex-col">
                     <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Phone</label>
                     <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                   </div>
                   <div className="space-y-1 flex flex-col">
                     <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Email</label>
                     <Input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                   </div>
                   <div className="space-y-1 flex flex-col">
                     <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Website</label>
                     <Input type="url" value={form.website} onChange={(e) => handleChange("website", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                   </div>
                    <div className="space-y-1 flex flex-col">
                     <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Star Rating</label>
                     <Input type="number" min="1" max="5" step="0.1" value={form.starRating} onChange={(e) => handleChange("starRating", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                   </div>
                   <div className="space-y-1 flex flex-col">
                     <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Opening Time</label>
                     <Input type="time" value={form.checkInTime} onChange={(e) => handleChange("checkInTime", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                   </div>
                   <div className="space-y-1 flex flex-col">
                     <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Closing Time</label>
                     <Input type="time" value={form.checkOutTime} onChange={(e) => handleChange("checkOutTime", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                   </div>
                   <div className="space-y-1 flex flex-col">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Listing Status</label>
                      <select 
                        value={form.status} 
                        onChange={(e) => handleChange("status", e.target.value)} 
                        disabled={isPending}
                        className="flex h-9 w-full rounded-md border border-input bg-gray-50/50 px-3 py-1.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="active">🟢 Active</option>
                        <option value="inactive">⚫ Inactive</option>
                        <option value="under_maintenance">🟡 Under Maintenance</option>
                        <option value="pending_approval">🟠 Pending Approval</option>
                      </select>
                    </div>
                  </div>
               </div>

               <hr className="border-gray-100" />

               {/* Dining & Capacity */}
               <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Dining & Capacity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1 flex flex-col">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Cuisine Type</label>
                      <Input value={form.cuisineType} onChange={(e) => handleChange("cuisineType", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Dress Code</label>
                      <Input value={form.dressCode} onChange={(e) => handleChange("dressCode", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Total Seats</label>
                      <Input type="number" value={form.totalSeats} onChange={(e) => handleChange("totalSeats", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Allocated Seats</label>
                      <Input type="number" value={form.allocatedSeats} onChange={(e) => handleChange("allocatedSeats", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                    </div>
                  </div>
               </div>

               <hr className="border-gray-100" />

               {/* Pricing & Menu */}
               <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Pricing & Menu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1 flex flex-col">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Breakfast Price</label>
                      <Input type="number" step="0.01" value={form.breakfastPrice} onChange={(e) => handleChange("breakfastPrice", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Lunch Price</label>
                      <Input type="number" step="0.01" value={form.lunchPrice} onChange={(e) => handleChange("lunchPrice", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Dinner Price</label>
                      <Input type="number" step="0.01" value={form.dinnerPrice} onChange={(e) => handleChange("dinnerPrice", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Buffet Price</label>
                      <Input type="number" step="0.01" value={form.buffetPrice} onChange={(e) => handleChange("buffetPrice", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                    </div>
                    <div className="space-y-1 flex flex-col lg:col-span-2">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Menu URL</label>
                      <Input type="url" value={form.menuUrl} onChange={(e) => handleChange("menuUrl", e.target.value)} disabled={isPending} className="bg-gray-50/50 h-9" />
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200/60 shadow-sm">
                    <div className="flex items-start gap-4">
                      <AlertCircleIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-amber-900">Anti-Fraud Chair Booking Deposit</h4>
                        <p className="text-xs text-amber-800/80 mt-1.5 leading-relaxed max-w-3xl">
                          To eliminate fraudulent reservations and prevent no-shows, customers must pay a temporary deposit per booked chair.
                          Upon arrival at your restaurant, you can trigger a <strong>100% refund</strong> back to the customer.
                          <span className="block mt-1 font-medium text-amber-900">
                            Note: Reseror will charge a small platform commission from your hotel account for providing this security service.
                          </span>
                        </p>
                        <div className="mt-4 w-full sm:w-1/2 space-y-1 flex flex-col">
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">Deposit Price Per Chair</label>
                          <Input type="number" step="0.01" value={form.pricePerSeat} onChange={(e) => handleChange("pricePerSeat", e.target.value)} placeholder="e.g. 5.00" disabled={isPending} className="bg-white border-amber-200 shadow-sm h-9" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Custom Prices</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Add special menu items or custom pricing categories.</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setForm(prev => ({ ...prev, customPrices: [...prev.customPrices, { label: "", price: 0 }] as any }))} 
                        className="gap-2 bg-white"
                        disabled={isPending}
                      >
                        <PlusCircleIcon className="w-4 h-4" />
                        Add Price
                      </Button>
                    </div>
                    
                    {form.customPrices.length === 0 ? (
                      <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg bg-white text-gray-400 text-sm">
                        No custom prices added.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {form.customPrices.map((cp: any, idx: number) => (
                          <div key={idx} className="flex flex-col sm:flex-row items-end gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex-1 w-full space-y-1">
                              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Label</label>
                              <Input 
                                value={cp.label} 
                                onChange={(e) => {
                                  const newPrices = [...form.customPrices];
                                  newPrices[idx].label = e.target.value;
                                  setForm(prev => ({ ...prev, customPrices: newPrices as any }));
                                }} 
                                placeholder="e.g. Kids Meal" 
                                disabled={isPending}
                                className="h-9"
                              />
                            </div>
                            <div className="flex-1 w-full space-y-1">
                              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Price</label>
                              <Input 
                                type="number" 
                                step="0.01" 
                                value={cp.price} 
                                onChange={(e) => {
                                  const newPrices = [...form.customPrices];
                                  newPrices[idx].price = parseFloat(e.target.value) || 0;
                                  setForm(prev => ({ ...prev, customPrices: newPrices as any }));
                                }} 
                                placeholder="0.00" 
                                disabled={isPending}
                                className="h-9"
                              />
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              onClick={() => {
                                const newPrices = form.customPrices.filter((_: any, i: number) => i !== idx);
                                setForm(prev => ({ ...prev, customPrices: newPrices as any }));
                              }}
                              disabled={isPending}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-3"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
               </div>

               <div className="pt-2 flex justify-between items-center">
                 <AlertDialog>
                   <AlertDialogTrigger asChild>
                     <Button type="button" variant="ghost" disabled={isDeleting} className="h-10 px-4 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 font-medium text-sm gap-2">
                       <Trash2Icon className="w-3.5 h-3.5" />
                       Delete Restaurant
                     </Button>
                   </AlertDialogTrigger>
                   <AlertDialogContent>
                     <AlertDialogHeader>
                       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                       <AlertDialogDescription>
                         This action cannot be undone. This will permanently delete the 
                         <strong> {restaurant.name}</strong> and remove all associated data from our servers.
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                       <AlertDialogAction 
                         onClick={handleDelete}
                         className="bg-red-600 hover:bg-red-700 text-white"
                       >
                         {isDeleting ? "Deleting..." : "Delete Permanently"}
                       </AlertDialogAction>
                     </AlertDialogFooter>
                   </AlertDialogContent>
                 </AlertDialog>

                 <Button type="submit" loading={isPending} disabled={isPending || isDeleting} className="h-10 px-6 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm">
                   <PencilIcon className="w-3.5 h-3.5 mr-2" />
                   Save Changes
                 </Button>
               </div>
            </form>
          </TabsContent>

          {/* GALLERY TAB */}
          <TabsContent value="gallery" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
               <div className="mb-4 pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                    <LayoutGridIcon className="w-4 h-4 text-gray-400" />
                    Visuals
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Upload and adjust imagery to attract clients visually.</p>
               </div>
               <ManageRestaurantImages restaurantId={restaurant.id} />
             </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

const RestaurantBookingsTab = ({ restaurant }: { restaurant: Restaurant }) => {
  const { data: bookings, isLoading } = useGetRestaurantBookings(restaurant.id);
  const { mutate: updateStatus, isPending } = useUpdateRestaurantBooking();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading reservations...</p>
      </div>
    );
  }

  const handleStatusUpdate = (id: string, status: "arrived" | "no_show") => {
    updateStatus({ id, status }, {
      onSuccess: () => {
        toast.success(status === "arrived" ? "Guest checked in! Refund initiated." : "Guest marked as no-show.");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Current Reservations</h3>
          <p className="text-xs text-gray-500">Manage your guest check-ins and deposits.</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {bookings?.length || 0} Total
        </Badge>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider">Date & Time</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider">Chairs</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider">Deposit</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-center">Status</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <CalendarIcon className="w-8 h-8 text-gray-300" />
                    <p className="text-sm text-gray-400">No reservations found yet.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              bookings?.map((booking: any) => (
                <TableRow key={booking.id} className="group transition-colors hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
                      </span>
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {format(new Date(booking.bookingDate), "hh:mm a")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-bold">
                      {booking.numberOfChairs}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-bold text-gray-900">${booking.totalDeposit}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5",
                        booking.status === "pending" && "bg-amber-100 text-amber-700 border-amber-200",
                        booking.status === "arrived" && "bg-green-100 text-green-700 border-green-200",
                        booking.status === "no_show" && "bg-red-100 text-red-700 border-red-200",
                        booking.status === "refunded" && "bg-blue-100 text-blue-700 border-blue-200"
                      )}
                    >
                      {booking.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(booking.id, "no_show")}
                          disabled={isPending}
                        >
                          <XCircleIcon className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50 font-bold text-[11px]"
                          onClick={() => handleStatusUpdate(booking.id, "arrived")}
                          disabled={isPending}
                        >
                          <CheckCircleIcon className="w-3.5 h-3.5 mr-1.5" />
                          Mark Arrived
                        </Button>
                      </div>
                    ) : booking.status === "arrived" ? (
                       <span className="text-[11px] font-bold text-green-600 flex items-center justify-end">
                         <CheckCircleIcon className="w-3.5 h-3.5 mr-1" /> Checked In
                       </span>
                    ) : (
                      <span className="text-[11px] font-bold text-gray-400">Processed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
        <AlertTriangleIcon className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <h4 className="text-[13px] font-bold text-amber-900">Anti-Fraud Protection</h4>
          <p className="text-[11px] text-amber-800 leading-relaxed mt-1">
            When you mark a guest as <strong>"Arrived"</strong>, their deposit will be automatically queued for refund. 
            No-shows will result in the deposit being processed according to platform policy.
          </p>
        </div>
      </div>
    </div>
  );
};
