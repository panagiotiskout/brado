import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/*
 * Public site only: a static export in out/, served by a Cloudflare Worker
 * (wrangler.jsonc). The member booking app is parked until it launches —
 * see parked/booking/README.md.
 */
export default function config(phase: string): NextConfig {
  const nextConfig: NextConfig = {
    output: "export",
    images: { unoptimized: true },
  };

  /*
   * With no middleware, nothing sends "/" to a locale. On Cloudflare that's
   * public/_redirects; `next dev` doesn't read that file, so mirror it here.
   * Dev only: static export doesn't support redirects().
   */
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    nextConfig.redirects = async () => [
      { source: "/", destination: "/el", permanent: false },
    ];
  }

  return withNextIntl(nextConfig);
}
