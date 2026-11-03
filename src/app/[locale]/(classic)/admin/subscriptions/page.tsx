import { getTranslations, setRequestLocale } from "next-intl/server";
import { AddSubscriptionForm } from "@/components/admin/add-subscription-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { oneProfile } from "@/lib/supabase/relation";

export default async function AdminSubscriptionsPage({
  params,
}: PageProps<"/[locale]/admin/subscriptions">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  let clients: { id: string; first_name: string; last_name: string }[] = [];
  let plans: { id: string; name_el: string; name_en: string }[] = [];
  type SubRow = {
    id: string;
    starts_on: string;
    ends_on: string;
    status: string;
    profiles: unknown;
  };
  let subs: SubRow[] = [];

  try {
    const admin = createAdminClient();
    const [c, p, s] = await Promise.all([
      admin.from("profiles").select("id, first_name, last_name").eq("approval_status", "approved"),
      admin.from("plans").select("id, name_el, name_en").eq("active", true),
      admin
        .from("subscriptions")
        .select("id, starts_on, ends_on, status, profiles(first_name, last_name)")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    clients = c.data ?? [];
    plans = p.data ?? [];
    subs = s.data ?? [];
  } catch {
    // Supabase not configured yet
  }

  return (
    <div className="space-y-10">
      <h1 className="font-display text-2xl font-bold text-brado-blue">
        {t("subscriptions")}
      </h1>

      <AddSubscriptionForm
        title={t("addSubscription")}
        clients={clients.map((c) => ({
          id: c.id,
          label: `${c.first_name} ${c.last_name}`,
        }))}
        plans={plans.map((p) => ({
          id: p.id,
          label: locale === "el" ? p.name_el : p.name_en,
        }))}
      />

      <div className="overflow-x-auto rounded-xl border border-brado-blue/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-brado-gray text-brado-blue">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((row) => {
              const p = oneProfile(
                row.profiles as {
                  first_name: string;
                  last_name: string;
                } | null,
              );
              return (
              <tr key={row.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  {p?.first_name} {p?.last_name}
                </td>
                <td className="px-4 py-3">
                  {row.starts_on} → {row.ends_on}
                </td>
                <td className="px-4 py-3">{row.status}</td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
