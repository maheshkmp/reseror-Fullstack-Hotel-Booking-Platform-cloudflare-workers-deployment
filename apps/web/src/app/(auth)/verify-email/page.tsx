"use client";

import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

import { authClient } from "@/lib/auth-client";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Email address not found");
      return;
    }

    setIsResending(true);
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });
      toast.success("New verification code sent! Please check your inbox.");
      setOtp("");
    } catch (error) {
      toast.error("Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email address not found");
      return;
    }

    if (otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit code");
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    await authClient.emailOtp.verifyEmail(
      {
        email,
        otp,
      },
      {
        onSuccess: () => {
          setIsVerified(true);
        },
        onError: (ctx) => {
          setOtpError(ctx.error.message || "Invalid verification code");
          toast.error(ctx.error.message || "Invalid verification code");
        },
        onResponse: () => {
          setIsVerifying(false);
        },
      }
    );
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setOtpError("");
  };

  const handleContinue = () => {
    const isHotelOwner = searchParams.get("mode") === "hotelOwner";
    
    if (isHotelOwner) {
      localStorage.setItem("reseror_signup_mode", "hotelOwner");
      router.push("/signin?mode=hotelOwner");
    } else {
      localStorage.removeItem("reseror_signup_mode");
      router.push("/signin");
    }
  };

  if (isVerified) {
    return (
      <div className="flex flex-col gap-6 items-center text-center">
        <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Email Verified!
        </h1>
        <p className="text-muted-foreground text-sm max-w-sm">
          Your email has been successfully verified. You are now ready to take the next step.
        </p>

        <div className="w-full pt-4">
          <Button
            onClick={handleContinue}
            className="h-12 w-full text-base font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <div className="mx-auto md:mx-0 mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Verify Your Email
        </h1>
        <p className="text-muted-foreground text-sm">
          Join Reseror today and start planning your next dream getaway. We&apos;ve sent a 6-digit verification code to
          {email && (
            <span className="block font-semibold text-foreground mt-1">{email}</span>
          )}
        </p>
      </div>

      <div className="grid gap-6 px-1">
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="otp" className="text-sm font-medium">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              className="h-14 text-center text-3xl font-mono tracking-[0.5em] bg-muted/50 border-none transition-all focus-visible:ring-primary/20"
              disabled={isVerifying}
            />
            {otpError && <p className="text-xs font-medium text-destructive">{otpError}</p>}
          </div>

          <div className="rounded-xl bg-muted/30 p-4 text-xs border border-muted/50">
            <p className="mb-2 text-muted-foreground leading-relaxed">
              Please enter the 6-digit code sent to your email.
            </p>
            <p className="font-medium text-foreground/70">
              The code will expire in 15 minutes.
            </p>
          </div>

          <Button
            type="submit"
            className="h-11 w-full text-base font-semibold shadow-sm shadow-primary/5 transition-all hover:scale-[1.01] active:scale-[0.99]"
            disabled={isVerifying || otp.length !== 6}
            loading={isVerifying}
            icon={!isVerifying ? <CheckCircle2 className="mr-2 h-4 w-4" /> : undefined}
          >
            Verify Email
          </Button>
        </form>

        <div className="space-y-3 pt-2">
          <p className="text-sm text-muted-foreground text-center">
            Didn&apos;t receive the code?
          </p>
          <Button
            onClick={handleResendEmail}
            variant="outline"
            className="h-11 w-full border-muted-foreground/20 bg-transparent transition-colors hover:bg-muted/50"
            disabled={isResending}
            loading={isResending}
          >
            Resend Verification Code
          </Button>
        </div>

        <Button
          onClick={() => router.push("/signin")}
          variant="ghost"
          className="w-full text-muted-foreground hover:text-primary transition-colors"
        >
          Back to Sign In
        </Button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

// Helper component prop types
interface VerifyEmailProps extends React.ComponentProps<"div"> {
  email?: string;
}
