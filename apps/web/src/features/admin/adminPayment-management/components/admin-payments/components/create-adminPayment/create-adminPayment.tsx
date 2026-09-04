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
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface CreateAdminPaymentProps {
  hotelId?: string;
  bookingId?: string;
  onSuccess?: () => void;
}

const defaultValues: Partial<PaymentsAdminInsert> = {
  hotelId: "",
  bookingId: "",
  type: "incoming",
  method: "",
  amount: "",
  settled: false,
};

export function CreateAdminPayment({
  hotelId,
  bookingId,
  onSuccess,
}: CreateAdminPaymentProps) {
  const router = useRouter();
  const { mutate, isPending } = useCreateAdminPayment();

  const [paymentType, setPaymentType] = useState<string>("incoming");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const form = useAppForm({
    validators: { onChange: paymentsAdminInsertSchema as any },
    defaultValues: {
      ...defaultValues,
      hotelId: hotelId || "",
      bookingId: bookingId || "",
      type: paymentType,
      method: paymentMethod,
    },
    onSubmit: ({ value }) => {
      const payload = {
        hotelId: value.hotelId || "",
        bookingId: value.bookingId || null,
        type: (value.type as "incoming" | "outgoing") || "incoming",
        method: value.method || "",
        amount: value.amount || "0",
        settled: !!value.settled,
        settledAt: value.settledAt || null,
      };
      
      mutate(payload as any, {
        onSuccess: () => {
          form.reset();
          onSuccess?.() || router.push("/admin/payments");
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
      case "incoming":
        return "Payment received from customer for booking";
      case "outgoing":
        return "Payment made to hotel for commission or payout";
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
    <Card className="w-full max-w-2xl rounded-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold font-heading flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Create Admin Payment
        </CardTitle>
        <CardDescription>
          Create a payment record for customer payments or hotel payouts
        </CardDescription>
      </CardHeader>

      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-y-5 mb-6">
            {/* Hotel ID */}
            <form.AppField
              name="hotelId"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Hotel ID *
                  </field.FormLabel>
                  <field.FormControl>
                    <Input
                      disabled={isPending || !!hotelId}
                      placeholder="Enter hotel ID"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            {/* Booking ID */}
            {/* <form.AppField
              name="bookingId"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Booking ID *
                  </field.FormLabel>
                  <field.FormControl>
                    <Input
                      disabled={isPending || !!bookingId}
                      placeholder="Enter booking ID"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            /> */}

            {/* Payment Type */}
            <form.AppField
              name="type"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Type *
                  </field.FormLabel>
                  <field.FormControl>
                    <Select
                      disabled={isPending}
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value);
                        setPaymentType(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="incoming">
                          <div className="flex flex-col">
                            <span>Incoming Payment</span>
                            <span className="text-xs text-muted-foreground">
                              Payment from customer
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="outgoing">
                          <div className="flex flex-col">
                            <span>Outgoing Payment</span>
                            <span className="text-xs text-muted-foreground">
                              Payment to hotel
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </field.FormControl>
                  {field.state.value && (
                    <p className="text-sm text-muted-foreground">
                      {getPaymentTypeDescription(field.state.value)}
                    </p>
                  )}
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            {/* Payment Method */}
            <form.AppField
              name="method"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {getPaymentMethodOptions().map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            <div className="flex flex-col">
                              <span>{method.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {method.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            {/* Amount */}
            <form.AppField
              name="amount"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Amount *
                  </field.FormLabel>
                  <field.FormControl>
                    <Input
                      disabled={isPending}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
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
                  <field.FormLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
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
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">
                          <div className="flex flex-col">
                            <span>Pending Settlement</span>
                            <span className="text-xs text-muted-foreground">
                              Not yet settled
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="true">
                          <div className="flex flex-col">
                            <span>Settled</span>
                            <span className="text-xs text-muted-foreground">
                              Already settled
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            {/* Payment Status Indicator */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    paymentType === "incoming" ? "bg-green-500" : "bg-blue-500"
                  }`}
                />
                <span className="font-medium">
                  {paymentType === "incoming"
                    ? "Customer Payment"
                    : "Hotel Payment"}
                </span>
                {paymentMethod && (
                  <span className="text-sm text-muted-foreground">
                    via {paymentMethod.replace("_", " ").toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {getPaymentTypeDescription(paymentType)}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isPending} disabled={isPending}>
              Create Payment Record
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}
