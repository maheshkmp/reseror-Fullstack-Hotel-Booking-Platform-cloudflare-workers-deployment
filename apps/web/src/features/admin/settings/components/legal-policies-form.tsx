"use client";

import { useGetSettings } from "../api/use-get-settings";
import { useUpdateSettings } from "../api/use-update-settings";
import { useAppForm } from "@/components/ui/tanstack-form";
import { insertSiteSettingsSchema, type UpdateSiteSettings } from "core/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useCallback } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export function LegalPoliciesForm() {
  const { data: settings, isLoading } = useGetSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const legalSchema = insertSiteSettingsSchema.pick({
    privacyPolicy: true,
    termsAndConditions: true,
    bookingPolicy: true,
    refundPolicy: true,
  }).required();

  const form = useAppForm({
    validators: { onChange: legalSchema },
    defaultValues: {
      privacyPolicy: settings?.privacyPolicy || "",
      termsAndConditions: settings?.termsAndConditions || "",
      bookingPolicy: settings?.bookingPolicy || "",
      refundPolicy: settings?.refundPolicy || "",
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="border-none shadow-none">
      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <div className="space-y-8 p-6">
            <section className="space-y-4">
              <CardTitle>Privacy Policy</CardTitle>
              <form.AppField
                name="privacyPolicy"
                children={(field) => (
                  <field.FormItem>
                    <field.FormControl>
                      <RichTextEditor
                        value={field.state.value || ""}
                        onChange={(val) => field.handleChange(val)}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
            </section>

            <section className="space-y-4">
              <CardTitle>Terms and Conditions</CardTitle>
              <form.AppField
                name="termsAndConditions"
                children={(field) => (
                  <field.FormItem>
                    <field.FormControl>
                      <RichTextEditor
                        value={field.state.value || ""}
                        onChange={(val) => field.handleChange(val)}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
            </section>

            <section className="space-y-4">
              <CardTitle>Booking Policy</CardTitle>
              <form.AppField
                name="bookingPolicy"
                children={(field) => (
                  <field.FormItem>
                    <field.FormControl>
                      <RichTextEditor
                        value={field.state.value || ""}
                        onChange={(val) => field.handleChange(val)}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
            </section>

            <section className="space-y-4">
              <CardTitle>Refund Policy</CardTitle>
              <form.AppField
                name="refundPolicy"
                children={(field) => (
                  <field.FormItem>
                    <field.FormControl>
                      <RichTextEditor
                        value={field.state.value || ""}
                        onChange={(val) => field.handleChange(val)}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
            </section>
          </div>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" loading={isPending} disabled={isPending}>
              Save All Legal Policies
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}
