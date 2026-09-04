import {
  adminClient,
  emailOTPClient,
  organizationClient
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
// import { toast } from "sonner";

const authUrl =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:4000");

export const authClient = createAuthClient({
  baseURL: authUrl,

  plugins: [adminClient(), organizationClient(), emailOTPClient()],
  user: {
    additionalFields: {
      setup: {
        type: "boolean"
      },
      role: {
        type: "string"
      },
      bio: {
        type: "string"
      },
      phoneNumber: {
        type: "string"
      },
      nationality: {
        type: "string"
      },
      dateOfBirth: {
        type: "date"
      }
    }
  },
  fetchOptions: {
    onError: (ctx) => {
      console.error("BetterAuth Error Name:", ctx.error?.name);
      console.error("BetterAuth Error Message:", ctx.error?.message);
      console.error("BetterAuth Error Status:", (ctx.error as any)?.status);
      console.error("BetterAuth Error StatusText:", (ctx.error as any)?.statusText);
      console.error("BetterAuth Error full:", JSON.stringify(ctx.error, null, 2));
    },
    credentials: "include"
  }
});
