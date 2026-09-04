import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";

import { type Database } from "../database";

import * as authSchema from "../database/schema/auth.schema";
import { admin, emailOTP, openAPI, organization } from "better-auth/plugins";
import { sendEmail, getStandardHtmlLayout } from "../email/service";


export interface AuthConfigurations {
  database: Database;
  secret?: string;
  plugins?: Parameters<typeof betterAuth>[0]["plugins"];
}

export function configAuth(config: AuthConfigurations) {
  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";
    
  console.log(`[AUTH-CONFIG] Environment: ${process.env.NODE_ENV}, isProduction: ${isProduction}`);

  const baseAuthInstance = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
      "https://www.reseror.com",
      "https://reseror.com",
      "https://api.reseror.com",
      "http://localhost:3000",
      "http://localhost:4000",
    ],

    database: drizzleAdapter(config.database, {
      provider: "pg",
      schema: authSchema,
      usePlural: false
    }),
    secret: config.secret,
    plugins: [
      admin(),
      openAPI(),
      organization({
        allowUserToCreateOrganization() {
          // TODO: In future, Allow permissions based on user's subscription
          return true;
        }
      }),
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          console.log(`[AUTH] 📧 Sending ${type} OTP to ${email}: ${otp}`);
          if (type === "email-verification") {
            try {
              const content = `
                <p>Hi there,</p>
                <p>Thank you for joining Reseror. Please enter the following code to verify your email address:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #004BD7; background-color: #f0f4ff; padding: 10px 20px; border-radius: 8px; border: 1px dashed #004BD7;">${otp}</span>
                </div>
                <p>This code will expire in 15 minutes. If you did not sign up for an account, please ignore this email.</p>
              `;
              const html = getStandardHtmlLayout(content, "Verify Your Email");
              await sendEmail({
                to: email,
                subject: `${otp} is your verification code - Reseror`,
                html,
              });
              console.log(`[AUTH] ✅ Verification OTP sent successfully to ${email}`);
            } catch (error: any) {
              console.error(`[AUTH] ❌ Failed to send verification OTP to ${email}:`, error.message);
              throw new Error(`Failed to send verification email: ${error.message}`);
            }
          }
        },
      }),
      ...(config.plugins || [])
    ],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      async sendResetPassword({ user, url, token }: any) {
        const frontendUrl = process.env.FRONTEND_URL || "https://www.reseror.com";
        const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

        const content = `
          <p>Hi ${user.name || "there"},</p>
          <p>We received a request to reset your password. Click the button below to choose a new one:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button" style="display:inline-block; background-color:#004BD7; color:white; padding:12px 24px; text-decoration:none; border-radius:8px; font-weight:bold;">Reset Password</a>
          </div>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
        `;
        const html = getStandardHtmlLayout(content, "Reset Your Password");
        await sendEmail({
          to: user.email,
          subject: "Reset Your Password - Reseror",
          html,
        });
      },
    },
    user: {
      additionalFields: {
        setup: {
          type: "boolean",
          required: false,
          defaultValue: false
        },
        role: {
          type: "string",
          required: false,
          defaultValue: "user"
        },
        bio: {
          type: "string",
          required: false
        },
        phoneNumber: {
          type: "string",
          required: false
        },
        nationality: {
          type: "string",
          required: false
        },
        dateOfBirth: {
          type: "date",
          required: false
        }
      }
    },

    advanced: {
      cookies: {
        session_token: {
          attributes: {
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            httpOnly: true
          }
        }
      },
      // Enable cross-subdomain cookies for Vercel deployment
      crossSubDomainCookies: isProduction
        ? {
          enabled: true,
          domain: ".reseror.com" // Share cookies across subdomains
        }
        : undefined,
      defaultCookieAttributes: {
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        httpOnly: true,
        partitioned: isProduction // Only partition if secure
      }
    }
  });

  return baseAuthInstance;
}

export type AuthInstance = ReturnType<typeof configAuth>;

export type Session = AuthInstance["$Infer"]["Session"]