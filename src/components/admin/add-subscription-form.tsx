"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { addSubscriptionAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Client = { id: string; label: string };
type Plan = { id: string; label: string };

export function AddSubscriptionForm({
  clients,
  plans,
  title,
}: {
  clients: Client[];
  plans: Plan[];
  title: string;
}) {
  const locale = useLocale();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4 rounded-xl border border-brado-blue/10 bg-white p-6"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => {
          void addSubscriptionAction(fd, locale);
        });
      }}
    >
      <h2 className="font-semibold text-brado-blue">{title}</h2>
      <div className="space-y-2">
        <Label htmlFor="userId">Client</Label>
        <select
          id="userId"
          name="userId"
          required
          className="flex h-11 w-full rounded-md border border-brado-blue/15 px-3"
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="planId">Plan</Label>
        <select
          id="planId"
          name="planId"
          className="flex h-11 w-full rounded-md border border-brado-blue/15 px-3"
        >
          <option value="">—</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startsOn">Starts</Label>
          <Input id="startsOn" name="startsOn" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endsOn">Ends</Label>
          <Input id="endsOn" name="endsOn" type="date" required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment</Label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            className="flex h-11 w-full rounded-md border border-brado-blue/15 px-3"
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="iris">IRIS</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amountCents">Amount (cents)</Label>
          <Input id="amountCents" name="amountCents" type="number" min={0} defaultValue={0} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" name="notes" />
      </div>
      <Button type="submit" disabled={pending || clients.length === 0}>
        Save
      </Button>
    </form>
  );
}
