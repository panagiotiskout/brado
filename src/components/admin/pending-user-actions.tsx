"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import {
  approveUserAction,
  rejectUserAction,
  getMedicalDocSignedUrl,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

export function PendingUserActions({
  userId,
  doctorPath,
  approveLabel,
  rejectLabel,
  viewLabel,
}: {
  userId: string;
  doctorPath: string | null;
  approveLabel: string;
  rejectLabel: string;
  viewLabel: string;
}) {
  const locale = useLocale();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {doctorPath && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const url = await getMedicalDocSignedUrl(doctorPath);
              if (url) window.open(url, "_blank");
            })
          }
        >
          {viewLabel}
        </Button>
      )}
      <Button
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            void approveUserAction(userId, locale);
          })
        }
      >
        {approveLabel}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            void rejectUserAction(userId, locale);
          })
        }
      >
        {rejectLabel}
      </Button>
    </div>
  );
}
