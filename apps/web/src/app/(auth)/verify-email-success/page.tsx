"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyEmailSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // The verification happens automatically via the URL
        // Better-auth handles the token from the URL params
        // We just need to check if we're on this page after clicking the email link
        const token = searchParams.get("token");
        const email = searchParams.get("email");

        if (!token) {
          setVerificationStatus("error");
          setErrorMessage("Invalid verification link");
          return;
        }

        // The verification is handled by better-auth middleware
        // If we reach this page, it means verification was successful
        setVerificationStatus("success");

        // Auto redirect to signin after 3 seconds
        setTimeout(() => {
          const mode = searchParams.get("mode");
          const redirectUrl = mode ? `/signin?mode=${mode}` : "/signin";
          router.push(redirectUrl);
        }, 3000);
      } catch (error) {
        setVerificationStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Verification failed"
        );
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <div className="mx-auto md:mx-0 mb-2 flex h-16 w-16 items-center justify-center rounded-full transition-all">
          {verificationStatus === "loading" && (
            <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
          )}
          {verificationStatus === "success" && (
            <div className="rounded-full bg-primary/10 p-4">
              <CheckCircle2 className="h-8 w-8 text-primary font-bold" />
            </div>
          )}
          {verificationStatus === "error" && (
            <div className="rounded-full bg-destructive/10 p-4">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {verificationStatus === "loading" && "Verifying Your Email..."}
          {verificationStatus === "success" && "Email Verified!"}
          {verificationStatus === "error" && "Verification Failed"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {verificationStatus === "loading" &&
            "Please wait while we verify your email address. This only takes a moment."}
          {verificationStatus === "success" &&
            "Your email has been successfully verified. You are now part of the Reseror community."}
          {verificationStatus === "error" && (errorMessage || "Something went wrong during the verification process.")}
        </p>
      </div>

      <div className="grid gap-6">
        {verificationStatus === "success" && (
          <div className="rounded-xl bg-primary/5 p-4 text-sm text-primary/80 border border-primary/10 transition-all">
            <p className="font-semibold mb-1">What&apos;s next?</p>
            <p className="text-xs leading-relaxed">
              You&apos;ll be redirected to the sign in page in a few
              seconds. If not, click the button below to continue.
            </p>
          </div>
        )}

        <Button
          onClick={() => {
            const mode = searchParams.get("mode");
            const redirectUrl = mode ? `/signin?mode=${mode}` : "/signin";
            router.push(redirectUrl);
          }}
          className="h-11 w-full text-base font-semibold shadow-sm shadow-primary/5 transition-all hover:scale-[1.01] active:scale-[0.99]"
          variant={verificationStatus === "success" ? "default" : "outline"}
        >
          {verificationStatus === "success"
            ? "Continue to Sign In"
            : "Back to Sign In"}
        </Button>
      </div>
    </div>
  );
}
