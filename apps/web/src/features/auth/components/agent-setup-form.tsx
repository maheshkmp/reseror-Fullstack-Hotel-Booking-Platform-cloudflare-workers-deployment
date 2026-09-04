"use client";
import { CheckIcon, ImageIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { authClient } from "@/lib/auth-client";
import { toKebabCase } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  setupOrgSchema,
  type SetupOrgSchemaT
} from "core/zod";

export function AgentSetupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState(1);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const toastId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read hotel owner mode from URL params or localStorage fallback (handles interrupted flows)
  const [isHotelOwner, setIsHotelOwner] = useState(false);
  useEffect(() => {
    const urlMode = searchParams.get("mode");
    const storedMode = localStorage.getItem("reseror_signup_mode");
    if (urlMode === "hotelOwner" || storedMode === "hotelOwner") {
      setIsHotelOwner(true);
    }
  }, [searchParams]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const form = useAppForm({
    validators: { onChange: setupOrgSchema },
    defaultValues: {
      name: "",
      logo: "",
      company: "",
      phoneNumber: "",
      website: ""
    },
    onSubmit: ({ value }) => handleSetup(value)
  });

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    const name = form.getFieldValue("name");
    if (!name) {
      toast.error("Please enter your name to continue");
      return;
    }
    setStep(2);
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toast.info("Submitting form...");
      if (!form.state.canSubmit) {
        toast.error("Validation failed. Check the form for errors.");
      }
      form.handleSubmit();
    },
    [form]
  );

  const handleSetup = async (values: SetupOrgSchemaT) => {
    try {
      toast.loading("Finalizing your profile...", { id: toastId });

      const updatedUser = await authClient.updateUser({
        name: values.name,
        setup: true
      } as any);

      if (updatedUser.error) throw new Error(updatedUser.error.message);

      const slug = toKebabCase(values.name);

      const agentProfile = await authClient.organization.create({
        name: values.name,
        slug,
        logo: values.logo,
        metadata: {
          company: values.company,
          phoneNumber: values.phoneNumber,
          website: values.website
        }
      });

      if (agentProfile.error) throw new Error(agentProfile.error.message);

      // Clean up localStorage
      localStorage.removeItem("reseror_signup_mode");

      // Explicitly set the newly created org as active on the session
      if (agentProfile.data) {
        await authClient.organization.setActive({
          organizationId: agentProfile.data.id
        });
      }

      toast.success("Profile setup complete!", { id: toastId });
      if (isHotelOwner) {
        router.push("/account/setup");
      } else {
        router.push("/account");
      }
      router.refresh();
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed: ${error.message}`, { id: toastId });
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {step === 1 ? "Personal Profile" : "Business Profile"}
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm">
          {step === 1 
            ? "Let's start with your basic information." 
            : "Tell us more about your travel business."}
        </p>
      </div>

      {/* Stepper Indicators */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className={cn("h-1.5 w-10 rounded-full transition-colors", step >= 1 ? "bg-primary" : "bg-muted")} />
        <div className={cn("h-1.5 w-10 rounded-full transition-colors", step >= 2 ? "bg-primary" : "bg-muted")} />
      </div>

      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid gap-3"
              >
                <form.AppField
                  name="name"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="text-sm font-medium">Your Full Name</field.FormLabel>
                      <field.FormControl>
                        <Input
                          placeholder="John Doe"
                          className="h-11 bg-muted/50 border-none transition-all focus-visible:ring-primary/20"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="h-10 w-full text-sm font-semibold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Continue to Business Setup
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid gap-3"
              >
                <div className="w-full flex items-center justify-center">
                  <input
                    className="hidden"
                    type="file"
                    accept=".jpg, .png, .jpeg, .svg"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                  />

                  <form.AppField
                    name="logo"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormControl>
                          <div className="relative group cursor-pointer" onClick={() => {
                            if (!imageInputRef.current?.value) {
                              imageInputRef?.current?.click();
                            } else {
                              setLogoFile(null);
                              imageInputRef.current.value = "";
                            }
                          }}>
                            <Avatar className="size-20 border-4 border-muted/50 transition-transform group-hover:scale-105">
                              <AvatarImage
                                src={logoFile ? URL.createObjectURL(logoFile) : ""}
                                alt="logo"
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-muted">
                                <ImageIcon className="size-8 text-muted-foreground/50" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
                            </div>
                          </div>
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-3">
                  <form.AppField
                    name="company"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel className="text-sm font-medium">Business Name</field.FormLabel>
                        <field.FormControl>
                          <Input
                            placeholder="Grand Hilton Resort"
                            className="h-10 bg-muted/50 border-none transition-all focus-visible:ring-primary/20"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                  <form.AppField
                    name="phoneNumber"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel className="text-sm font-medium">Business Phone Number</field.FormLabel>
                        <field.FormControl>
                          <Input
                            placeholder="+1 234 567 890"
                            className="h-10 bg-muted/50 border-none transition-all focus-visible:ring-primary/20"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                  <form.AppField
                    name="website"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel className="text-sm font-medium">Business Website</field.FormLabel>
                        <field.FormControl>
                          <Input
                            placeholder="https://granthilton.com"
                            className="h-10 bg-muted/50 border-none transition-all focus-visible:ring-primary/20"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3 mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="h-10 flex-1 text-sm font-medium"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="h-10 flex-[2] text-sm font-semibold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                    loading={form.state.isSubmitting}
                    icon={form.state.isSubmitSuccessful && <CheckIcon className="size-4" />}
                  >
                    Complete Setup
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </form>
      </form.AppForm>
    </div>
  );
}
