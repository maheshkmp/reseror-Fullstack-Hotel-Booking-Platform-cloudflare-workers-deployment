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

export function ContactInfoForm() {
  const { data: settings, isLoading } = useGetSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const contactSchema = insertSiteSettingsSchema.pick({
    contactEmail: true,
    contactPhone: true,
    contactAddress: true,
  }).required();

  const form = useAppForm({
    validators: { onChange: contactSchema },
    defaultValues: {
      contactEmail: settings?.contactEmail || "",
      contactPhone: settings?.contactPhone || "",
      contactAddress: settings?.contactAddress || "",
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
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          Contact details displayed on your website.
        </CardDescription>
      </CardHeader>
      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <form.AppField
              name="contactEmail"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Contact Email</field.FormLabel>
                  <field.FormControl>
                    <Input
                      type="email"
                      placeholder="e.g. info@reseror.com"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="contactPhone"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Contact Phone</field.FormLabel>
                  <field.FormControl>
                    <Input
                      placeholder="e.g. +94 123 456 789"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="contactAddress"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Contact Address</field.FormLabel>
                  <field.FormControl>
                    <Input
                      placeholder="e.g. 123 Main St, Colombo, Sri Lanka"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" loading={isPending} disabled={isPending}>
              Save Contact Information
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}
