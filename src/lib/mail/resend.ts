import { Resend } from "resend";
import {
  formSubmittedSubject,
  formSubmittedTemplate,
  magicLinkSubject,
  magicLinkTemplate,
  welcomeSubject,
  welcomeTemplate,
} from "./templates";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM || "noreply@example.com";

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

export const resend = new Resend(resendApiKey);

// ─── Magic Link ────────────────────────────────────────────────────────────────

export async function sendMagicLinkEmail(to: string, verificationUrl: string) {
  return resend.emails.send({
    from: resendFrom,
    to,
    subject: magicLinkSubject,
    html: magicLinkTemplate({ verificationUrl }),
  });
}

// ─── Welcome ───────────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(
  to: string,
  params: { userName?: string; dashboardUrl: string },
) {
  return resend.emails.send({
    from: resendFrom,
    to,
    subject: welcomeSubject,
    html: welcomeTemplate(params),
  });
}

// ─── Form Submitted ────────────────────────────────────────────────────────────

export async function sendFormSubmittedEmail(
  to: string,
  params: {
    userName: string;
    formTitle: string;
    submittedAt: Date;
    reviewUrl: string;
  },
) {
  return resend.emails.send({
    from: resendFrom,
    to,
    subject: formSubmittedSubject(params.userName),
    html: formSubmittedTemplate(params),
  });
}
