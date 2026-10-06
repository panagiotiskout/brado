import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_path: string | null;
  doctor_doc_path: string | null;
  approval_status: "pending" | "approved" | "rejected";
  role: "member" | "admin";
  stripe_customer_id: string | null;
  created_at: string;
};

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.toLowerCase());
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data as Profile | null;
}

export async function getSessionUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireApprovedMember(): Promise<{
  user: User;
  profile: Profile;
}> {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  if (!profile) {
    throw new Error("NO_PROFILE");
  }
  if (profile.approval_status !== "approved") {
    throw new Error("NOT_APPROVED");
  }
  return { user, profile };
}

export async function requireAdmin(): Promise<{ user: User; profile: Profile }> {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return { user, profile };
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .lte("starts_on", today)
    .gte("ends_on", today)
    .limit(1)
    .maybeSingle();
  return !!data;
}
