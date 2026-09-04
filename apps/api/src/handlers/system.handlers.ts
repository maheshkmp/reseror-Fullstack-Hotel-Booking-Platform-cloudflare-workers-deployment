import * as HttpStatusCodes from "stoker/http-status-codes";
import type { APIRouteHandler } from "@/types";
import { eq } from "drizzle-orm";
import * as schemas from "core/database/schema";
import { sendEmail } from "core/email/service";
import type { CheckUserTypeRoute, TestEmailRoute } from "../routes/system.routes";

// check User type handler
export const checkUserTypeHandler: APIRouteHandler<CheckUserTypeRoute> = async (
  c
) => {
  try {
    const session = c.get("session");
    const user = c.get("user");
    const db = c.get("db");

    if (!session || !user) {
      return c.json(
        { message: "Unauthorized access" },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Refresh user from database to ensure we have the latest role (avoids stale session)
    const [currentUser] = await db.select().from(schemas.user)
      .where(eq(schemas.user.id, user.id))
      .limit(1);

    if (!currentUser) {
      return c.json({ userType: "user" as const, setup: false }, HttpStatusCodes.OK);
    }

    console.log(`[DEBUG] checkUserType for user ${currentUser.id} (role: ${currentUser.role})`);

    // 1. Check for Admin
    if (currentUser.role === "admin") {
      return c.json({ userType: "systemAdmin" as const, setup: true }, HttpStatusCodes.OK);
    }

    // 2. Check for Hotel Owner by Role
    if (currentUser.role === "hotelOwner") {
      return c.json({ userType: "hotelOwner" as const, setup: (currentUser as any).setup ?? false }, HttpStatusCodes.OK);
    }

    // 3. Resolve by Organization Status (for new setups or fallback)
    let isHotelOwner = !!session.activeOrganizationId;

    if (!isHotelOwner) {
      // Fallback: Check member table using a direct SELECT
      const [userOrg] = await db.select().from(schemas.member)
        .where(eq(schemas.member.userId, user.id))
        .limit(1);
      
      if (userOrg) {
        isHotelOwner = true;
        console.log(`[DEBUG] User ${user.id} matched member record for org ${userOrg.organizationId}`);
      }
    }

    if (isHotelOwner) {
      // SYNC: Ensure user.role is set to hotelOwner for other parts of the system
      // We check for 'user', null, undefined, or empty strings
      if (currentUser.role !== "admin" && currentUser.role !== "hotelOwner") {
        await db.update(schemas.user)
          .set({ role: "hotelOwner", updatedAt: new Date() })
          .where(eq(schemas.user.id, currentUser.id));
        console.log(`[DEBUG] Synced user.role to hotelOwner for ${currentUser.email}`);
      }
      return c.json({ userType: "hotelOwner" as const, setup: (currentUser as any).setup ?? false }, HttpStatusCodes.OK);
    }

    return c.json({ userType: "user" as const, setup: (currentUser as any).setup ?? false }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("[ERROR] checkUserTypeHandler:", error);
    return c.json({ userType: "user" as const }, HttpStatusCodes.OK);
  }
};

export const testEmailHandler: APIRouteHandler<TestEmailRoute> = async (c) => {
  const { email } = c.req.valid("query");
  
  console.log(`[TEST-EMAIL] Triggering test email to: ${email}`);
  
  try {
    await sendEmail({
      to: email,
      subject: "Test Email from Reseror API",
      html: "<p>This is a test email to verify SMTP configuration.</p>",
    });
    
    return c.json({ message: "Test email sent successfully" }, HttpStatusCodes.OK);
  } catch (error: any) {
    console.error("[TEST-EMAIL] Error:", error);
    return c.json({ message: `Failed to send email: ${error.message}` }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};
