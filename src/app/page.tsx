import Image from "next/image";
import { Preloader } from "@/components/Preloader";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { CONTACT_EMAIL, CONTACT_PHONE, HERO_PARAGRAPH } from "@/lib/site";

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

      <section className="hero mx-auto flex w-full flex-row justify-around items-center px-4 pt-10 pb-16 text-center md:px-8 md:py-10">
        <span className="reveal-wrap">
          <Image
            className="reveal h-auto w-[168px] mix-blend-multiply md:w-[210px] xl:w-[240px]"
            src="/assets/images/Vision-Infinie-logo.png"
            alt="Vision infinie — luxury wedding creative, by Stavan Shah"
            width={274}
            height={219}
            priority
            unoptimized
          />
        </span>

        <span
          aria-hidden="true"
          className="mt-10 block h-px w-16 bg-bronze md:mt-12 md:w-20"
        />

        <h1 className="hero__title flex flex-col font-display text-display uppercase text-ink">
          Coming Soon
        </h1>

        <div className="hero__links flex flex-col items-center gap-5 font-body text-meta uppercase text-ink md:gap-12">
          <div className="hero__lead reveal-wrap mt-8 md:mt-10">
            <p className="reveal mx-auto max-w-[52ch] font-body text-lead text-muted">
              {HERO_PARAGRAPH}
            </p>
          </div>
          <div className="flex flex-row items-center gap-5 font-body text-meta uppercase text-ink md:flex-row md:gap-12">
            <span className="reveal-wrap">
              <a className="reveal shrink-underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </span>
            <span className="reveal-wrap">
              <a
                className="reveal shrink-underline"
                href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`}
              >
                {CONTACT_PHONE}
              </a>
            </span>
          </div>
        </div>
      </section>

      <section className="feedback" aria-labelledby="contact-form-heading">
        <h2 id="contact-form-heading" className="sr-only">
          Contact form
        </h2>
        <ContactForm />
      </section>

      <Footer />
    </div>
  );
}
