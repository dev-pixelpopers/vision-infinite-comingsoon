import Image from "next/image";
import { Wordmark } from "./Wordmark";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_PRETTY } from "@/lib/site";

/**
 * Sits on bone while the form panel above it is paper, so the bronze rule is
 * what separates the two — no background of its own.
 */
export function Footer() {
  return (
    <footer className="flex flex-col justify-center items-center w-full gap-6 border-t border-hairline px-4 pt-12 pb-8 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-ink md:grid-cols-3 md:gap-8 md:px-8 md:pt-16 md:text-xs">
      <div className="w-full max-w-[75rem] flex flex-row justify-between items-center gap-2">
        <div className="flex-1 flex flex-row items-start gap-6">
          <a
            className="shrink-underline"
            target="_blank"
            href="https://www.instagram.com/visioninfiniebystavan?stkn=MTVwM2ZwMnI4N2FidQ=="
          >
            <svg aria-hidden="true" className="e-font-icon-svg h-[30px] e-fab-instagram" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>
          </a>
          <a className="shrink-underline" target="_blank" href="https://www.facebook.com/visioninfiniephotography/">
            <svg aria-hidden="true" className="e-font-icon-svg h-[30px] e-fab-facebook-f" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>
          </a>
          <a
            className="shrink-underline"
            target="_blank"
            href="https://www.pinterest.com/visioninfiniephotography/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-[30px]"><path d="M16.132 0a16 16 0 0 0-5.771 30.952c-.13-1.312-.262-3.148 0-4.6l1.836-8a5.771 5.771 0 0 1-.525-2.361c0-2.23 1.312-3.935 2.885-3.935s1.967 1.05 1.967 2.23-.918 3.4-1.312 5.377.787 2.885 2.36 2.885 4.984-3.016 4.984-7.344-2.754-6.558-6.69-6.558-7.082 3.54-7.082 7.082c0 1.312.525 2.885 1.18 3.672a.525.525 0 0 1 .131.393l-.393 1.836c-.13.262-.262.393-.525.262-1.967-.918-3.28-3.803-3.28-6.164 0-4.984 3.672-9.705 10.623-9.705s9.836 3.935 9.836 9.18-3.54 9.968-8.263 9.968c-1.574 0-3.148-.787-3.672-1.836l-1.05 3.803c-.393 1.443-1.312 3.148-1.967 4.197A16 16 0 1 0 16.132 0z" /></svg>
          </a>
        </div>
        <div className="flex flex-1 justify-center items-center">
          <a href="/">
            <Image
              className="h-auto mix-blend-multiply"
              src="/assets/images/footer-logo-updated.png"
              alt="Vision infinie"
              width={274}
              height={219}
              unoptimized
            />
          </a>
        </div>
        <div className="flex-1 flex flex-col items-end gap-1">
          <a className="shrink-underline capitalize" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          <a
            className="shrink-underline capitalize"
            href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`}
          >
            {CONTACT_PHONE_PRETTY}
          </a>
        </div>
      </div>

      <div className="text-muted max-md:col-span-full">
        <span>©2026 Vision infinie — all rights reserved</span>
      </div>
    </footer>
  );
}
