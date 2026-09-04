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
export declare const sendEmail: (options: SendEmailOptions) => Promise<import("nodemailer/lib/smtp-pool").SentMessageInfo | {
    messageId: string;
}>;
/**
 * Clean, standard HTML layout for system emails.
 */
export declare const getStandardHtmlLayout: (content: string, title: string) => string;
export {};
