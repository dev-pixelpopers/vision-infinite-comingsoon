"use client";

import { useEffect, useRef, useState } from "react";
import { useLoadProgress } from "@/hooks/useLoadProgress";
import { cx } from "@/lib/cx";
import { PRELOADER_CUES, PRELOADER_DURATION_MS } from "@/lib/preloader-script";
import Image from "next/image";

/**
 * Hard ceiling — if anything goes wrong, the page reveals itself anyway.
 *
 * Sized against the full script: PRELOADER_DURATION_MS + `hold` + `lift` is
 * ~15.2s, so this has to clear that with margin or the failsafe would guillotine
 * the sequence mid-line. Raise it with the script, never independently.
 */
const FAILSAFE_MS = PRELOADER_DURATION_MS + 4_000;

export function Preloader() {
  const { pctRef, progressRef, complete } = useLoadProgress({
    min: PRELOADER_DURATION_MS,
    max: PRELOADER_DURATION_MS + 4_000,
    // The counter walks the script: 2s->14%, 4s->29%, 7s->50%, 10s->71%,
    // 12s->86%, 14s->100%. easeOutCubic would be at 90% before the second line.
    ease: "linear",
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  /** Index into PRELOADER_CUES, or -1 for the gaps at either end. */
  const [cue, setCue] = useState(-1);

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

  // The script. Skipped outright under reduced motion: those users get
  // floor = 0 from the hook, so the counter completes on the first frame and
  // the overlay is gone long before any of these would have fired.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers = PRELOADER_CUES.map((c, i) => setTimeout(() => setCue(i), c.at));
    // Clear the last line before the lift, so the overlay leaves empty.
    timers.push(setTimeout(() => setCue(-1), PRELOADER_DURATION_MS));

    return () => timers.forEach(clearTimeout);
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
      ref={progressRef}
      className={cx(
        "preloader",
        ready && "is-ready",
        leaving && "preloader--leaving",
        done && "preloader--done",
      )}
      aria-hidden="true"
    >
      {/* <video
        ref={videoRef}
        className="preloader__video"
        src="/assets/videos/preloader_video_2.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        tabIndex={-1}
        disablePictureInPicture
      /> */}
      <Image
        className="preloader__logo mx-auto h-auto w-[400px] mix-blend-multiply md:w-[700px] xl:w-[800px]"
        src="/assets/images/footer-logo-updated.png"
        alt="Vision infinie — luxury wedding creative, by Stavan Shah"
        width={274}
        height={219}
        priority
        unoptimized
      />

      <div className="preloader__script">
        {PRELOADER_CUES.map((c, i) => (
          <p key={c.at} className={cx("preloader__line", i === cue && "is-active")}>
            {c.text}
          </p>
        ))}
      </div>

      <div className="preloader__percent-wrap">
        <span className="preloader__percent" ref={pctRef}>
          1%
        </span>
      </div>
    </div>
  );
}
