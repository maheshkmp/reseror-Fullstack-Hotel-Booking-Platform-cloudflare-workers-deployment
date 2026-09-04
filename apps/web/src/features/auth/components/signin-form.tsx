"use client";

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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useId, useState } from "react";
import { motion, type Variants } from "framer-motion";

const MotionDiv = motion.div as any;

import { authClient } from "@/lib/auth-client";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { signinSchema, type SigninSchemaT } from "core/zod";
import { getClient } from "@/lib/rpc/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQueryState } from "nuqs";
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

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const toastId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useQueryState("mode");
  const callbackUrl = searchParams.get("callbackUrl");
  const [isLoading, setIsLoading] = useState(false);

  const form = useAppForm({
    validators: { onChange: signinSchema },
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: ({ value }) => handleSignin(value),
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleSignin = async (values: SigninSchemaT) => {
    setIsLoading(true);
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      fetchOptions: {
        onRequest() {
          toast.loading("Signing in...", { id: toastId });
        },
        async onSuccess(ctx) {
          toast.success("User signed in successfully!", { id: toastId });
          
          // Manage hotel owner mode persistence
          if (mode === "hotelOwner") {
            localStorage.setItem("reseror_signup_mode", "hotelOwner");
          } else {
            localStorage.removeItem("reseror_signup_mode");
          }

          try {
            console.log("[DEBUG] Sign-in successful, redirecting using user data...");
            const user = (ctx as any).data.user;
            console.log("[DEBUG] User data from sign-in:", user);

            const storedMode = localStorage.getItem("reseror_signup_mode");
            const isIntentHotelOwner = mode === "hotelOwner" || storedMode === "hotelOwner" || user.role === "hotelOwner";
            const userType = user.role === "admin" ? "systemAdmin" : isIntentHotelOwner ? "hotelOwner" : "user";
            const setup = user.setup ?? false;

            if (callbackUrl) {
              console.log(`[DEBUG] Redirecting to callbackUrl: ${callbackUrl}`);
              router.replace(callbackUrl);
            } else if (userType === "systemAdmin") {
              router.replace("/admin");
            } else if (userType === "hotelOwner" && !setup) {
              router.replace("/setup-organization?mode=hotelOwner");
            } else {
              router.replace("/account");
            }
          } catch (error) {
            console.error("[DEBUG] Error during post-signin redirect", error);
            if (callbackUrl) {
              router.replace(callbackUrl);
            } else {
              router.replace("/");
            }
          }
          
          router.refresh();
        },
        async onError(ctx) {
          setIsLoading(false);
          if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
            toast.info("Email not verified. Redirecting to verification page...", { id: toastId });
            await authClient.emailOtp.sendVerificationOtp({
              email: values.email,
              type: "email-verification",
            });
            router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
            return;
          }
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
          Welcome back
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm">
          Enter your email and password to sign in.
        </p>
      </MotionDiv>
      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3">
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
                    <div className="flex items-center justify-between">
                      <field.FormLabel className="text-sm font-medium">Password</field.FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-primary hover:underline underline-offset-4"
                      >
                        Forgot password?
                      </Link>
                    </div>
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

            {/* <MotionDiv variants={itemVariants} className="flex items-center space-x-2 rounded-lg border border-transparent bg-muted/30 p-2 transition-colors hover:bg-muted/50">
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
            </MotionDiv> */}

            <MotionDiv variants={itemVariants}>
              <Button
                type="submit"
                className="h-10 w-full text-sm font-semibold shadow-sm shadow-primary/5 transition-all hover:scale-[1.01] active:scale-[0.99]"
                loading={isLoading}
                icon={form.state.isSubmitSuccessful && <CheckIcon className="size-4" />}
              >
                Sign In
              </Button>
            </MotionDiv>
          </div>
        </form>
      </form.AppForm>

      <MotionDiv variants={itemVariants} className="text-center text-xs md:text-sm">
        {`Don't have an account?`}
        {` `}
        <Link href="/signup" className="font-semibold text-primary hover:underline underline-offset-4">
          Sign Up
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
