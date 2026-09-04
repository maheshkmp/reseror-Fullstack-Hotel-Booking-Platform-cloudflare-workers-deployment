"use client";

import { useCreateAdminPayment } from "@/features/admin/booking-management/components/admin-payments/queries/use-create-admin-payment";
import {
  paymentsAdminInsertSchema,
  type PaymentsAdminInsert,
} from "@/features/admin/booking-management/components/admin-payments/schemas/admin-payment.schema";
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
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Search,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { useGetHotels } from "@/features/hotels/queries/use-get-hotels";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CreateAdminPaymentProps {
  hotelId?: string;
  onSuccess?: () => void;
}

const defaultValues = {
  hotelId: "",
  type: "outgoing" as const,
  method: "",
  amount: "",
  settled: false,
};

export function CreateAdminPayment({
  hotelId,
  onSuccess,
}: CreateAdminPaymentProps) {
  const router = useRouter();
  const { mutate, isPending } = useCreateAdminPayment();
  const [open, setOpen] = useState(false);
  const [hotelSearch, setHotelSearch] = useState("");

  const { data: hotelsData, isLoading: hotelsLoading } = useGetHotels({
    search: hotelSearch,
    limit: "10",
  });

  const [paymentType, setPaymentType] = useState<"incoming" | "outgoing">("outgoing");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const form = useAppForm({
    validators: { onChange: paymentsAdminInsertSchema },
    defaultValues: {
      ...defaultValues,
      hotelId: hotelId || "",
      type: paymentType,
      method: paymentMethod,
      bookingId: null as string | null, // Ensure it's null, not undefined
    },
    onSubmit: ({ value }) => {
      const payload: PaymentsAdminInsert = {
        ...value,
        type: value.type as "incoming" | "outgoing",
        method: value.method || "", // Ensure string, not optional
        bookingId: value.bookingId ?? null,
        settledAt: value.settled ? new Date() : null,
      };

      mutate(payload, {
        onSuccess: () => {
          toast.success("Payment record created successfully");
          form.reset();
          onSuccess?.() || router.push("/admin/adminPayments");
        },
        onError: () => {
          toast.error("Failed to create payment record");
        },
      });
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const getPaymentTypeDescription = (type: string) => {
    switch (type) {
      case "outgoing":
        return "Payment made to hotel for commission or payout";
      case "incoming":
        return "Payment received from customer";
      default:
        return "";
    }
  };

  const getPaymentMethodOptions = () => [
    {
      value: "stripe",
      label: "Stripe",
      description: "Online credit/debit card payment",
    },
    {
      value: "bank_transfer",
      label: "Bank Transfer",
      description: "Direct bank transfer",
    },
    { value: "paypal", label: "PayPal", description: "PayPal payment" },
    { value: "cash", label: "Cash", description: "Cash payment" },
    { value: "check", label: "Check", description: "Check payment" },
    {
      value: "wire_transfer",
      label: "Wire Transfer",
      description: "International wire transfer",
    },
  ];

  return (
    <Card className="w-full max-w-2xl border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold font-heading flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Settings className="w-6 h-6" />
          </div>
          Create Admin Payment
        </CardTitle>
        <CardDescription>
          Create a payment record for customer payments or hotel payouts
        </CardDescription>
      </CardHeader>

      <form.AppForm>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent className="px-0 flex flex-col gap-y-6">
            {/* Hotel Selection */}
            <form.AppField
              name="hotelId"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel className="flex items-center gap-2 text-sm font-semibold">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Select Hotel *
                  </field.FormLabel>
                  <field.FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between h-11"
                          disabled={isPending || !!hotelId}
                        >
                          {field.state.value
                            ? hotelsData?.data?.find(
                                (hotel: any) => hotel.id === field.state.value
                              )?.name || "Select hotel..."
                            : "Select hotel..."}
                          {hotelsLoading ? (
                            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
                          ) : (
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <div className="flex items-center border-b px-3">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <input
                            placeholder="Search hotel..."
                            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            value={hotelSearch}
                            onChange={(e) => setHotelSearch(e.target.value)}
                          />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto p-1">
                          {hotelsLoading && (
                            <div className="py-6 text-center text-sm">
                              Loading...
                            </div>
                          )}
                          {!hotelsLoading && hotelsData?.data?.length === 0 && (
                            <div className="py-6 text-center text-sm">
                              No hotel found.
                            </div>
                          )}
                          {hotelsData?.data?.map((hotel: any) => (
                            <div
                              key={hotel.id}
                              className={cn(
                                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100",
                                field.state.value === hotel.id && "bg-slate-100"
                              )}
                              onClick={() => {
                                field.handleChange(hotel.id);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.state.value === hotel.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{hotel.name}</span>
                                <span className="text-[10px] text-muted-foreground">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Type */}
              <form.AppField
                name="type"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel className="flex items-center gap-2 text-sm font-semibold">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      Payment Type *
                    </field.FormLabel>
                    <field.FormControl>
                      <Select
                        disabled={isPending}
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(value as any);
                          setPaymentType(value as any);
                        }}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outgoing">Outgoing (to Hotel)</SelectItem>
                          <SelectItem value="incoming">Incoming (from User)</SelectItem>
                        </SelectContent>
                      </Select>
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              {/* Payment Method */}
              <form.AppField
                name="method"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel className="flex items-center gap-2 text-sm font-semibold">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      Payment Method
                    </field.FormLabel>
                    <field.FormControl>
                      <Select
                        disabled={isPending}
                        value={field.state.value || ""}
                        onValueChange={(value) => {
                          field.handleChange(value);
                          setPaymentMethod(value);
                        }}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          {getPaymentMethodOptions().map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount */}
              <form.AppField
                name="amount"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel className="flex items-center gap-2 text-sm font-semibold">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      Amount *
                    </field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="h-11"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              {/* Settlement Status */}
              <form.AppField
                name="settled"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel className="flex items-center gap-2 text-sm font-semibold">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      Settlement Status
                    </field.FormLabel>
                    <field.FormControl>
                      <Select
                        disabled={isPending}
                        value={field.state.value ? "true" : "false"}
                        onValueChange={(value) =>
                          field.handleChange(value === "true")
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="false">Pending</SelectItem>
                          <SelectItem value="true">Settled</SelectItem>
                        </SelectContent>
                      </Select>
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
            </div>

            {/* Info Card */}
            <div className={`p-4 rounded-xl border flex items-start gap-4 ${
              paymentType === "incoming" ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"
            }`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                paymentType === "incoming" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
              }`}>
                {paymentType === "incoming" ? <DollarSign className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">
                  {paymentType === "incoming" ? "Customer Payment" : "Hotel Payout"}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  {getPaymentTypeDescription(paymentType)}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="px-0 flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
              className="px-8 h-11"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={isPending} 
              disabled={isPending}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Create Payment Record
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}

