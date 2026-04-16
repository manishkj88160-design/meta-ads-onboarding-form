import { TRPCError } from "@trpc/server";
import { ENV } from "./env";

export type EmailPayload = {
  to: string;
  subject: string;
  htmlContent: string;
};

/**
 * Sends an email through the Manus Email Service
 * Returns `true` if the email was sent successfully, `false` otherwise
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const { to, subject, htmlContent } = payload;

  if (!to || !subject || !htmlContent) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Email recipient, subject, and content are required.",
    });
  }

  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Email service URL is not configured.",
    });
  }

  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Email service API key is not configured.",
    });
  }

  const endpoint = new URL(
    "webdevtoken.v1.WebDevService/SendEmail",
    ENV.forgeApiUrl.endsWith("/") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`
  ).toString();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1",
      },
      body: JSON.stringify({
        to,
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Email] Failed to send email to ${to} (${response.status} ${response.statusText})${
          detail ? `: ${detail}` : ""
        }`
      );
      return false;
    }

    console.log(`[Email] Successfully sent email to ${to}`);
    return true;
  } catch (error) {
    console.error("[Email] Error calling email service:", error);
    return false;
  }
}
