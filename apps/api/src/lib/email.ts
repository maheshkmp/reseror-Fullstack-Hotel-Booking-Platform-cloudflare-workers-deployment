import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  // Generate a 6-digit OTP from the token
  private generateOTP(token: string): string {
    // Use a hash of the token to generate a consistent 6-digit number
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      hash = (hash << 5) - hash + token.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    // Get absolute value and ensure it's 6 digits
    const otp = Math.abs(hash % 1000000)
      .toString()
      .padStart(6, "0");
    return otp;
  }

  private createTransporter(): Transporter {
    // Create a fresh transporter for each email send
    // SMTP configuration from environment variables
    const port = parseInt(process.env.SMTP_PORT || "465");
    const secure = port === 465;

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      authMethod: 'LOGIN',
      // Force IPv4 to avoid IPv6 connectivity issues with Hostinger
      family: 4,
      // Proper EHLO hostname
      name: "reseror.com",
      tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
    } as any);
  }

  async sendEmail({ to, subject, html, text }: EmailOptions): Promise<void> {
    try {
      const transporter = this.createTransporter();
      const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.EMAIL_FROM || process.env.SMTP_USER;
      const from = `Reseror <${fromEmail}>`;

      // Verify connection before sending
      await transporter.verify();
      console.log("SMTP connection verified successfully");

      await transporter.sendMail({
        from,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML tags for text version
      });

      console.log(`Email sent successfully to ${to}`);

      // Close the connection after sending
      transporter.close();
    } catch (error) {
      console.error("Failed to send email:", error);

      // Provide more helpful error messages
      if (error instanceof Error) {
        if (error.message.includes("ECONNREFUSED")) {
          throw new Error(
            `SMTP connection refused. Please check your SMTP host (${process.env.SMTP_HOST}) and port (${process.env.SMTP_PORT}).`
          );
        } else if (error.message.includes("EAUTH")) {
          throw new Error(
            "SMTP authentication failed. Please check your SMTP username and password."
          );
        } else if (error.message.includes("ETIMEDOUT")) {
          throw new Error(
            "SMTP connection timeout. The server may be down or unreachable."
          );
        }
      }

      throw new Error(
        `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async sendVerificationEmail(
    email: string,
    url: string,
    token: string
  ): Promise<void> {
    const otp = this.generateOTP(token);
    console.log(`📧 Sending OTP to ${email}: ${otp} (Token: ${token})`);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 40px;
              margin: 20px 0;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #1a1a1a;
              margin: 0;
              font-size: 24px;
            }
            .content {
              margin: 30px 0;
            }
            .otp-code {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #ffffff;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              text-align: center;
              padding: 20px;
              border-radius: 8px;
              margin: 30px 0;
              font-family: 'Courier New', monospace;
            }
            .info-box {
              background-color: #f0f7ff;
              border-left: 4px solid #0070f3;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email Address</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up! Please use the verification code below to verify your email address:</p>
              <div class="otp-code">${otp}</div>
              <div class="info-box">
                <p style="margin: 0; font-size: 14px;"><strong>Important:</strong></p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
                  <li>This code will expire in 15 minutes</li>
                  <li>Enter this code on the verification page</li>
                  <li>Do not share this code with anyone</li>
                </ul>
              </div>
              <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: "Verify Your Email Address",
      html,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    url: string,
    token: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 40px;
              margin: 20px 0;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #1a1a1a;
              margin: 0;
              font-size: 24px;
            }
            .content {
              margin: 30px 0;
            }
            .button {
              display: inline-block;
              background-color: #dc2626;
              color: #ffffff;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: 500;
            }
            .button:hover {
              background-color: #b91c1c;
            }
            .token {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 6px;
              font-family: 'Courier New', monospace;
              word-break: break-all;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <div style="text-align: center;">
                <a href="${url}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <div class="token">${url}</div>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: "Reset Your Password",
      html,
    });
  }
}

export const emailService = new EmailService();
