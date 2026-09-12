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

export const PRELOADER_DURATION_MS = 14_000;

export const PRELOADER_CUES = [
  { at: 2_000, until: 4_000, text: "Life moves quickly." },
  {
    at: 4_000,
    until: 7_000,
    text: "Your wedding is one of the rare moments worth slowing down for.",
  },
  {
    at: 7_000,
    until: 10_000,
    text: "Be fully in it. Feel it deeply. Let us preserve the people, the emotion, and the moments that matter most.",
  },
  {
    at: 10_000,
    until: 12_000,
    text: "So years from now, you don\u2019t just remember the day.",
  },
  { at: 12_000, until: 14_000, text: "You carry its legacy forward." },
] as const;
