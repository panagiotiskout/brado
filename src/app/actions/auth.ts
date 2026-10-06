"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function loginAction(
  formData: FormData,
  locale: string,
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/app/book`);
}

export async function logoutAction(locale: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(`/${locale}`);
}

export async function signupAction(
  formData: FormData,
  locale: string,
): Promise<ActionResult> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const doctorFile = formData.get("doctorDoc");

  if (!firstName || !lastName || !email || !phone || !password) {
    return { ok: false, error: "MISSING_FIELDS" };
  }
  if (!(doctorFile instanceof File) || doctorFile.size === 0) {
    return { ok: false, error: "DOCTOR_DOC_REQUIRED" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName, phone },
    },
  });

  if (error || !data.user) {
    return { ok: false, error: error?.message ?? "SIGNUP_FAILED" };
  }

  const userId = data.user.id;
  let doctorPath: string | null = null;
  let avatarPath: string | null = null;

  try {
    const admin = createAdminClient();
    const ext = doctorFile.name.split(".").pop() ?? "pdf";
    doctorPath = `${userId}/medical-${Date.now()}.${ext}`;
    const buf = Buffer.from(await doctorFile.arrayBuffer());
    const { error: upErr } = await admin.storage
      .from("medical-docs")
      .upload(doctorPath, buf, { contentType: doctorFile.type, upsert: true });
    if (upErr) {
      console.error(upErr);
    }

    const avatarFile = formData.get("avatar");
    if (avatarFile instanceof File && avatarFile.size > 0) {
      const aext = avatarFile.name.split(".").pop() ?? "jpg";
      avatarPath = `${userId}/avatar.${aext}`;
      const abuf = Buffer.from(await avatarFile.arrayBuffer());
      await admin.storage.from("avatars").upload(avatarPath, abuf, {
        contentType: avatarFile.type,
        upsert: true,
      });
    }

    const role = isAdminEmail(email) ? "admin" : "member";
    await admin
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        phone,
        doctor_doc_path: doctorPath,
        avatar_path: avatarPath,
        approval_status: role === "admin" ? "approved" : "pending",
        role,
      })
      .eq("id", userId);
  } catch (e) {
    console.error(e);
  }

  await sendEmail({
    to: email,
    subject:
      locale === "el"
        ? "Λάβαμε την αίτησή σου — Brado Training"
        : "We received your application — Brado Training",
    html:
      locale === "el"
        ? `<p>Γεια σου ${firstName},</p><p>Λάβαμε την αίτηση εγγραφής σου. Θα ενημερωθείς μόλις εγκριθείς.</p>`
        : `<p>Hi ${firstName},</p><p>We received your application. You will be notified once approved.</p>`,
  });

  revalidatePath("/", "layout");
  redirect(`/${locale}/app/book`);
}
