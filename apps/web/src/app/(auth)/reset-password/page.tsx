import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { Suspense } from "react";

export default async function SigninPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
