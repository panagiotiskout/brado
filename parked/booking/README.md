# Parked: member booking app

The public site ships as a static export (`output: "export"` in
`next.config.ts`) on Cloudflare Pages (project `brado`, build
`npm run build`, output `out`, deploys on push to `main`). Static
export can't build middleware, Server Actions or per-request Supabase pages,
so the member area lives here, outside `src/app`, until bookings launch.

Still in `src/` (unused by the public build, kept compiling):
`src/app/actions/`, `src/lib/supabase/`, `src/lib/auth.ts`, `src/lib/email.ts`,
`src/components/{auth,member,admin}/`, `src/components/site-header.tsx`.

## To bring it back

1. Move the files back:
   - `parked/booking/app/[locale]/(classic)` → `src/app/[locale]/(classic)`
   - `parked/booking/middleware.ts` → `src/middleware.ts`
2. The site now needs a server, which static Pages can't provide: switch to
   the OpenNext adapter (`@opennextjs/cloudflare`) on a Cloudflare Worker,
   drop `output: "export"` and `images.unoptimized`, and move the
   bradotraining.com custom domains from the Pages project to that Worker.
3. Set the Supabase / Resend env vars from `.env.example` as Worker secrets.
4. Restore the login / signup / book links in `src/components/site/`
   (header, footer, live board) and the "members' app" wording in
   `messages/*.json` (`site.boardNote`, `site.boardCta`).
5. Write a privacy policy and terms again before launch. The privacy and
   terms pages were removed from the public site, but signup collects
   personal details and medical clearance, which GDPR requires a privacy
   policy for. Link them from both footers (`src/components/site/footer.tsx`,
   `src/components/site-footer.tsx`).
6. Remove `public/_redirects` (the middleware handles `/` → locale again)
   and the `parked` entries in `tsconfig.json` / `eslint.config.mjs`.
