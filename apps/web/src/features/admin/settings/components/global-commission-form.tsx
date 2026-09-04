"use client";

import { useGetSettings } from "../api/use-get-settings";
import { useUpdateSettings } from "../api/use-update-settings";
import { useAppForm } from "@/components/ui/tanstack-form";
import { insertSiteSettingsSchema, type UpdateSiteSettings } from "core/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useCallback } from "react";
import { SettingsFormSkeleton } from "./settings-form-skeleton";
import { IconPercentage } from "@tabler/icons-react";
import { Switch } from "@/components/ui/switch";

export function GlobalCommissionForm() {
  const { data: settings, isLoading } = useGetSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const commissionSchema = insertSiteSettingsSchema.pick({
    defaultCommissionRate: true,
    isOnlinePaymentEnabled: true,
  }).required();

  const form = useAppForm({
    validators: { onChange: commissionSchema },
    defaultValues: {
      defaultCommissionRate: settings?.defaultCommissionRate || "10.00",
      isOnlinePaymentEnabled: settings?.isOnlinePaymentEnabled || false,
    },
    onSubmit: ({ value }) => {
      updateSettings(value as UpdateSiteSettings);
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

  if (isLoading) return <SettingsFormSkeleton />;

  return (
    <Card className="max-w-2xl border-none shadow-none">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <IconPercentage size={24} />
          </div>
          <CardTitle>Global Hotel Booking Commission & Payment</CardTitle>
        </div>
        <CardDescription>
          Configure the default commission percentage applied to all hotel bookings on the platform and manage payment settings.
        </CardDescription>
      </CardHeader>
      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <form.AppField
              name="defaultCommissionRate"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Default Commission Rate (%)</field.FormLabel>
                  <field.FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="e.g. 10.00"
                        className="pl-4 pr-10"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                        %
                      </div>
                    </div>
                  </field.FormControl>
                  <field.FormDescription>
                    Enter the percentage as a decimal (e.g., 10.00 for 10%).
                  </field.FormDescription>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="isOnlinePaymentEnabled"
              children={(field) => (
                <field.FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 bg-muted/20 p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <field.FormLabel className="text-base">Enable Online Payment</field.FormLabel>
                    <field.FormDescription>
                      Allow users to pay via card during room booking.
                    </field.FormDescription>
                  </div>
                  <field.FormControl>
                    <Switch
                      checked={field.state.value}
                      onCheckedChange={field.handleChange}
                    />
                  </field.FormControl>
                </field.FormItem>
              )}
            />

            <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
              <h4 className="text-sm font-medium mb-1">How it works:</h4>
              <p className="text-xs text-muted-foreground">
                When a new booking is created, the system checks if the hotel has a custom commission rate. 
                If not, this global rate ({settings?.defaultCommissionRate || "10.00"}%) is automatically applied to calculate the commission amount.
              </p>
            </div>
          </CardContent>
          <CardFooter className=" px-6 py-4">
            <Button type="submit" loading={isPending} disabled={isPending}>
              Update Settings
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}
