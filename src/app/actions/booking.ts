"use server";

import { revalidatePath } from "next/cache";
import { addHours, isBefore } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser, hasActiveSubscription } from "@/lib/auth";
import { GYM } from "@/lib/gym";
import { sendEmail } from "@/lib/email";

export type ActionResult = { ok: true } | { ok: false; code: string };

export async function createBookingAction(
  startsAtIso: string,
  locale: string,
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, code: "UNAUTHORIZED" };

  const startsAt = new Date(startsAtIso);
  if (isBefore(startsAt, new Date())) {
    return { ok: false, code: "PAST" };
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("approval_status, email, first_name")
    .eq("id", user.id)
    .single();

  if (profile?.approval_status !== "approved") {
    return { ok: false, code: "NOT_APPROVED" };
  }

  const active = await hasActiveSubscription(user.id);
  if (!active) {
    return { ok: false, code: "NO_SUB" };
  }

  const { error } = await supabase.rpc("create_booking", {
    p_user_id: user.id,
    p_starts_at: startsAt.toISOString(),
  });

  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("SLOT_FULL")) return { ok: false, code: "SLOT_FULL" };
    if (msg.includes("NOT_APPROVED")) return { ok: false, code: "NOT_APPROVED" };
    if (msg.includes("NO_ACTIVE_SUBSCRIPTION"))
      return { ok: false, code: "NO_SUB" };
    if (msg.includes("OVERLAPPING_BOOKING"))
      return { ok: false, code: "OVERLAP" };
    return { ok: false, code: "GENERIC" };
  }

  if (profile?.email) {
    await sendEmail({
      to: profile.email,
      subject:
        locale === "el"
          ? "Επιβεβαίωση κράτησης — Brado Training"
          : "Booking confirmed — Brado Training",
      html:
        locale === "el"
          ? `<p>Η κράτησή σου για ${startsAt.toLocaleString("el-GR", { timeZone: GYM.timezone })} επιβεβαιώθηκε.</p>`
          : `<p>Your session on ${startsAt.toLocaleString("en-GB", { timeZone: GYM.timezone })} is confirmed.</p>`,
    });
  }

  revalidatePath(`/${locale}/app/book`);
  revalidatePath(`/${locale}/app/bookings`);
  return { ok: true };
}

export async function cancelBookingAction(
  bookingId: string,
  locale: string,
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, code: "UNAUTHORIZED" };

  const supabase = await createClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, user_id, starts_at, status")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.user_id !== user.id) {
    return { ok: false, code: "NOT_FOUND" };
  }
  if (booking.status !== "confirmed") {
    return { ok: false, code: "ALREADY_CANCELLED" };
  }

  const cutoff = addHours(new Date(), GYM.cancelCutoffHours);
  if (isBefore(new Date(booking.starts_at), cutoff)) {
    return { ok: false, code: "TOO_LATE" };
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("id", bookingId);

  if (error) return { ok: false, code: "GENERIC" };

  revalidatePath(`/${locale}/app/bookings`);
  revalidatePath(`/${locale}/app/book`);
  return { ok: true };
}
