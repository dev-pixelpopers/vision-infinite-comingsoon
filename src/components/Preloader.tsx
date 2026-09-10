"use client";

import { useEffect, useState } from "react";
import { useLoadProgress } from "@/hooks/useLoadProgress";
import { cx } from "@/lib/cx";

/** Hard ceiling — if anything goes wrong, the page reveals itself anyway. */
const FAILSAFE_MS = 8000;

export function Preloader() {
  const { pctRef, complete } = useLoadProgress();
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  // Lock scrolling for as long as the overlay is up.
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-loading", "");
    return () => el.removeAttribute("data-loading");
  }, []);

  // `is-ready` on the first frame after mount, so the mask-reveal transition
  // actually plays instead of being collapsed into the initial paint. The
  // timeout is a fallback for background tabs, where rAF never fires at all.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    const t = setTimeout(() => setReady(true), 60);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  const reveal = () => {
    const el = document.documentElement;
    el.removeAttribute("data-loading");
    el.setAttribute("data-loaded", "");
  };

  // Failsafe: reveal the page regardless of what the counter is doing.
  useEffect(() => {
    const t = setTimeout(() => {
      setLeaving(true);
      setDone(true);
      reveal();
    }, FAILSAFE_MS);
    return () => clearTimeout(t);
  }, []);

  // Exit sequence: hold so "100%" is readable, lift, then hand off to CSS.
  useEffect(() => {
    if (!complete) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hold = reduced ? 0 : 260;
    const lift = reduced ? 200 : 900;

    const t1 = setTimeout(() => setLeaving(true), hold);
    const t2 = setTimeout(() => {
      setDone(true);
      reveal();
    }, hold + lift);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [complete]);

  return (
    <>
      {/* Opaque cover beneath the overlay. The preloader blends with whatever
          is behind it, so without this it would invert the real page rather
          than render the flat black field the design calls for. */}
      <div
        className={cx("page-alpfa", (leaving || done) && "hide")}
        aria-hidden="true"
      />

      <div
        className={cx(
          "preloader",
          ready && "is-ready",
          leaving && "preloader--leaving",
          done && "preloader--done",
        )}
        /* Decoration. Screen readers should not narrate "47%". */
        aria-hidden="true"
      >
        {/* ── FUTURE VIDEO LAYER ──────────────────────────────────────────
          Drop the looping background video in here:

            <video
              className="preloader__video"
              src="/video/preloader.mp4"
              autoPlay muted loop playsInline preload="auto"
            />

          Then make the one adjustment described above .preloader__media in
          src/styles/contact.css — mix-blend-mode: difference has to move off
          .preloader and onto the text layers, or it inverts the video. */}
        <div className="preloader__media" />

        <div className="preloader__wrapper">
          <div className="preloader__logo-wrap">
            <span className="preloader__logo">Vision Infinite</span>
          </div>
        </div>

        <div className="preloader__percent-wrap">
          <span className="preloader__percent" ref={pctRef}>
            1%
          </span>
        </div>
      </div>
    </>
  );
}
