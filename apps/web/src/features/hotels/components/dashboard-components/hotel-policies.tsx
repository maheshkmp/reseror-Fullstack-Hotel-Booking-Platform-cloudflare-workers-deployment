"use client";

import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useSaveRegistry } from "../../context/save-context";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Edit, Plus, Trash2, ScrollText } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useAddHotelPolicies } from "../../queries/use-add-hotel-policies";
import { useGetHotelPolicies } from "../../queries/use-get-hotel-policies";
import {
  type HotelPolicy,
  type InsertHotelPolicyType
} from "core/zod";

type Props = {
  className?: string;
  hotelId?: string;
};

const policyTypes = [
  { value: "cancellation", label: "Cancellation Policy" },
  { value: "pet", label: "Pet Policy" },
  { value: "smoking", label: "Smoking Policy" },
  { value: "checkin", label: "Check-in Policy" },
  { value: "checkout", label: "Check-out Policy" },
  { value: "payment", label: "Payment Policy" },
  { value: "damage", label: "Damage Policy" },
  { value: "noise", label: "Noise Policy" },
  { value: "guest", label: "Guest Policy" },
  { value: "fine_print", label: "The Fine Print" },
  { value: "need_to_know", label: "Need-to-Know Information" },
  { value: "important", label: "Important Information" },
  { value: "other", label: "Other" }
];

const SAMPLE_POLICIES: Record<string, string[]> = {
  cancellation: [
    "Full refund for cancellations made within 48 hours of booking, if the check-in date is at least 14 days away. 50% refund for cancellations made at least 7 days before check-in. No refunds for cancellations made within 7 days of check-in.",
    "Non-refundable: Guests will be charged the full price of the reservation if they cancel at any time.",
    "Free cancellation up to 24 hours before check-in. Cancellations made within 24 hours will be charged for the first night."
  ],
  pet: [
    "Pets are allowed on request. No extra charges.",
    "Strictly no pets allowed in any area of the property.",
    "Service animals are welcome at no additional charge. Please notify us in advance."
  ],
  smoking: [
    "Smoking is not allowed in any indoor areas. Dedicated smoking areas are available outside.",
    "100% non-smoking property. A cleaning fee of $200 will be charged if evidence of smoking is found in the room.",
    "Smoking is permitted on private balconies only."
  ],
  checkin: [
    "Standard check-in time is from 2:00 PM. Early check-in is subject to availability and may incur additional charges.",
    "Check-in time starts at 3:00 PM. Please present a valid government-issued ID upon arrival.",
    "24-hour check-in service available. Please inform us of your expected arrival time."
  ],
  checkout: [
    "Check-out time is until 11:00 AM. Late check-out is subject to availability and additional fees.",
    "Please vacate the room by 10:00 AM on your day of departure.",
    "Express check-out available. Simply leave your key cards at the front desk."
  ],
  payment: [
    "We accept all major credit cards. Cash payments are also accepted at the front desk.",
    "Total booking amount must be paid in full at the time of check-in.",
    "A valid credit card is required to guarantee your reservation. Payment is processed on arrival."
  ],
  damage: [
    "Guests are responsible for any damage caused to the property during their stay. A security deposit may be required at check-in.",
    "Any broken or missing items will be charged to the credit card on file.",
    "Please report any pre-existing damage to the front desk within 1 hour of check-in."
  ],
  noise: [
    "Please keep noise levels to a minimum between 10:00 PM and 7:00 AM to ensure all guests have a peaceful stay.",
    "No parties or events are allowed in the guest rooms or common areas.",
    "Loud music and excessive noise are strictly prohibited at all times."
  ],
  guest: [
    "Only registered guests are allowed in the rooms. Visitors must register at the front desk.",
    "Children of all ages are welcome. Extra beds are available upon request and subject to availability.",
    "Maximum occupancy per room must be strictly followed for safety and insurance reasons."
  ],
  fine_print: [
    "Please note that all Special Requests are subject to availability and additional charges may apply.",
    "A security deposit of USD 100 is required upon arrival for incidentals. This deposit is fully refundable upon check-out and subject to a damage inspection of the accommodation.",
    "Guests are required to show a photo identification and credit card upon check-in."
  ],
  need_to_know: [
    "Construction work is happening nearby from 9:00 AM to 5:00 PM and some rooms may be affected by noise.",
    "The property has no elevator; upper floors are accessible by stairs only.",
    "The swimming pool is closed for maintenance from November to February."
  ],
  important: [
    "Please inform the property in advance of your expected arrival time if checking in after 8:00 PM.",
    "In response to Coronavirus (COVID-19), additional safety and sanitation measures are in effect at this property.",
    "Food and beverage services at this property may be limited or unavailable due to Coronavirus (COVID-19)."
  ]
};

const defaultPolicyValues: InsertHotelPolicyType = {
  hotelId: "",
  policyType: "",
  policyText: "",
  effectiveDate: new Date().toISOString().split("T")[0],
  isActive: true
};

export function ManageHotelPolicies({ className, hotelId }: Props) {
  const { data, isLoading, error } = useGetHotelPolicies(hotelId);
  const { mutateAsync, isPending } = useAddHotelPolicies(hotelId);
  const { register, unregister } = useSaveRegistry();
  
  const defaultValues = useMemo(() => ({
    ...defaultPolicyValues,
    hotelId: hotelId || ""
  }), [hotelId]);

  const [policies, setPolicies] = useState<InsertHotelPolicyType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] =
    useState<InsertHotelPolicyType>(defaultValues);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingIndex(null);
    setFormData(defaultValues);
  }, [defaultValues]);

  const handleDeletePolicy = useCallback((index: number) => {
    setPolicies((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleEditPolicy = useCallback((policy: HotelPolicy, index: number) => {
    setEditingIndex(index);
    setFormData({
      hotelId: policy.hotelId,
      policyType: policy.policyType,
      policyText: policy.policyText,
      effectiveDate: policy.effectiveDate,
      isActive: policy.isActive
    });
    setIsDialogOpen(true);
  }, []);

  const handleSaveChanges = useCallback(() => {
    mutateAsync(policies);
  }, [mutateAsync, policies]);

  const isDirty = useMemo(() => {
    if (!data) return false;
    const normalize = (val: any) => (val === null || val === undefined ? "" : String(val).trim());
    
    const initial = data.map((policy: HotelPolicy) => ({
      hotelId: normalize(policy.hotelId),
      policyType: normalize(policy.policyType),
      policyText: normalize(policy.policyText),
      effectiveDate: normalize(policy.effectiveDate),
      isActive: !!policy.isActive
    }));
    
    const current = policies.map(p => ({
      hotelId: normalize(p.hotelId),
      policyType: normalize(p.policyType),
      policyText: normalize(p.policyText),
      effectiveDate: normalize(p.effectiveDate),
      isActive: !!p.isActive
    }));
    
    return JSON.stringify(current) !== JSON.stringify(initial);
  }, [policies, data]);

  useEffect(() => {
    register({
      id: "hotel-policies",
      isDirty,
      onSave: async () => {
        await mutateAsync(policies);
      },
      onReset: () => {
        if (data) {
          const convertedPolicies: InsertHotelPolicyType[] = data.map((policy: HotelPolicy) => ({
            hotelId: policy.hotelId,
            policyType: policy.policyType,
            policyText: policy.policyText,
            effectiveDate: policy.effectiveDate,
            isActive: policy.isActive
          }));
          setPolicies(convertedPolicies);
        }
      },
    });
    return () => unregister("hotel-policies");
  }, [register, unregister, isDirty, policies, data, mutateAsync]);

  const openDialog = useCallback(() => {
    setEditingIndex(null);
    setFormData(defaultValues);
    setIsDialogOpen(true);
  }, [defaultValues]);

  const handleSubmitPolicy = useCallback(() => {
    if (!formData.policyType || !formData.policyText) {
      return; // Basic validation
    }

    if (editingIndex !== null) {
      // Update existing policy
      setPolicies((prev: InsertHotelPolicyType[]) => {
        const updated = [...prev];
        updated[editingIndex] = formData;
        return updated;
      });
    } else {
      // Add new policy
      setPolicies((prev: InsertHotelPolicyType[]) => [...prev, formData]);
    }

    handleCloseDialog();
  }, [formData, editingIndex, handleCloseDialog]);

  // Initialize policies from data
  React.useEffect(() => {
    if (data && !isLoading && !error) {
      const convertedPolicies: InsertHotelPolicyType[] = data.map((policy: HotelPolicy) => ({
        hotelId: policy.hotelId,
        policyType: policy.policyType,
        policyText: policy.policyText,
        effectiveDate: policy.effectiveDate,
        isActive: policy.isActive
      }));
      setPolicies(convertedPolicies);
    }
  }, [data, isLoading, error]);

  return (
    <>
    <Card className={cn("p-0 py-5 rounded-sm shadow-none border border-slate-200", className)}>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-slate-50 text-slate-600">
            <ScrollText className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Property Policies</CardTitle>
            <CardDescription className="text-xs">
              Manage policies, house rules, fine print, and important need-to-know information for your guests.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 sm:px-6 mt-4">
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="w-full h-16 rounded-sm" />
              <Skeleton className="w-full h-16 rounded-sm" />
              <Skeleton className="w-full h-16 rounded-sm" />
            </div>
          )}

          {error && <p className="text-destructive">{error.message}</p>}

          {policies.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No policies added yet
              </p>
              <Button onClick={openDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Policy
              </Button>
            </div>
          )}

          {policies.length > 0 && (
            <div className="space-y-4 bg-secondary/40 p-3 rounded-sm">
              {policies.map((policy, index) => (
                <Card key={index} className="border rounded-sm px-5 py-3">
                  <CardContent className="p-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{policy.policyText}</h4>

                          <p className="text-sm text-muted-foreground">
                            {" - "}
                            {policyTypes.find(
                              (t) => t.value === policy.policyType
                            )?.label || policy.policyType}
                          </p>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Effective from:{" "}
                          {policy.effectiveDate &&
                            new Date(policy.effectiveDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleEditPolicy(policy as HotelPolicy, index)
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePolicy(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" onClick={openDialog} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Policy
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit Policy" : "Add New Policy"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitPolicy();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="policyType">Policy Type</Label>
              <Select
                value={formData.policyType}
                onValueChange={(value) =>
                  setFormData((prev: InsertHotelPolicyType) => ({ ...prev, policyType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a policy type" />
                </SelectTrigger>
                <SelectContent>
                  {policyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="policyText">Policy Text</Label>
              {formData.policyType && SAMPLE_POLICIES[formData.policyType] && (
                <div className="space-y-2 mb-2 p-3 bg-muted/40 rounded-sm border border-dashed border-muted-foreground/30">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">
                    Quick Samples (Click to use)
                  </p>
                  <div className="flex flex-col gap-2 max-h-[120px] overflow-y-auto pr-2 scrollbar-hide">
                    {SAMPLE_POLICIES[formData.policyType].map((sample, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setFormData((prev: InsertHotelPolicyType) => ({ ...prev, policyText: sample }))
                        }
                        className="text-left text-[11px] p-2 rounded-md bg-background border border-border hover:border-primary/50 hover:bg-accent transition-all animate-in fade-in slide-in-from-left-1"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <Textarea
                id="policyText"
                placeholder="Enter the policy details..."
                className="resize-none"
                rows={5}
                value={formData.policyText}
                onChange={(e) =>
                  setFormData((prev: InsertHotelPolicyType) => ({
                    ...prev,
                    policyText: e.target.value
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) =>
                  setFormData((prev: InsertHotelPolicyType) => ({
                    ...prev,
                    effectiveDate: e.target.value
                  }))
                }
              />
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Active Policy</Label>
                <div className="text-sm text-muted-foreground">
                  This policy is currently active and will be displayed to
                  guests
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev: InsertHotelPolicyType) => ({ ...prev, isActive: checked }))
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingIndex !== null ? "Update Policy" : "Add Policy"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
