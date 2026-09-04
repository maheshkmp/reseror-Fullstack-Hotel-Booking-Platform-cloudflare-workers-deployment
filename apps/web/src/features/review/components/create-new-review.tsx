"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  BedIcon,
  CalendarIcon,
  MapPinIcon,
  MessageSquareIcon,
  PlusCircleIcon,
  StarIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  UtensilsIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useCreateReview } from "../actions/use-create-review";
import { z } from "zod";
import {
  reviewNratingInsertSchema,
  type reviewNratingInsertType,
} from "core/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Client-side schema omits stayDate (injected at submit) to avoid z.coerce.date TS issues
const clientReviewSchema = reviewNratingInsertSchema.omit({ stayDate: true });
type ClientReviewValues = z.infer<typeof clientReviewSchema>;

const defaultValues: Partial<ClientReviewValues> = {
  hotelId: null,
  roomId: null,
  restaurantId: null,
  rating: "",
  reviewTitle: "",
  reviewPositiveText: "",
  reviewNegativeText: "",
  reviewDate: null,
  propertyResponse: "",
  response: "",
};

// Star Rating Component
const StarRating = ({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const numValue = parseInt(value) || 0;

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star.toString())}
          className={cn(
            "p-1 rounded-full transition-all duration-200",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"
          )}
        >
          <StarIcon
            className={cn(
              "w-7 h-7 transition-colors",
              star <= numValue
                ? "fill-zinc-900 text-zinc-900"
                : "fill-zinc-100 text-zinc-200 hover:fill-zinc-300 hover:text-zinc-300"
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
        {numValue > 0 ? `${numValue} / 5` : "Tap to rate"}
      </span>
    </div>
  );
};

export function CreateReview({
  triggerRef,
  hotelId: hotelIdProp,
}: {
  triggerRef?: React.RefObject<HTMLButtonElement>;
  hotelId?: string | null;
}) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateReview();
  const [open, setOpen] = useState(false);

  // Prefer the explicit prop; fall back to URL-based extraction as a last resort
  let hotelId: string | null = hotelIdProp ?? null;
  if (!hotelId && typeof window !== "undefined") {
    const match = window.location.pathname.match(/hotels\/([a-zA-Z0-9-]+)/);
    hotelId = match ? match[1] : null;
  }

  const form = useAppForm({
    validators: { onChange: clientReviewSchema },
    defaultValues: { ...defaultValues, hotelId } as ClientReviewValues,
    onSubmit: ({ value }) => {
      const sanitizedPayload = {
        ...value,
        hotelId: hotelId || null,
        roomId: value.roomId?.trim() || null,
        restaurantId: value.restaurantId?.trim() || null,
        reviewPositiveText: value.reviewPositiveText?.trim() || null,
        reviewNegativeText: value.reviewNegativeText?.trim() || null,
        reviewTitle: value.reviewTitle?.trim() || null,
        reviewDate: value.reviewDate?.trim() || null,
        propertyResponse: value.propertyResponse?.trim() || null,
        response: value.response?.trim() || null,
        stayDate: new Date(),
      };

      mutate(sanitizedPayload as reviewNratingInsertType, {
        onSuccess: () => {
          toast.success("Review submitted successfully! Administrators will review and publish it shortly.");
          form.reset();
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["reviews"] });
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to submit review.");
        }
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          ref={triggerRef}
          className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium px-5 py-2 rounded-md transition-colors h-10 shadow-none border-0"
          icon={<PlusCircleIcon className="w-4 h-4" />}
          type="button"
          onClick={() => setOpen(true)}
        >
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden border border-zinc-200 rounded-xl shadow-none bg-white flex flex-col max-h-[90vh]">
        <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 text-xl font-bold">
              Share Your Experience
            </DialogTitle>
            <p className="text-zinc-500 text-xs mt-1">
              Help other travelers by providing an honest, distraction-free review.
            </p>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto w-full smooth-scroll flex-1 px-6 py-6 border-0">
          <form.AppForm>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Overall Rating Section */}
              <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-none pb-4">
                <div className="flex items-center gap-2 mb-3 border-b border-zinc-100 pb-3">
                  <StarIcon className="w-4 h-4 text-zinc-900" />
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                    Overall Score
                  </h3>
                </div>
                <form.AppField
                  name="rating"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormControl>
                        <StarRating
                          value={field.state.value}
                          onChange={field.handleChange}
                          disabled={isPending}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
              </div>

              {/* Review Title */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquareIcon className="w-4 h-4 text-zinc-900" />
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                    Headline
                  </h3>
                </div>
                <form.AppField
                  name="reviewTitle"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Summarize your stay in one sentence"
                          value={field.state.value || ""}
                          onChange={(e) =>
                            field.handleChange(e.target.value)
                          }
                          onBlur={field.handleBlur}
                          className="h-10 text-sm border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 bg-zinc-50 rounded-lg shadow-none"
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
              </div>

              {/* Positive & Negative Feedback */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ThumbsUpIcon className="w-4 h-4 text-zinc-900" />
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                      What You Liked
                    </h3>
                  </div>
                  <form.AppField
                    name="reviewPositiveText"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormControl>
                          <Textarea
                            disabled={isPending}
                            placeholder="What made your stay special?"
                            value={field.state.value || ""}
                            onChange={(e) =>
                              field.handleChange(e.target.value)
                            }
                            onBlur={field.handleBlur}
                            className="text-sm border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 bg-zinc-50 rounded-lg min-h-[100px] resize-none shadow-none"
                            rows={4}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ThumbsDownIcon className="w-4 h-4 text-zinc-900" />
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                      Needs Improvement
                    </h3>
                  </div>
                  <form.AppField
                    name="reviewNegativeText"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormControl>
                          <Textarea
                            disabled={isPending}
                            placeholder="Was there anything that didn't meet your expectations?"
                            value={field.state.value || ""}
                            onChange={(e) =>
                              field.handleChange(e.target.value)
                            }
                            onBlur={field.handleBlur}
                            className="text-sm border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 bg-zinc-50 rounded-lg min-h-[100px] resize-none shadow-none"
                            rows={4}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Property Details (Optional Metadata) */}
              <div className="border border-zinc-200 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-3">
                  Trip Metadata (Optional)
                </h3>

                <div className="grid md:grid-cols-4 gap-4">
                  <form.AppField
                    name="hotelId"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase">
                          <MapPinIcon className="w-3.5 h-3.5" />
                          Hotel ID
                        </field.FormLabel>
                        <field.FormControl>
                          <Input
                            readOnly
                            disabled={true}
                            value={hotelId || ""}
                            className="h-9 text-xs border-zinc-200 bg-zinc-100 text-zinc-500 rounded-md shadow-none"
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />

                  <form.AppField
                    name="roomId"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase">
                          <BedIcon className="w-3.5 h-3.5" />
                          Room ID
                        </field.FormLabel>
                        <field.FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="Optional room identifier"
                            value={field.state.value || ""}
                            onChange={(e) =>
                              field.handleChange(e.target.value)
                            }
                            onBlur={field.handleBlur}
                            className="h-9 text-xs border-zinc-200 focus:border-zinc-900 bg-zinc-50 rounded-md shadow-none"
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />

                  <form.AppField
                    name="restaurantId"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase">
                          <UtensilsIcon className="w-3.5 h-3.5" />
                          Rest. ID
                        </field.FormLabel>
                        <field.FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="Optional restaurant id"
                            value={field.state.value || ""}
                            onChange={(e) =>
                              field.handleChange(e.target.value)
                            }
                            onBlur={field.handleBlur}
                            className="h-9 text-xs border-zinc-200 focus:border-zinc-900 bg-zinc-50 rounded-md shadow-none"
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />

                  <form.AppField
                    name="reviewDate"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          Date of Stay
                        </field.FormLabel>
                        <field.FormControl>
                          <Input
                            disabled={isPending}
                            type="date"
                            value={field.state.value || ""}
                            onChange={(e) =>
                              field.handleChange(e.target.value)
                            }
                            onBlur={field.handleBlur}
                            className="h-9 text-xs border-zinc-200 focus:border-zinc-900 bg-zinc-50 rounded-md shadow-none"
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4 pt-2">
                <form.AppField
                  name="response"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="text-[10px] font-bold text-zinc-500 uppercase">
                        Additional Comments
                      </field.FormLabel>
                      <field.FormControl>
                        <Textarea
                          disabled={isPending}
                          placeholder="Any extra thoughts?"
                          value={field.state.value || ""}
                          onChange={(e) =>
                            field.handleChange(e.target.value)
                          }
                          onBlur={field.handleBlur}
                          className="text-sm border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 bg-zinc-50 rounded-lg min-h-[60px] resize-none shadow-none"
                          rows={2}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-zinc-200 flex items-center justify-between mt-6">
                 <p className="text-xs text-zinc-500 font-medium hidden md:block">
                   Your review helps shape the community.
                 </p>
                 <Button
                   type="submit"
                   loading={isPending}
                   disabled={isPending}
                   className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium px-8 h-10 rounded-md transition-colors text-sm ml-auto shadow-none"
                 >
                   {isPending ? "Submitting..." : "Submit Review"}
                 </Button>
              </div>
            </form>
          </form.AppForm>
        </div>
      </DialogContent>
    </Dialog>
  );
}
