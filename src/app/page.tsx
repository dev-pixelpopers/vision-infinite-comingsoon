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

      <div className="page contact">
        <section className="contact__hero">
          <div className="contact__hero-top">
            <h1 className="contact__title">
              <span className="contact__title-wrap">
                <span className="reveal">Coming</span>
              </span>
              <span className="contact__title-wrap">
                <span className="reveal">Soon</span>
              </span>
            </h1>

            <div className="contact__hero-info">
              <div className="contact__links">
                <span className="reveal-wrap">
                  <a
                    className="contact__link shrink-underline reveal"
                    href={`mailto:${CONTACT_EMAIL}`}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </span>
                <span className="reveal-wrap">
                  <a
                    className="contact__link shrink-underline reveal"
                    href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`}
                  >
                    {CONTACT_PHONE}
                  </a>
                </span>
              </div>

              <div className="contact__hero-text">
                <p className="reveal-wrap">
                  <span className="reveal">{HERO_PARAGRAPH}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="feedback" aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" className="vi-sr-only">
            Contact form
          </h2>
          <ContactForm />
        </section>
      </div>

      <Footer />
    </div>
  );
}
