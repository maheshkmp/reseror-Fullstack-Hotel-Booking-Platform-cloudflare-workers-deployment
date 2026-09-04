"use client";

import { useGetSettings } from "../api/use-get-settings";
import { useUpdateSettings } from "../api/use-update-settings";
import { useAppForm } from "@/components/ui/tanstack-form";
import { insertSiteSettingsSchema, type UpdateSiteSettings } from "core/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useCallback } from "react";
import { SettingsFormSkeleton } from "./settings-form-skeleton";

export function SiteInfoForm() {
  const { data: settings, isLoading } = useGetSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const siteInfoSchema = insertSiteSettingsSchema.pick({
    siteName: true,
    siteMetaDescription: true,
    seoKeywordsShort: true,
    seoKeywordsLong: true,
    copyrightText: true,
    defaultCommissionRate: true,
  }).required();

  const form = useAppForm({
    validators: { onChange: siteInfoSchema },
    defaultValues: {
      siteName: settings?.siteName || "Reseror",
      siteMetaDescription: settings?.siteMetaDescription || "",
      seoKeywordsShort: settings?.seoKeywordsShort || "",
      seoKeywordsLong: settings?.seoKeywordsLong || "",
      copyrightText: settings?.copyrightText || "",
      defaultCommissionRate: settings?.defaultCommissionRate || "10.00",
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
        <CardTitle>Site Information</CardTitle>
        <CardDescription>
          General settings for your website branding and SEO.
        </CardDescription>
      </CardHeader>
      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <form.AppField
                name="siteName"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Site Name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="Enter site name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              <form.AppField
                name="defaultCommissionRate"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Global Commission Rate (%)</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 10.00"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
            </div>



            <form.AppField
              name="siteMetaDescription"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Site Meta Description</field.FormLabel>
                  <field.FormControl>
                    <Textarea
                      placeholder="Enter meta description for SEO"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
               <form.AppField
                name="seoKeywordsShort"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>SEO Keywords (Short)</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="e.g. travel, hotels, booking"
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
               <form.AppField
                name="seoKeywordsLong"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>SEO Keywords (Long)</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="e.g. best hotels in sri lanka, cheap villa booking"
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
            </div>

            <form.AppField
              name="copyrightText"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Copyright Text</field.FormLabel>
                  <field.FormControl>
                    <Input
                      placeholder="e.g. © 2024 Reseror. All rights reserved."
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
              Save Site Information
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}
