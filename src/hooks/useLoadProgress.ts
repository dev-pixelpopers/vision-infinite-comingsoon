"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Floor: never finish faster than this, so the counter stays readable. */
  min?: number;
  /** Ceiling: never trap the user behind one stalled asset. */
  max?: number;
  /** Ease-in window when load fires after we have already stalled at 90%. */
  release?: number;
};

/** Background tabs suspend rAF entirely, so a timer backs it up. */
const WATCHDOG_MS = 200;

/**
 * Drives a 1 → 100 load counter.
 *
 * A fixed timer alone would hit 100% while the page is still blank, which is
 * exactly the lie a preloader exists to avoid. So this combines a real load
 * signal with a floor duration: an easeOutCubic ramp that stalls at 90% until
 * `window.load` fires, then eases the remaining stretch so there is no jump.
 * The ramp is always the ceiling, which is what makes `min` a genuine floor
 * even when the page comes warm from cache and `load` has already fired.
 *
 * Progress is written to `pctRef` imperatively rather than through state —
 * otherwise this would trigger ~100 React renders during load. `complete`
 * flips exactly once.
 */
export function useLoadProgress<T extends HTMLElement = HTMLSpanElement>({
  min = 1800,
  max = 6000,
  release = 450,
}: Options = {}) {
  const [complete, setComplete] = useState(false);
  const pctRef = useRef<T | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const floor = reduced ? 0 : min;

    let raf = 0;
    let live = true;
    let finished = false;
    let loaded = document.readyState === "complete";
    let releaseStart = 0;
    let releaseFrom = 0;
    let shownLast = -1;
    let progressLast = 0;

    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });

    const start = performance.now();

    /**
     * Idempotent — safe to call from both the rAF loop and the watchdog, at
     * whatever cadence each happens to run.
     */
    const update = (now: number) => {
      if (finished || !live) return;

      const elapsed = now - start;
      // easeOutCubic across the floor duration; reaches exactly 1 at `floor`.
      const ramp = floor === 0 ? 1 : 1 - Math.pow(1 - Math.min(elapsed / floor, 1), 3);
      const free = loaded || elapsed >= max;

      let p: number;
      if (!free) {
        p = Math.min(ramp, 0.9);
      } else {
        if (!releaseStart) {
          releaseStart = now;
          releaseFrom = Math.min(ramp, 0.9);
        }
        // Blend from wherever we stalled up towards the ramp. `ramp` stays the
        // ceiling throughout, which is what honours the floor duration.
        const k = Math.min((now - releaseStart) / release, 1);
        p = releaseFrom + (ramp - releaseFrom) * k;
      }

      // The counter must never run backwards.
      p = Math.max(progressLast, Math.min(1, p));
      progressLast = p;

      const shown = Math.max(1, Math.round(p * 100));
      if (shown !== shownLast && pctRef.current) {
        pctRef.current.textContent = `${shown}%`;
        shownLast = shown;
      }

      if (p >= 1) {
        finished = true;
        setComplete(true);
        return;
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    // rAF is suspended outright in a background tab, so without this the page
    // would sit behind the overlay until the failsafe fired. Background timers
    // are throttled rather than stopped, which is enough to keep it moving.
    const watchdog = setInterval(() => update(performance.now()), WATCHDOG_MS);

    return () => {
      live = false;
      cancelAnimationFrame(raf);
      clearInterval(watchdog);
      window.removeEventListener("load", onLoad);
    };
  }, [min, max, release]);

  return { pctRef, complete };
}
