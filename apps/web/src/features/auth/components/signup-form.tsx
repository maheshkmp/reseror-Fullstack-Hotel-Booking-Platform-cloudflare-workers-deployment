"use client";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useId, useState } from "react";
import { toast } from "sonner";
import { motion, type Variants } from "framer-motion";

const MotionDiv = motion.div as any;

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";

import { authClient } from "@/lib/auth-client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { signupSchema, type SignupSchema } from "core/zod";
import { useSearchParams } from "next/navigation";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }
  },
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const toastId = useId();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const [mode, setMode] = useQueryState("mode");
  const callbackUrl = searchParams.get("callbackUrl");

  const form = useAppForm({
    validators: { onChange: signupSchema },
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as SignupSchema,
    onSubmit: ({ value }) => handleSignup(value),
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleSignup = async (values: SignupSchema) => {
    const isHotelOwner = mode === "hotelOwner";
    
    setIsLoading(true);
    await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name || values.email.split('@')[0],
      fetchOptions: {
        onRequest() {
          toast.loading("Registering new user...", { id: toastId });
        },
        async onSuccess(ctx) {
          try {
            // Send verification OTP immediately
            await authClient.emailOtp.sendVerificationOtp({
              email: values.email,
              type: "email-verification",
            });

            if (isHotelOwner) {
              localStorage.setItem("reseror_signup_mode", "hotelOwner");
            } else {
              localStorage.removeItem("reseror_signup_mode");
            }

            toast.success("A 6-digit code has been sent to your email!", {
              id: toastId,
            });
            // Redirect to verification pending page
            const verifyUrl = "/verify-email?email=" + encodeURIComponent(values.email) +
              (isHotelOwner ? "&mode=hotelOwner" : "");
            router.push(verifyUrl);
          } catch (error) {
            console.error("Failed to send verification OTP:", error);
            setIsLoading(false);
            toast.error("Account created, but failed to send verification code. Please try resending from the verification page.", {
              id: toastId,
            });
            // Still redirect so they can try resending
            const verifyUrl = "/verify-email?email=" + encodeURIComponent(values.email) +
              (isHotelOwner ? "&mode=hotelOwner" : "");
            router.push(verifyUrl);
          }
        },
        onError(ctx) {
          setIsLoading(false);
          toast.error(`Failed: ${ctx.error.message}`, { id: toastId });
        },
      },
    });
  };

  return (
    <MotionDiv
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-col gap-4", className)} 
      {...props}
    >
      <MotionDiv variants={itemVariants} className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm">
          Join Reseror today and start planning your next dream getaway.
        </p>
      </MotionDiv>

      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <MotionDiv variants={itemVariants}>
              <form.AppField
                name="email"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel className="text-sm font-medium">Email</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="john@example.com"
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
            </MotionDiv>

            <MotionDiv variants={itemVariants}>
              <form.AppField
                name="password"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel className="text-sm font-medium">Password</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
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
            </MotionDiv>

            <MotionDiv variants={itemVariants}>
              <form.AppField
                name="confirmPassword"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel className="text-sm font-medium">Confirm Password</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
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
            </MotionDiv>

            <MotionDiv variants={itemVariants} className="flex items-center space-x-2 rounded-lg border border-transparent bg-muted/30 p-2 transition-colors hover:bg-muted/50">
              <Checkbox
                id="hotelOwnerCheck"
                checked={mode === "hotelOwner"}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setMode("hotelOwner");
                  } else {
                    setMode("");
                  }
                }}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="hotelOwnerCheck"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Continue as Hotel Owner
                </Label>
                <p className="text-xs text-muted-foreground">
                  Check this if you want to list and manage your properties.
                </p>
              </div>
            </MotionDiv>

            <MotionDiv variants={itemVariants}>
              <Button
                type="submit"
                className="mt-2 h-10 w-full text-sm font-semibold shadow-sm shadow-primary/5 transition-all hover:scale-[1.01] active:scale-[0.99]"
                loading={isLoading}
                icon={form.state.isSubmitSuccessful && <CheckIcon className="size-4" />}
              >
                Sign Up
              </Button>
            </MotionDiv>
          </div>
        </form>
      </form.AppForm>

      <MotionDiv variants={itemVariants} className="text-center text-xs md:text-sm">
        {`Already have an account? `}
        <Link href="/signin" className="font-semibold text-primary hover:underline underline-offset-4">
          Sign In
        </Link>
      </MotionDiv>

      <MotionDiv variants={itemVariants} className="px-8 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link href="/terms" className="hover:text-primary underline underline-offset-4">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="hover:text-primary underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </MotionDiv>
    </MotionDiv>
  );
}
