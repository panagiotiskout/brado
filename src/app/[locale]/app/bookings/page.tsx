import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingsList } from "@/components/member/bookings-list";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function BookingsPage({
  params,
}: PageProps<"/[locale]/app/bookings">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("member");

  const user = await getSessionUser();
  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, starts_at, status")
    .eq("user_id", user!.id)
    .order("starts_at", { ascending: true });

  const upcoming = (bookings ?? []).filter(
    (b) => b.status === "confirmed" && new Date(b.starts_at) >= new Date(),
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase text-brado-blue">
        {t("myBookings")}
      </h1>
      <div className="mt-8">
        <BookingsList bookings={upcoming} />
      </div>
    </div>
  );
}
