import * as schemas from "core/database/schema";
import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { APIRouteHandler } from "@/types";
import type { TestRoute, VerifyEmailRoute, DebugOtpRoute, SwitchRoleRoute } from "../routes/auth.routes";

// Helper function to generate OTP from token (consistent with EmailService)
function generateOTP(token: string): string {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash << 5) - hash + token.charCodeAt(i);
    hash = hash & hash;
  }
  const otp = Math.abs(hash % 1000000)
    .toString()
    .padStart(6, "0");
  return otp;
}

export const test: APIRouteHandler<TestRoute> = async (c) => {
  return c.json({ message: "Auth routes are working!" }, HttpStatusCodes.OK);
};

export const verifyEmail: APIRouteHandler<VerifyEmailRoute> = async (c) => {
  const db = c.get("db");
  const { email, otp } = c.req.valid("json");

  try {
    // Find the user by email
    const [userRecord] = await db
      .select()
      .from(schemas.user)
      .where(eq(schemas.user.email, email))
      .limit(1);

    if (!userRecord) {
      return c.json({ error: "User not found" }, HttpStatusCodes.NOT_FOUND);
    }

    // Find the verification record for this user
    const [verificationRecord] = await db
      .select()
      .from(schemas.verification)
      .where(eq(schemas.verification.identifier, email))
      .orderBy(desc(schemas.verification.createdAt))
      .limit(1);

    if (!verificationRecord) {
      return c.json({ error: "No verification request found" }, HttpStatusCodes.NOT_FOUND);
    }

    // Check if verification has expired
    if (new Date() > verificationRecord.expiresAt) {
      return c.json({ error: "Verification code has expired" }, HttpStatusCodes.BAD_REQUEST);
    }

    // Use the stored value directly (Better Auth emailOTP plugin stores the OTP itself here)
    const expectedOTP = verificationRecord.value;

    if (otp !== expectedOTP) {
      return c.json({ error: "Invalid verification code" }, HttpStatusCodes.BAD_REQUEST);
    }

    // Update user's email verified status
    await db
      .update(schemas.user)
      .set({
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(schemas.user.email, email)); // Use email as it's the identifier

    // Delete the verification record
    await db
      .delete(schemas.verification)
      .where(eq(schemas.verification.id, verificationRecord.id));

    return c.json({
      success: true,
      message: "Email verified successfully",
    }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("OTP verification error:", error);
    return c.json({ error: "Failed to verify OTP" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const debugOtp: APIRouteHandler<DebugOtpRoute> = async (c) => {
  const db = c.get("db");
  const { email } = c.req.valid("json");

  try {
    // Find the verification record for this user
    const [verificationRecord] = await db
      .select()
      .from(schemas.verification)
      .where(eq(schemas.verification.identifier, email))
      .orderBy(desc(schemas.verification.createdAt))
      .limit(1);

    if (!verificationRecord) {
      return c.json({ error: "No verification request found" }, HttpStatusCodes.NOT_FOUND);
    }

    // Return the stored OTP directly
    return c.json({
      email,
      otp: verificationRecord.value,
      expiresAt: verificationRecord.expiresAt,
      token: verificationRecord.value,
    }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Debug OTP error:", error);
    return c.json({ error: "Failed to get OTP" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};
export const switchRole: APIRouteHandler<SwitchRoleRoute> = async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const session = c.get("session");

  if (!session || !user) {
    return c.json({ error: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  // Preserve admin role
  if (user.role === "admin") {
     return c.json({ success: true, role: "admin" }, HttpStatusCodes.OK);
  }

  // Toggle between 'user' and 'hotelOwner'
  const newRole = user.role === "hotelOwner" ? "user" : "hotelOwner";

  await db
    .update(schemas.user)
    .set({
      role: newRole,
      updatedAt: new Date(),
    })
    .where(eq(schemas.user.id, user.id));

  return c.json({ success: true, role: newRole }, HttpStatusCodes.OK);
};
