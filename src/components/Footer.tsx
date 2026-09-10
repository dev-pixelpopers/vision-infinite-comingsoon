import { Wordmark } from "./Wordmark";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_PRETTY } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__column footer__column_1">
        <a className="footer__email shrink-underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        <a
          className="footer__phone shrink-underline"
          href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`}
        >
          {CONTACT_PHONE_PRETTY}
        </a>
      </div>

      <div className="footer__column footer__column_3">
        <p className="footer__by">Website by</p>
        {/* TODO: replace with the real credit + link */}
        <span className="developed-by-btn">Vision Infinite</span>
      </div>

      <div className="footer__column footer__column_4">
        {/* Hardcoded on purpose — a server-rendered getFullYear() on a cached
            page is a silent staleness bug. */}
        <span>©2026 Vision Infinite - all rights reserved</span>
      </div>

      <div className="footer__title-wrapper">
        <Wordmark />
      </div>
    </footer>
  );
}
