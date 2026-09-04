import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Standard email sending service.
 * Attempts to send via SMTP if credentials are provided (env variables).
 * Falls back to console simulation if SMTP_HOST, SMTP_USER, or SMTP_PASS are missing.
 */
export const sendEmail = async (options: SendEmailOptions) => {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpPort = process.env.SMTP_PORT?.trim();

  const fromEmail = (process.env.SMTP_FROM_EMAIL?.trim() || smtpUser || "noreply@reseror.com");
  const from = `Reseror <${fromEmail}>`;
  const hasSmtpConfig = !!(smtpHost && smtpUser && smtpPass);

  console.log(`[EMAIL-SERVICE] SMTP Config: Host=${smtpHost}, Port=${smtpPort}, User=${smtpUser}, From=${fromEmail}`);
  console.log(`[EMAIL-SERVICE] Match check: User === From is ${smtpUser === fromEmail}`);

  if (!hasSmtpConfig) {
    console.log("------------------------------------------");
    console.log("📧 EMAIL SIMULATION (SMTP configuration missing)");
    console.log(`From: ${from}`);
    console.log(`To: ${Array.isArray(options.to) ? options.to.join(", ") : options.to}`);
    console.log(`Subject: ${options.subject}`);
    if (options.text) console.log(`Text Body: ${options.text}`);
    if (options.html) {
        console.log(`HTML Body (preview): ${options.html.substring(0, 500)}...`);
    }
    console.log("------------------------------------------");
    return { messageId: "dev-sim-id" };
  }

  const port = parseInt(smtpPort || "465");
  const secure = port === 465;

  console.log(`[EMAIL-SERVICE] Using port=${port}, secure=${secure}, family=4`);

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port,
    secure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    authMethod: 'LOGIN',
    // Force IPv4 to avoid IPv6 connectivity issues with Hostinger
    family: 4,
    // Proper EHLO hostname (avoid [127.0.0.1] which some servers treat differently)
    name: "reseror.com",
    debug: true,
    logger: true,
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
  } as any);

  try {
    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log(`✅ Email sent successfully: ${options.subject} to ${options.to}`);
    return info;
  } catch (error: any) {
    console.error("❌ Failed to send email:", {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response,
      host: smtpHost,
      port,
      secure,
      user: smtpUser,
    });
    throw error;
  }
};

/**
 * Clean, standard HTML layout for system emails.
 */
export const getStandardHtmlLayout = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
        .header { background-color: #07143d; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 40px; background-color: #ffffff; }
        .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888; }
        .button { display: inline-block; padding: 12px 24px; background-color: #07143d; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
        .summary-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .summary-table td { padding: 12px; border-bottom: 1px solid #eee; }
        .summary-table td:first-child { font-weight: bold; color: #666; width: 40%; }
        .highlight { color: #07143d; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} Reseror. All rights reserved.<br>
            Sri Lanka's Premium Property Marketplace
        </div>
    </div>
</body>
</html>
`;
