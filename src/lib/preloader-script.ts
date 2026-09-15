/**
 * The preloader's narrative script.
 *
 * PURE DATA — this crosses into the client bundle, so it stays free of logic
 * for the same reason ./fields.ts does.
 *
 * `at` / `until` are milliseconds from preloader mount. The windows are
 * contiguous and the last one MUST end exactly at PRELOADER_DURATION_MS: the
 * percent counter is paced linearly against that same duration, so the two
 * only stay in step if they share one number.
 */

export const PRELOADER_DURATION_MS = 22_000;

export const PRELOADER_CUES = [
  { at: 2_000, until: 5_000, text: "Our new website is coming soon" },
  {
    at: 5_000,
    until: 12_000,
    text: "Thoughtfully designed to reflect our evolving vision timeless vision",
  },
  {
    at: 12_000,
    until: 18_000,
    text: "and the unforgettable celebrations we are honored to preserve",
  },
  {
    at: 18_000,
    until: 22_000,
    text: "In the meantime we would love to hear your story",
  },
  // { at: 25_000, until: 31_000, text: "You carry its legacy forward." },
] as const;
