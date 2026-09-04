"use client";

import { useCreateHotelPayment } from "@/features/hotel-payments/queries/use-create-hotel-payment";
import {
  paymentsHotelInsertSchema,
  type PaymentsHotelInsert,
} from "@/features/hotel-payments/schemas/hotel-payment.schema";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppForm } from "@/components/ui/tanstack-form";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import GalleryView from "@/modules/media/components/gallery-view";
import { FileText, Image as ImageIcon, X, Paperclip } from "lucide-react";
import Image from "next/image";

interface CreateHotelPaymentProps {
  hotelId?: string;
  onSuccess?: () => void;
}

const defaultValues: Partial<PaymentsHotelInsert> = {
  hotelId: "",
  bookingId: null,
  type: "receive_commission_from_cash",
  amount: "",
  dueDate: "",
  paid: false,
  proof: "",
  bankName: "",
  referenceId: "",
};

export function CreateHotelPayment({
  hotelId: propHotelId,
  onSuccess,
}: CreateHotelPaymentProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { mutate, isPending } = useCreateHotelPayment();

  const [paymentType, setPaymentType] = useState<string>("receive_commission_from_cash");
  const [showGallery, setShowGallery] = useState(false);

  const form = useAppForm({
    validators: { onChange: paymentsHotelInsertSchema },
    defaultValues: {
      ...defaultValues,
      hotelId: propHotelId || "",
      type: paymentType as "receive_commission_from_cash" | "repay_net_from_online",
    },
    onSubmit: ({ value }) => {
      // Ensure hotelId is present if it arrived late via prop
      const finalValue = {
        ...value,
        hotelId: value.hotelId || propHotelId || "",
      };
      
      mutate(finalValue as PaymentsHotelInsert, {
        onSuccess: () => {
          form.reset();
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/account/manage/payment-details");
          }
        },
      });
    }
  });

  // Sync hotelId from props
  useEffect(() => {
    if (propHotelId && !form.getFieldValue("hotelId")) {
      form.setFieldValue("hotelId", propHotelId);
    }
  }, [propHotelId, form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <div className="w-full max-w-lg mx-auto">
      <form.AppForm>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            {/* Payment Type */}
            <form.AppField
              name="type"
              children={(field) => (
                <field.FormItem className="space-y-1.5">
                  <field.FormLabel className="text-[12px] font-bold text-slate-500 uppercase tracking-tight">
                    Transaction Type
                  </field.FormLabel>
                  <field.FormControl>
                    <Select
                      disabled={isPending}
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value as any);
                        setPaymentType(value);
                      }}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white shadow-none text-[13px] font-medium">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 p-1">
                        <SelectItem value="receive_commission_from_cash" className="rounded-lg text-[13px]">
                          Commission (Cash COA)
                        </SelectItem>
                        <SelectItem value="repay_net_from_online" className="rounded-lg text-[13px]">
                          Net Payout (Booking Paid Online)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Amount */}
              <form.AppField
                name="amount"
                children={(field) => (
                  <field.FormItem className="space-y-1.5">
                    <field.FormLabel className="text-[12px] font-bold text-slate-500 uppercase tracking-tight">
                      Amount (USD)
                    </field.FormLabel>
                    <field.FormControl>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                        <Input
                          disabled={isPending}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8 h-11 rounded-xl border-slate-200 bg-white shadow-none font-bold text-[13px]"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </div>
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              {/* Due Date */}
              <form.AppField
                name="dueDate"
                children={(field) => (
                  <field.FormItem className="space-y-1.5">
                    <field.FormLabel className="text-[12px] font-bold text-slate-500 uppercase tracking-tight">
                      Reference Date
                    </field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        type="date"
                        className="h-11 rounded-xl border-slate-200 bg-white shadow-none text-[13px] font-medium"
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

            {/* Bank Info (Optional) */}
            <div className="grid grid-cols-2 gap-4">
              <form.AppField
                name="bankName"
                children={(field) => (
                  <field.FormItem className="space-y-1.5">
                    <field.FormLabel className="text-[12px] font-bold text-slate-500 uppercase tracking-tight">
                      Bank Name (Optional)
                    </field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="e.g. HSBC"
                        className="h-11 rounded-xl border-slate-200 bg-white shadow-none text-[13px]"
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </field.FormControl>
                  </field.FormItem>
                )}
              />

              <form.AppField
                name="referenceId"
                children={(field) => (
                  <field.FormItem className="space-y-1.5">
                    <field.FormLabel className="text-[12px] font-bold text-slate-500 uppercase tracking-tight">
                      Ref / Transaction ID
                    </field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="TRX-123..."
                        className="h-11 rounded-xl border-slate-200 bg-white shadow-none text-[13px]"
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </field.FormControl>
                  </field.FormItem>
                )}
              />
            </div>

            {/* Proof of Payment Upload */}
            <form.AppField
              name="proof"
              children={(field) => (
                <field.FormItem className="space-y-1.5">
                   <field.FormLabel className="text-[12px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-2">
                    Proof of Payment
                    <span className="text-[10px] lowercase font-normal text-slate-400 font-sans italic">(Optional)</span>
                  </field.FormLabel>
                  <field.FormControl>
                    <div className="space-y-3">
                      {field.state.value ? (
                        <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-[4/1.5] w-full bg-slate-50">
                          {field.state.value.match(/\.(jpeg|jpg|gif|png)$/) ? (
                            <Image 
                              src={field.state.value} 
                              alt="Proof" 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full gap-2 text-slate-500">
                              <FileText className="w-5 h-5" />
                              <span className="text-xs font-semibold">Document Attached</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="h-8 text-[11px] font-bold rounded-lg"
                              onClick={() => setShowGallery(true)}
                            >
                              Replace
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8 rounded-lg"
                              onClick={() => field.handleChange("")}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowGallery(true)}
                          className="w-full flex items-center justify-center gap-2 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-400 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-500 transition-all group"
                        >
                          <Paperclip className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold uppercase tracking-tight">Upload Evidence</span>
                        </button>
                      )}
                    </div>
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
              Notice: All records are subject to manual verification by admin before final settlement. 
              The proof of payment helps speed up this process and resolves disputes.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onSuccess?.()}
                disabled={isPending}
                className="rounded-xl font-bold px-5 text-xs uppercase text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                loading={isPending} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 rounded-xl shadow-none text-xs uppercase"
              >
                Submit Record
              </Button>
          </div>
        </form>
      </form.AppForm>

      {showGallery && (
        <GalleryView
          modal={true}
          modalOpen={showGallery}
          setModalOpen={setShowGallery}
          onUseSelected={(selectedFiles) => {
            if (selectedFiles.length > 0) {
              form.setFieldValue("proof", selectedFiles[0].url);
            }
            setShowGallery(false);
          }}
        />
      )}
    </div>
  );
}
