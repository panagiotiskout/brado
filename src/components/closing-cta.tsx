import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

/** Shared closing block, so every public page lands the same way. */
export function ClosingCta({
  title,
  body,
  button,
}: {
  title: string;
  body?: string;
  button: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-border-subtle bg-ink">
      <div
        className="flag-stripes absolute -left-8 bottom-0 hidden h-24 w-36 opacity-20 lg:block"
        aria-hidden="true"
      />
      <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
        <h2 className="poster poster-lg max-w-[20ch]">{title}</h2>
        <div className="brand-rule mt-7 w-24" />
        <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,26rem)_auto] md:items-end md:justify-between">
          {body ? (
            <p className="max-w-md leading-relaxed text-foreground/70">{body}</p>
          ) : (
            <span />
          )}
          <Button variant="brand" size="lg" asChild>
            <Link href="/signup">{button}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
