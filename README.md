# Vision Infinite — Coming Soon

A single-page coming-soon / contact page. Next.js 16 (App Router, Turbopack),
React 19, TypeScript, Tailwind v4 for tokens, Resend for delivery.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

| Script | |
|---|---|
| `npm run dev` | Dev server (Turbopack is the default — do **not** pass `--turbopack`) |
| `npm run build` | Production build |
| `npm run lint` | Bare `eslint` — `next lint` was removed in Next 16 |
| `npx tsc --noEmit` | Typecheck |

## Email

The form posts to a Server Action (`src/app/actions.ts`) which validates and
sends via Resend. Set these in `.env.local`:

- `RESEND_API_KEY` — from https://resend.com/api-keys
- `CONTACT_TO_EMAIL` — where enquiries land
- `CONTACT_FROM_EMAIL` — the sender

Out of the box `CONTACT_FROM_EMAIL` uses Resend's shared testing sender,
`onboarding@resend.dev`. **That sender can only deliver to the email address
that owns the Resend account** — so `CONTACT_TO_EMAIL` must be that address
until you verify a domain. Once `visioninfinite.com` is verified in Resend,
switch to `Vision Infinite <hello@visioninfinite.com>` and send anywhere.

If any of the three is missing the form fails gracefully with a message asking
the visitor to email directly, and logs `[contact] missing …` on the server.

### Anti-spam

Three independent layers, all enforced server-side (the Server Action is
reachable by direct POST, so nothing on the client is load-bearing):

1. A honeypot field — returns a fake success so bots learn nothing.
2. A minimum time-to-submit of 2.5s.
3. A 3-per-minute per-IP rate limit. This is an in-process `Map`, so it resets
   on cold start and does not see other instances. Move it to Upstash or
   Vercel KV if the page ever attracts real abuse.

## Things you will want to change

**Contact details and copy** — `src/lib/site.ts` holds the placeholder email,
phone and hero paragraph. The footer credit ("WEBSITE BY") is a TODO in
`src/components/Footer.tsx`.

**Fonts** — Archivo (display) and Inter Tight (body) are temporary stand-ins
served from Google Fonts. `src/styles/contact.css` opens with a marked swap
point: drop your licensed `.woff2` files into `public/fonts/` and replace the
`src: url(...)` lines. Everything resolves through `var(--font-display)` /
`var(--font-body)`, so nothing else changes.

⚠️ If the licensed face is **not** variable, `font-variation-settings` silently
does nothing. Every rule declares a matching `font-weight` alongside it so a
static family snaps to its nearest named weight rather than collapsing to 400 —
keep the two in sync when editing.

**Logotype** — `src/components/Wordmark.tsx` renders live text with SVG
`textLength` so it fills the footer exactly at any width. Swap it for the real
artwork when you have it.

**Preloader video** — the preloader is currently counter-only. The markup and
CSS are already shaped for a looping background video: drop a `<video>` into
`.preloader__media` in `src/components/Preloader.tsx`, then move
`mix-blend-mode: difference` off `.preloader` and onto the two text layers in
`src/styles/contact.css` (both spots are commented). Without that second step
the blend inverts the video.

**Search indexing** — `layout.tsx` sets `robots: { index: false }` while this
is a placeholder. Remove it at launch.

## Notes for the next person

- `src/styles/contact.css` is deliberately plain CSS, not Tailwind utilities.
  The design uses five desktop-first `max-width` breakpoints
  (1919/1439/1279/1023/767) and `font-variation-settings` throughout, which in
  Tailwind would be five stacked arbitrary variants per element for no benefit.
  Tailwind still owns the token layer (`@theme` in `globals.css`) and Preflight.
- The preloader's black field comes from a white overlay with
  `mix-blend-mode: difference` over `.page-alpfa`, an opaque white cover.
  `html { background }` and `body { isolation: isolate }` are both load-bearing:
  without them you get a white screen with invisible text.
- `useLoadProgress` drives the counter from rAF **and** a `setInterval`
  watchdog. Background tabs suspend rAF entirely, so without the watchdog a
  page opened in a background tab would sit behind the overlay until the 8s
  failsafe.
- `src/lib/schema.ts` (zod) is server-only. Nothing under `src/components/` may
  import it or zod ships to the browser. Verify with:
  `grep -rl "z.object" .next/static/chunks/`
- The design's muted text is `rgba(0,0,0,0.3)` at 12px (9px on mobile), which
  is ~2.9:1 and fails WCAG AA. This was a deliberate call to stay faithful to
  the reference. Raising `--color-muted` to `rgba(0,0,0,0.45)` and the mobile
  size to 11px passes AA and looks near-identical.
