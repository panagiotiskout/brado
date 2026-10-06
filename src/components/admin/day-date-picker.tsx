"use client";

import { useRouter } from "@/i18n/navigation";

export function DayDatePicker({ value }: { value: string }) {
  const router = useRouter();

  return (
    <input
      type="date"
      value={value}
      className="rounded-md border border-brado-blue/15 px-3 py-2"
      onChange={(e) => {
        router.push(`/admin/day?date=${e.target.value}`);
      }}
    />
  );
}
