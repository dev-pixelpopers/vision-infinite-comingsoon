import Image from "next/image";
import { Preloader } from "@/components/Preloader";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  FORM_INTRO,
  INTRO_CTA,
  INTRO_HEADING,
  INTRO_INVITE,
  INTRO_PARAGRAPH,
} from "@/lib/site";

/**
 * Server Component.
 *
 * Every entrance animation on this page is CSS keyed off `html[data-loaded]`,
 * which <Preloader> sets when the counter finishes — so none of this markup
 * needs client state, and it all stays out of the JS bundle.
 */
export default function Page() {
  return (
    <div className="page-wrapper">
      <Preloader />

      {/* Logo only. Do NOT add `isolation` to this element or any wrapper
          between body and the image — contact.css explains why: body's
          isolation is the blending group the mix-blend-multiply needs to knock
          the PNG's white plate out against the bone page. */}
      <header className="site-header w-full px-4 pt-12 pb-8 text-center md:px-8 md:pt-16">
        <span className="reveal-wrap">
          <a href="/">
            <Image
              className="reveal mx-auto h-auto w-[252px] mix-blend-multiply md:w-[315px] xl:w-[400px]"
              src="/assets/images/footer-logo-updated.png"
              alt="Vision infinie — luxury wedding creative, by Stavan Shah"
              width={274}
              height={219}
              priority
              unoptimized
            />
          </a>
        </span>
      </header>

      <section className="intro reveal-stagger mx-auto w-full max-w-[60rem] px-4 pb-16 text-center md:px-8 md:pb-24">
        <span
          aria-hidden="true"
          className="mx-auto mb-10 block h-px w-16 bg-bronze md:mb-12 md:w-20"
        />

        <span className="reveal-wrap block">
          <h1 className="reveal font-display text-heading font-bold uppercase text-ink">
            {INTRO_HEADING}
          </h1>
        </span>

        <img className="reveal mt-8 mx-auto h-auto w-[400px] mix-blend-multiply md:w-[650px] xl:w-[850px]" src="/assets/images/main_image.jpeg" alt="" />

        <span className="reveal-wrap mt-8 block">
          <p className="reveal mx-auto max-w-[56ch] font-sans text-lead font-light text-muted">
            {INTRO_PARAGRAPH}
          </p>
        </span>

        <span className="reveal-wrap mt-6 block">
          <p className="reveal mx-auto max-w-[48ch] font-sans text-lead font-light text-ink">
            {INTRO_INVITE}
          </p>
        </span>

        <span className="reveal-wrap mt-10 block">
          <a
            className="reveal shrink-underline inline-block font-display text-heading font-bold uppercase text-ink"
            href="#contact"
          >
            {INTRO_CTA}
          </a>
        </span>
      </section>

      <section className="feedback" id="contact" aria-labelledby="contact-form-heading">
        <h2 id="contact-form-heading" className="sr-only">
          Contact form
        </h2>
        <p className="mx-auto max-w-[52ch] px-4 pt-12 text-center font-sans text-lead font-light text-muted md:px-8 md:pt-16">
          {FORM_INTRO}
        </p>
        <ContactForm />
      </section>

      <Footer />
    </div>
  );
}
