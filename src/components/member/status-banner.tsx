import { getTranslations } from "next-intl/server";
import type { Profile } from "@/lib/auth";

export async function StatusBanner({ profile }: { profile: Profile }) {
  const t = await getTranslations("auth");

  if (profile.approval_status === "pending") {
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center text-sm text-amber-900">
        {t("pendingBanner")}
      </div>
    );
  }
  if (profile.approval_status === "rejected") {
    return (
      <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-center text-sm text-red-900">
        {t("rejectedBanner")}
      </div>
    );
  }
  return null;
}
