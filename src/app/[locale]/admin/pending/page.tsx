import { getTranslations, setRequestLocale } from "next-intl/server";
import { PendingUserActions } from "@/components/admin/pending-user-actions";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminPendingPage({
  params,
}: PageProps<"/[locale]/admin/pending">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  let users: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    doctor_doc_path: string | null;
    created_at: string;
  }> = [];

  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("profiles")
      .select("id, first_name, last_name, email, phone, doctor_doc_path, created_at")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: true });
    users = data ?? [];
  } catch {
    users = [];
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brado-blue">{t("pending")}</h1>
      <ul className="mt-8 space-y-4">
        {users.map((u) => (
          <li
            key={u.id}
            className="rounded-xl border border-brado-blue/10 bg-white p-4"
          >
            <p className="font-semibold">
              {u.first_name} {u.last_name}
            </p>
            <p className="text-sm text-muted-foreground">{u.email} · {u.phone}</p>
            <div className="mt-3">
              <PendingUserActions
                userId={u.id}
                doctorPath={u.doctor_doc_path}
                approveLabel={t("approve")}
                rejectLabel={t("reject")}
                viewLabel={t("viewDoc")}
              />
            </div>
          </li>
        ))}
        {users.length === 0 && (
          <p className="text-muted-foreground">—</p>
        )}
      </ul>
    </div>
  );
}
