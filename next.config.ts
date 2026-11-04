import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/*
 * Public site only: a static export in out/, served by a Cloudflare Worker
 * (wrangler.jsonc). The member booking app is parked until it launches —
 * see parked/booking/README.md.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default withNextIntl(nextConfig);
