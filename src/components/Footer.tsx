import Image from "next/image";
import { Wordmark } from "./Wordmark";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_PRETTY } from "@/lib/site";

/**
 * Sits on bone while the form panel above it is paper, so the bronze rule is
 * what separates the two — no background of its own.
 */
export function Footer() {
  return (
    <footer className="mx-auto flex flex-col justify-center items-center w-full max-w-[75rem] gap-6 border-t border-hairline px-4 pt-12 pb-8 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-ink md:grid-cols-3 md:gap-8 md:px-8 md:pt-16 md:text-xs">
      <div className="flex flex-col justify-center items-center gap-2">
        <a href="/">
          <Image
            className="h-auto mix-blend-multiply"
            src="/assets/images/Vision-Infinie-logo.png"
            alt="Vision infinie"
            width={274}
            height={219}
            unoptimized
          />
        </a>
      </div>

      <div className="text-muted max-md:col-span-full">
        <span>©2026 Vision infinie — all rights reserved</span>
      </div>
    </footer>
  );
}
