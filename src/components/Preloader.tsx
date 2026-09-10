"use client";

import { useEffect, useRef, useState } from "react";
import { useLoadProgress } from "@/hooks/useLoadProgress";
import { cx } from "@/lib/cx";

/** Hard ceiling — if anything goes wrong, the page reveals itself anyway. */
const FAILSAFE_MS = 8000;

export function Preloader() {
  const { pctRef, complete } = useLoadProgress();
  const videoRef = useRef<HTMLVideoElement | null>(null);
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

  // CSS hides the video under prefers-reduced-motion, but it cannot stop
  // playback — a hidden <video> keeps decoding. Both are needed.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
    }
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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      <video
        ref={videoRef}
        className="preloader__video"
        src="/assets/videos/preloader_video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        tabIndex={-1}
        disablePictureInPicture
      />

      <div className="preloader__percent-wrap">
        <span className="preloader__percent" ref={pctRef}>
          1%
        </span>
      </div>
    </div>
  );
}
