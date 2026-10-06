import { cn } from "@/lib/utils";

/**
 * Poster header for inner pages — same waterline language as the home hero,
 * at a quieter volume.
 */
export function PageHeader({
  index,
  kicker,
  title,
  lead,
  className,
}: {
  index: string;
  kicker: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "shore-bg grain relative overflow-hidden border-b border-border-subtle",
        className,
      )}
    >
      <div
        className="brand-band -left-[12%] -bottom-[12%] hidden h-40 w-[72%] sm:block"
        aria-hidden="true"
      />

      <div className="relative z-[1] mx-auto max-w-[1440px] px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20">
        <span className="micro micro-sm">
          <span className="micro-signal">{index}</span>
          <span className="mx-2 text-border-strong">—</span>
          {kicker}
        </span>

        <h1 className="poster poster-lg mt-6 max-w-[20ch]">{title}</h1>

        {lead && (
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/70">
            {lead}
          </p>
        )}
      </div>

      <div className="horizon absolute inset-x-0 bottom-0" aria-hidden="true" />
    </section>
  );
}
