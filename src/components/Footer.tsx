import { Wordmark } from "./Wordmark";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_PRETTY } from "@/lib/site";

/**
 * Sits on bone while the form panel above it is paper, so the bronze rule is
 * what separates the two — no background of its own.
 */
export function Footer() {
  return (
    <footer className="mx-auto grid w-full max-w-[75rem] grid-cols-1 items-start gap-6 border-t border-hairline px-4 pt-12 pb-8 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-ink md:grid-cols-3 md:gap-8 md:px-8 md:pt-16 md:text-xs">
      <div className="flex flex-col items-start gap-1">
        <a className="shrink-underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        <a
          className="shrink-underline"
          href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`}
        >
          {CONTACT_PHONE_PRETTY}
        </a>
      </div>

      <div className="flex flex-col items-start gap-1 text-muted">
        <p className="m-0">Website by</p>
        {/* TODO: replace with the real credit + link */}
        <span>Vision infinie</span>
      </div>

      <div className="text-muted max-md:col-span-full">
        {/* Hardcoded on purpose — a server-rendered getFullYear() on a cached
            page is a silent staleness bug. */}
        <span>©2026 Vision infinie — all rights reserved</span>
      </div>

      <div className="col-span-full mt-12 w-full text-bronze [&_svg]:block [&_svg]:h-auto [&_svg]:w-full">
        <Wordmark />
      </div>
    </footer>
  );
}
