import Image from "next/image";
import type { SitePhoto } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * A photo printed in one ink: shadows in ultramarine, highlights in paper,
 * with a fine halftone screen on top. It makes mismatched photos — stock or
 * phone shots — read as one series.
 */
export function Duotone({
  photo,
  locale,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  preload,
  focus,
  parallax,
  decorative,
  eager,
}: {
  photo: SitePhoto;
  locale: "el" | "en";
  className?: string;
  sizes?: string;
  preload?: boolean;
  /** Override the photo's object-position for this crop. */
  focus?: string;
  /** Drift range in px; the image is overscanned to cover it. */
  parallax?: number;
  /** Empty alt, for photos set inside a headline. */
  decorative?: boolean;
  /** Skip lazy loading — for frames that arrive sideways, inside the rail. */
  eager?: boolean;
}) {
  return (
    <figure
      className={cn("site-duo", className)}
      style={parallax ? ({ "--drift": `${parallax}px` } as React.CSSProperties) : undefined}
    >
      <div className="site-duo-media" data-parallax={parallax || undefined}>
        <Image
          src={photo.src}
          alt={decorative ? "" : photo.alt[locale]}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          preload={preload}
          loading={eager ? "eager" : undefined}
          style={{ objectPosition: focus ?? photo.focus }}
        />
      </div>
    </figure>
  );
}

/** The flyer's corner: blue and white bars at the house angle. */
export function Stripes({ className, count = 9 }: { className?: string; count?: number }) {
  return (
    <div className={cn("site-stripes", className)} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ "--i": i } as React.CSSProperties} />
      ))}
    </div>
  );
}

/** "01 — The space": section counter in a skewed ink block. */
export function Label({ n, children, className }: { n: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("site-label", className)}>
      <span className="site-label-n">{n}</span>
      <span>{children}</span>
    </p>
  );
}

/** Running band; the motion loop speeds it up with the scroll. */
export function Marquee({
  items,
  className,
  reverse,
}: {
  items: string[];
  className?: string;
  reverse?: boolean;
}) {
  const run = (hidden?: boolean) => (
    <div className="site-marquee-run" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="site-marquee-item">
          {item}
          <i className="site-marquee-sep" />
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("site-marquee", className)}>
      <div className={cn("site-marquee-track", reverse && "site-marquee-reverse")}>
        {run()}
        {run(true)}
      </div>
    </div>
  );
}
