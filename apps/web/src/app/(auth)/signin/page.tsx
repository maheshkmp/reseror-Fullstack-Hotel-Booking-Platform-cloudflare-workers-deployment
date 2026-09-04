import { SignInForm } from "@/features/auth/components/signin-form";
import { Suspense } from "react";

export default function SigninPage() {
  return <Suspense><SignInForm /></Suspense>;
}
