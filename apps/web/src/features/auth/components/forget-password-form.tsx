"use client";

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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useId, useState } from "react";
import { motion, type Variants } from "framer-motion";

const MotionDiv = motion.div as any;

import { authClient } from "@/lib/auth-client";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { forgotPasswordSchema, type ForgotPasswordSchemaT } from "core/zod";

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

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const toastId = useId();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useAppForm({
    validators: { onChange: forgotPasswordSchema },
    defaultValues: {
      email: ""
    },
    onSubmit: ({ value }) => handleForgotPassword(value)
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleForgotPassword = async (values: ForgotPasswordSchemaT) => {
    setIsLoading(true);
    await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: "/reset-password",
      fetchOptions: {
        onRequest() {
          toast.loading("Requesting Password Reset...", { id: toastId });
        },
        onSuccess() {
          toast.success("Password reset link sent!", {
            id: toastId,
            description: "Please check your email inbox for the reset link."
          });
          setIsLoading(false);
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
          Reset Password
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </MotionDiv>

      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5">
            <MotionDiv variants={itemVariants}>
              <form.AppField
                name="email"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel className="text-sm font-medium">Email</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="john@example.com"
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
                loading={isLoading}
                icon={form.state.isSubmitSuccessful && <CheckIcon className="size-4" />}
              >
                Request Link
              </Button>
            </MotionDiv>
          </div>
        </form>
      </form.AppForm>

      <MotionDiv variants={itemVariants} className="text-center text-sm">
        {`Remember your password? `}
        <Link href="/signin" className="font-semibold text-primary hover:underline underline-offset-4">
          Sign In
        </Link>
      </MotionDiv>
    </MotionDiv>
  );
}
