import { getTranslations, setRequestLocale } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { GYM } from "@/lib/gym";

export default async function AdminClientsPage({
  params,
}: PageProps<"/[locale]/admin/clients">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  let rows: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    approval_status: string;
    bookings: { starts_at: string }[];
    subscriptions: { ends_on: string; status: string }[];
  }> = [];

  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("profiles")
      .select(
        `id, first_name, last_name, email, phone, approval_status,
         bookings(starts_at, status),
         subscriptions(ends_on, status)`,
      )
      .order("last_name");
    rows = (data ?? []) as typeof rows;
  } catch {
    rows = [];
  }

  const today = new Date();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brado-blue">{t("clients")}</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border border-brado-blue/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-brado-gray text-brado-blue">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Subscription</th>
              <th className="px-4 py-3">Next session</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const upcoming = (r.bookings ?? [])
                .filter(
                  (b) =>
                    (b as { status?: string }).status === "confirmed" ||
                    !("status" in b),
                )
                .map((b) => new Date(b.starts_at))
                .filter((d) => d >= today)
                .sort((a, b) => a.getTime() - b.getTime())[0];

              const activeSub = (r.subscriptions ?? []).find(
                (s) => s.status === "active",
              );

              return (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.email}
                    <br />
                    {r.phone}
                  </td>
                  <td className="px-4 py-3">{r.approval_status}</td>
                  <td className="px-4 py-3">
                    {activeSub?.ends_on ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {upcoming
                      ? upcoming.toLocaleString(locale === "el" ? "el-GR" : "en-GB", {
                          timeZone: GYM.timezone,
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
