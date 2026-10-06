import { cn } from "@/lib/utils";

/**
 * Word band that replaces the old stats strip. Two identical copies inside a
 * max-content track, translated -50% — so the loop is seamless.
 */
export function Marquee({
  items,
  reverse,
  className,
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
}) {
  const run = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {items.map((item, i) => (
        <span key={`${key}-${i}`} className="flex items-center">
          <span className="poster px-6 text-3xl text-foreground/85 sm:px-10 sm:text-5xl">
            {item}
          </span>
          <span className="text-signal" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("marquee-mask select-none", className)}>
      <div className={cn("marquee-track", reverse && "marquee-reverse")}>
        {run("a")}
        {run("b")}
      </div>
    </div>
  );
}
