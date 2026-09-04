"use client";

import { useState, useCallback, useMemo } from "react";
import { useCreateRoomBooking } from "@/features/roomBookings/hooks/create-room-booking";
import { adminBookingCreateSchema, type AdminBookingCreateValues } from "../../schemas/booking.schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppForm } from "@/components/ui/tanstack-form";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  Hotel,
  Loader2,
  Mail,
  Phone,
  Plus,
  Search,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetHotels } from "@/features/hotels/queries/use-get-hotels";
import { useGetRoomTypes } from "@/features/hotels/queries/rooms.query";
import { useGetUsers } from "@/features/admin/users-management/api/use-get-users";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

interface CreateRoomBookingProps {
  onSuccess?: () => void;
}

const defaultValues: AdminBookingCreateValues = {
  hotelId: "",
  roomTypeId: "",
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  checkInDate: "",
  checkOutDate: "",
  numRooms: 1,
  numAdults: 1,
  numChildren: 0,
  totalAmount: "",
  commissionAmount: "",
  netPayableToHotel: "",
  currency: "LKR",
  paymentType: "cash",
  isPaid: false,
  specialRequests: "",
  notes: "",
};

export function CreateRoomBooking({ onSuccess }: CreateRoomBookingProps) {
  const router = useRouter();
  const { mutate, isPending } = useCreateRoomBooking();

  // Search states
  const [hotelOpen, setHotelOpen] = useState(false);
  const [hotelSearch, setHotelSearch] = useState("");
  const [userOpen, setUserOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  // Queries
  const { data: hotelsData, isLoading: hotelsLoading } = useGetHotels({
    search: hotelSearch,
    limit: "10",
  });

  const { data: usersData, isLoading: usersLoading } = useGetUsers({
    search: userSearch,
    limit: 10,
  });

  const form = useAppForm({
    validators: { onChange: adminBookingCreateSchema as any },
    defaultValues,
    onSubmit: ({ value }) => {
      mutate(value as any, {
        onSuccess: () => {
          toast.success("Booking created successfully");
          form.reset();
          onSuccess?.() || router.push("/admin/roomBookings");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create booking");
        },
      });
    },
  });

  // Track field values manually if useStore has type issues
  const [selectedHotelId, setSelectedHotelId] = useState("");

  const { data: roomTypesData, isLoading: roomTypesLoading } = useGetRoomTypes({
    hotelId: selectedHotelId,
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Card className="w-full max-w-4xl border border-zinc-200 bg-white shadow-sm font-sans">
      <CardHeader className="border-b border-zinc-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white">
            <Plus className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">
              Create New Booking
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Enter the details to create a manual room booking.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form.AppForm>
        <form onSubmit={handleSubmit} className="divide-y divide-zinc-100">
          <CardContent className="space-y-8 py-8 px-6 md:px-8">
            {/* Section: Hotel & Room Type */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Placement Details
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <form.AppField
                  name="hotelId"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="text-xs font-bold text-zinc-700">
                        Select Hotel
                      </field.FormLabel>
                      <field.FormControl>
                        <Popover open={hotelOpen} onOpenChange={setHotelOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="h-11 w-full justify-between border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Hotel className="h-4 w-4 text-zinc-400" />
                                {field.state.value
                                  ? hotelsData?.data?.find(
                                      (h: any) => h.id === field.state.value
                                    )?.name || "Select hotel..."
                                  : "Select hotel..."}
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-zinc-200 shadow-xl">
                            <div className="flex items-center border-b border-zinc-100 px-3">
                              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                              <input
                                placeholder="Search hotel..."
                                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-400"
                                value={hotelSearch}
                                onChange={(e) => setHotelSearch(e.target.value)}
                              />
                            </div>
                            <div className="max-h-[300px] overflow-y-auto p-1">
                              {hotelsLoading && (
                                <div className="py-6 text-center text-xs text-zinc-500">
                                  Loading hotels...
                                </div>
                              )}
                              {!hotelsLoading && hotelsData?.data?.length === 0 && (
                                <div className="py-6 text-center text-xs text-zinc-500">
                                  No hotels found.
                                </div>
                              )}
                              {hotelsData?.data?.map((hotel: any) => (
                                <div
                                  key={hotel.id}
                                  className={cn(
                                    "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2.5 text-sm transition-colors hover:bg-zinc-900 hover:text-white",
                                    field.state.value === hotel.id && "bg-zinc-100 text-zinc-900"
                                  )}
                                  onClick={() => {
                                    field.handleChange(hotel.id);
                                    setSelectedHotelId(hotel.id);
                                    setHotelOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.state.value === hotel.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{hotel.name}</span>
                                    <span className="text-[10px] opacity-70">
                                      {hotel.city}, {hotel.state}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />

                <form.AppField
                  name="roomTypeId"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="text-xs font-bold text-zinc-700">
                        Room Type
                      </field.FormLabel>
                      <field.FormControl>
                        <Select
                          disabled={!selectedHotelId || roomTypesLoading}
                          value={field.state.value}
                          onValueChange={(val) => field.handleChange(val as any)}
                        >
                          <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/50">
                            <SelectValue placeholder={selectedHotelId ? "Select room type" : "Select hotel first"} />
                          </SelectTrigger>
                          <SelectContent className="border-zinc-200">
                            {roomTypesData?.data?.map((type: any) => (
                              <SelectItem key={type.id} value={type.id} className="focus:bg-zinc-900 focus:text-white">
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section: Guest Details */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                  Guest Information
                </h3>
                <Popover open={userOpen} onOpenChange={setUserOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="link" className="h-auto p-0 text-xs font-bold text-zinc-900 hover:no-underline">
                      <Search className="mr-1 h-3 w-3" /> Select Existing User
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0 border-zinc-200 shadow-xl" align="end">
                    <div className="flex items-center border-b border-zinc-100 px-3">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <input
                        placeholder="Search users..."
                        className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-400"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-1">
                      {usersLoading && (
                        <div className="py-6 text-center text-xs text-zinc-500">
                          Loading users...
                        </div>
                      )}
                      {!usersLoading && usersData?.users?.length === 0 && (
                        <div className="py-6 text-center text-xs text-zinc-500">
                          No users found.
                        </div>
                      )}
                      {usersData?.users?.map((u: any) => (
                        <div
                          key={u.id}
                          className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm transition-colors hover:bg-zinc-900 hover:text-white"
                          onClick={() => {
                            // Using setFieldValue if available on form api
                            (form as any).setFieldValue("guestName", u.name || "");
                            (form as any).setFieldValue("guestEmail", u.email || "");
                            (form as any).setFieldValue("guestPhone", u.phoneNumber || "");
                            setUserOpen(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{u.name || "Unnamed User"}</span>
                            <span className="text-[10px] opacity-70">{u.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <form.AppField
                  name="guestName"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="text-xs font-bold text-zinc-700">
                        Full Name
                      </field.FormLabel>
                      <field.FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                          <Input
                            className="h-11 pl-10 border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all"
                            placeholder="John Doe"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />

                <form.AppField
                  name="guestEmail"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="text-xs font-bold text-zinc-700">
                        Email Address
                      </field.FormLabel>
                      <field.FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                          <Input
                            className="h-11 pl-10 border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all"
                            placeholder="john@example.com"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />

                <form.AppField
                  name="guestPhone"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="text-xs font-bold text-zinc-700">
                        Phone Number
                      </field.FormLabel>
                      <field.FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                          <Input
                            className="h-11 pl-10 border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all"
                            placeholder="+94 77 123 4567"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section: Dates & Occupancy */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Dates & Occupancy
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <form.AppField
                  name="checkInDate"
                  children={(field) => (
                    <field.FormItem className="flex flex-col">
                      <field.FormLabel className="text-xs font-bold text-zinc-700 mb-2">
                        Check-in Date
                      </field.FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-11 justify-start text-left font-normal border-zinc-200 bg-zinc-50/50",
                              !field.state.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
                            {field.state.value ? format(new Date(field.state.value), "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-zinc-200" align="start">
                          <Calendar
                            mode="single"
                            selected={field.state.value ? new Date(field.state.value) : undefined}
                            onSelect={(date) => field.handleChange(date?.toISOString() || "")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />

                <form.AppField
                  name="checkOutDate"
                  children={(field) => (
                    <field.FormItem className="flex flex-col">
                      <field.FormLabel className="text-xs font-bold text-zinc-700 mb-2">
                        Check-out Date
                      </field.FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-11 justify-start text-left font-normal border-zinc-200 bg-zinc-50/50",
                              !field.state.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
                            {field.state.value ? format(new Date(field.state.value), "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-zinc-200" align="start">
                          <Calendar
                            mode="single"
                            selected={field.state.value ? new Date(field.state.value) : undefined}
                            onSelect={(date) => field.handleChange(date?.toISOString() || "")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <form.AppField
                    name="numRooms"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel className="text-xs font-bold text-zinc-700">
                          Rooms
                        </field.FormLabel>
                        <field.FormControl>
                          <Input
                            type="number"
                            min={1}
                            className="h-11 border-zinc-200 bg-zinc-50/50"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                          />
                        </field.FormControl>
                      </field.FormItem>
                    )}
                  />
                  <form.AppField
                    name="numAdults"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel className="text-xs font-bold text-zinc-700">
                          Adults
                        </field.FormLabel>
                        <field.FormControl>
                          <Input
                            type="number"
                            min={1}
                            className="h-11 border-zinc-200 bg-zinc-50/50"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                          />
                        </field.FormControl>
                      </field.FormItem>
                    )}
                  />
                  <form.AppField
                    name="numChildren"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel className="text-xs font-bold text-zinc-700">
                          Children
                        </field.FormLabel>
                        <field.FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="h-11 border-zinc-200 bg-zinc-50/50"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                          />
                        </field.FormControl>
                      </field.FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Section: Pricing & Payment */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Financial Details
              </h3>
              <div className="grid gap-6 md:grid-cols-3">
                <form.AppField
                  name="totalAmount"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="text-xs font-bold text-zinc-700">
                        Total Amount
                      </field.FormLabel>
                      <field.FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="h-11 border-zinc-200 bg-zinc-50/50"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="commissionAmount"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="text-xs font-bold text-zinc-700">
                        Commission
                      </field.FormLabel>
                      <field.FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="h-11 border-zinc-200 bg-zinc-50/50"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </field.FormControl>
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="currency"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="text-xs font-bold text-zinc-700">
                        Currency
                      </field.FormLabel>
                      <field.FormControl>
                        <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as any)}>
                          <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-zinc-200">
                            <SelectItem value="LKR">LKR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      </field.FormControl>
                    </field.FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <form.AppField
                  name="paymentType"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="text-xs font-bold text-zinc-700">
                        Payment Method
                      </field.FormLabel>
                      <field.FormControl>
                        <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as any)}>
                          <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-zinc-200">
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="online">Online Payment</SelectItem>
                            <SelectItem value="card">Card (POS)</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </field.FormControl>
                    </field.FormItem>
                  )}
                />

                <form.AppField
                  name="isPaid"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="text-xs font-bold text-zinc-700">
                        Payment Status
                      </field.FormLabel>
                      <field.FormControl>
                        <Select 
                          value={field.state.value ? "true" : "false"} 
                          onValueChange={(val) => field.handleChange(val === "true")}
                        >
                          <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-zinc-200">
                            <SelectItem value="false">Unpaid</SelectItem>
                            <SelectItem value="true">Paid / Settlement Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </field.FormControl>
                    </field.FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section: Additional Notes */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Additional Notes
              </h3>
              <form.AppField
                name="notes"
                children={(field) => (
                  <field.FormItem>
                    <field.FormControl>
                      <Textarea 
                        placeholder="Internal administrative notes..."
                        className="min-h-[100px] border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </field.FormControl>
                  </field.FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-end gap-3 py-6 px-6 md:px-8 bg-zinc-50/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
              className="px-8 border-zinc-200 text-zinc-700 hover:bg-white"
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-8 bg-zinc-900 text-white hover:bg-black transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Booking"
              )}
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}
