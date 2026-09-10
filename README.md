# Vision infinie — Coming Soon

A single-page coming-soon / contact page. Next.js 16 (App Router, Turbopack),
React 19, TypeScript, Tailwind v4, Resend for delivery.

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
switch to `Vision infinie <hello@visioninfinite.com>` and send anywhere.

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
phone and hero paragraph. The footer credit ("Website by") is a TODO in
`src/components/Footer.tsx`. Note the placeholder address is still
`hello@visioninfin**i**te.com` while the brand is "Vision infin**ie**" — worth
deciding before launch.

**The preloader video carries an AI watermark.** `public/assets/videos/
preloader_video.mp4` has "MINIMAX | Hailuo AI" burned into the bottom of the
frame. The bone scrim softens it but does not remove it. Re-export or crop
before this goes live.

**Logo** — `Vision-Infinie-logo.png` has an opaque white background, so the
hero uses `mix-blend-multiply` to knock it out against the bone page. That
works because the art is dark line work on pure white. A transparent 2x PNG,
or better an SVG, would be the real fix — the engraving is line art.

**Fonts** — `src/styles/contact.css` opens with a marked swap point. Both
faces are self-hosted from `public/assets/fonts/` and declared by hand rather
than through `next/font`, so a licensed face drops in by changing one
`src: url()` line.

⚠️ **Valturin is not a variable font.** Parsed from the woff2: no `fvar`,
`usWeightClass 400`, 338 glyphs. It is declared `font-weight: 400` and there
is not one `font-variation-settings` in the codebase — they were silent
no-ops, and the paired `font-weight: 640` was producing synthetic fake bold.
The whole hierarchy is built from **size, case, letter-spacing and colour**.
If you need another display voice, reach for a stylistic set (`ss01`–`ss04`)
or a tracking step, never weight.

It also has **no `tnum`** and proportional digits ("1" is 348 units, "0" is
685), so `font-variant-numeric` does nothing — anything that counts needs a
fixed-width box. See `.preloader__percent`.

**Search indexing** — `layout.tsx` sets `robots: { index: false }` while this
is a placeholder. Remove it at launch.

## Design system

Three brand colours, defined as Tailwind tokens in `src/app/globals.css`:

| token | | role | contrast on bone |
|---|---|---|---|
| `--color-bone` | `#DED6C7` | page ground | — |
| `--color-ink` | `#292313` | text | 10.83:1 |
| `--color-bronze` | `#946928` | rules, focus, accents | 3.38:1 |

Bronze is a WCAG pass for rules, control borders and text ≥24px, and a **fail**
below that — so it never carries body copy. Small text routes through
`--color-muted` (5.12:1) or `--color-ink`. `--color-paper` (`#E7E0D3`) is the
form panel and is deliberately *lighter* than the page.

Type: **Valturin** for display, **Jost** for body and labels. The texture is
large letterspaced Valturin uppercase against small, heavily letterspaced Jost
uppercase captions — no two adjacent levels share a family.

## Notes for the next person

- **Hybrid Tailwind.** Utilities in the JSX carry layout, spacing, colour and
  type. `src/styles/contact.css` carries only what a utility cannot express:
  `@font-face`, selectors rooted on `html[data-loading]` / `html[data-loaded]`,
  the state classes React sets on the fields, and pseudo-elements with
  interpolated geometry.
- **Mobile-first, min-width only.** There are exactly two breakpoints in
  `contact.css` (64rem, 90rem) plus two `(hover: hover)` feature queries;
  everything else that used to be a breakpoint is a `clamp()`. Do not
  reintroduce a max-width query — mixing directions is what previously made
  the title render *larger* at 1440 than at 1920.
- **`--field-pad-x/y`** on `.contact-form__field` is the single source of truth
  for the field inset: the input pads by it and the resting label is positioned
  to it, so the two cannot drift apart at a breakpoint.
- **The floating label** shifts family, size, tracking and colour — never
  weight. The tracking opening from `.06em` to `.24em` as it rises is what
  replaces the weight step a variable font would have given you.
- **`html { background }` and `body { isolation: isolate }` are load-bearing.**
  The first paints the overscroll gutter bone; the second defines the blend
  group for the hero logo's multiply. Do not add `isolation` to anything
  between `body` and that image.
- **`useLoadProgress`** drives the counter from rAF **and** a `setInterval`
  watchdog. Background tabs suspend rAF entirely, so without the watchdog a
  page opened in a background tab would sit behind the overlay until the 8s
  failsafe.
- **`src/lib/schema.ts` (zod) is server-only.** Nothing under `src/components/`
  may import it or zod ships to the browser. Verify with
  `grep -rl "z.object" .next/static/chunks/`.
