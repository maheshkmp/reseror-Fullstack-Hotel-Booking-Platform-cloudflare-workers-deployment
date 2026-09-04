"use client";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useId, useState } from "react";
import { toast } from "sonner";
import { motion, type Variants } from "framer-motion";

const MotionDiv = motion.div as any;

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema, type ResetPasswordSchemaT } from "core/zod";

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

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const toastId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get("token");

  const form = useAppForm({
    validators: { onChange: resetPasswordSchema },
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    },
    onSubmit: ({ value }) => handleSignin(value)
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleSignin = async (values: ResetPasswordSchemaT) => {
    if (!token) {
      toast.error("Invalid or expired token", { id: toastId });
      return;
    }

    setIsLoading(true);
    await authClient.resetPassword({
      newPassword: values.newPassword,
      token,
      fetchOptions: {
        onRequest() {
          toast.loading("Updating Password...", { id: toastId });
        },
        onSuccess(ctx) {
          toast.success("Password updated successfully!", { id: toastId });
          router.push("/signin");
        },
        onError(ctx) {
          setIsLoading(false);
          toast.error(`Failed: ${ctx.error.message}`, { id: toastId });
        }
      }
    });
  };

  return (
    <MotionDiv 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-col gap-6", className)} 
      {...props}
    >
      <MotionDiv variants={itemVariants} className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Update Password
        </h1>
        <p className="text-muted-foreground text-sm">
          Set a new, strong password for your Reseror account.
        </p>
      </MotionDiv>

      {(!token && (
        <MotionDiv variants={itemVariants}>
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
            <AlertTitle>Invalid or expired token</AlertTitle>
            <AlertDescription>
              Please request a new password reset link or validate token is correct.
            </AlertDescription>
          </Alert>
        </MotionDiv>
      ))}

      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5">
            <MotionDiv variants={itemVariants}>
              <form.AppField
                name="newPassword"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel className="text-sm font-medium">New Password</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
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
            </MotionDiv>

            <MotionDiv variants={itemVariants}>
              <Button
                type="submit"
                className="h-11 w-full text-base font-semibold shadow-sm shadow-primary/5 transition-all hover:scale-[1.01] active:scale-[0.99]"
                disabled={isLoading || !token}
                loading={isLoading}
                icon={form.state.isSubmitSuccessful && <CheckIcon className="size-4" />}
              >
                Update Password
              </Button>
            </MotionDiv>
          </div>
        </form>
      </form.AppForm>

      <MotionDiv variants={itemVariants} className="text-center text-sm">
        {`Don't have an account? `}
        <Link href="/signup" className="font-semibold text-primary hover:underline underline-offset-4">
          Sign Up
        </Link>
      </MotionDiv>
    </MotionDiv>
  );
}
