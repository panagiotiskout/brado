"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export type ActionResult = { ok: true } | { ok: false; code: string };

export async function approveUserAction(
  userId: string,
  locale: string,
): Promise<ActionResult> {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("email, first_name")
    .eq("id", userId)
    .single();

  const { error } = await admin
    .from("profiles")
    .update({ approval_status: "approved" })
    .eq("id", userId);

  if (error) return { ok: false, code: "GENERIC" };

  if (profile?.email) {
    await sendEmail({
      to: profile.email,
      subject:
        locale === "el"
          ? "Εγκρίθηκες — Brado Training"
          : "You are approved — Brado Training",
      html:
        locale === "el"
          ? `<p>Γεια σου ${profile.first_name},</p><p>Η αίτησή σου εγκρίθηκε. Μπορείς να κλείσεις την πρώτη σου προπόνηση.</p>`
          : `<p>Hi ${profile.first_name},</p><p>Your application was approved. You can book your first session.</p>`,
    });
  }

  revalidatePath(`/${locale}/admin`);
  return { ok: true };
}

export async function rejectUserAction(
  userId: string,
  locale: string,
): Promise<ActionResult> {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("email, first_name")
    .eq("id", userId)
    .single();

  const { error } = await admin
    .from("profiles")
    .update({ approval_status: "rejected" })
    .eq("id", userId);

  if (error) return { ok: false, code: "GENERIC" };

  if (profile?.email) {
    await sendEmail({
      to: profile.email,
      subject:
        locale === "el"
          ? "Σχετικά με την αίτησή σου — Brado"
          : "About your application — Brado",
      html:
        locale === "el"
          ? `<p>Γεια σου ${profile.first_name},</p><p>Δεν μπορέσαμε να εγκρίνουμε την αίτησή σου αυτή τη στιγμή. Επικοινώνησε μαζί μας για λεπτομέρειες.</p>`
          : `<p>Hi ${profile.first_name},</p><p>We could not approve your application at this time. Please contact us for details.</p>`,
    });
  }

  revalidatePath(`/${locale}/admin`);
  return { ok: true };
}

export async function addSubscriptionAction(
  formData: FormData,
  locale: string,
): Promise<ActionResult> {
  await requireAdmin();
  const admin = createAdminClient();

  const userId = String(formData.get("userId") ?? "");
  const planId = String(formData.get("planId") ?? "") || null;
  const startsOn = String(formData.get("startsOn") ?? "");
  const endsOn = String(formData.get("endsOn") ?? "");
  const paymentMethod = String(formData.get("paymentMethod") ?? "cash");
  const amountCents = Number(formData.get("amountCents") ?? 0);
  const notes = String(formData.get("notes") ?? "");

  if (!userId || !startsOn || !endsOn) {
    return { ok: false, code: "MISSING" };
  }

  const { error } = await admin.from("subscriptions").insert({
    user_id: userId,
    plan_id: planId,
    starts_on: startsOn,
    ends_on: endsOn,
    status: "active",
    payment_method: paymentMethod,
    amount_cents: amountCents,
    notes: notes || null,
  });

  if (error) return { ok: false, code: "GENERIC" };

  revalidatePath(`/${locale}/admin/subscriptions`);
  revalidatePath(`/${locale}/admin/clients`);
  return { ok: true };
}

export async function getMedicalDocSignedUrl(path: string): Promise<string | null> {
  await requireAdmin();
  const admin = createAdminClient();
  const { data } = await admin.storage
    .from("medical-docs")
    .createSignedUrl(path, 60 * 10);
  return data?.signedUrl ?? null;
}
