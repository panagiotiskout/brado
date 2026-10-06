import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const from =
  process.env.RESEND_FROM_EMAIL ?? "Brado Training <onboarding@resend.dev>";

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.info("[email:dev]", params.subject, "→", params.to);
    return { ok: true as const, dev: true };
  }

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (error) {
    console.error("[email]", error);
    return { ok: false as const, error };
  }
  return { ok: true as const, dev: false };
}
