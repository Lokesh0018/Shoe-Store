import { about, brand, footer } from "@/site/content";
import { ArrowIcon, ChatIcon, PhoneIcon, PinIcon, StepsMark } from "./Icons";

/** Brands the shop stocks (from its card), set as type — no logos. */
export function Brands() {
  return (
    <section id="brands" className="brands" aria-labelledby="brands-title">
      <div className="container-x brands__inner">
        <h2 id="brands-title" className="brands__label">
          Trusted brands on our shelves
        </h2>
        <ul className="brands__list" data-reveal="stagger">
          {brand.brands.map((b) => (
            <li key={b}>{b}</li>
          ))}
          <li className="brands__more">& more</li>
        </ul>
      </div>
    </section>
  );
}

/** About + visit card. #contact is the hero's "Find Our Store" target. */
export function Visit() {
  return (
    <section id="about" className="visit" aria-labelledby="about-title">
      <div className="container-x visit__grid">
        <div className="visit__about">
          <p className="eyebrow">
            <span className="eyebrow__dash" aria-hidden />
            {about.eyebrow}
          </p>
          <h2 id="about-title" className="sec-title" data-reveal>
            {about.title[0]}
            <br />
            {about.title[1]}
          </h2>
          <p className="sec-lede" data-reveal>
            {about.body}
          </p>
          <p className="visit__offer" data-reveal>
            <span className="visit__offer-tag">Card offer</span>
            {brand.offer}
          </p>
        </div>

        <div id="contact" className="visit__card" data-reveal>
          <h3 className="visit__card-title">Visit the store</h3>
          <address className="visit__address">
            {brand.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </address>
          <ul className="visit__rows">
            {brand.phones.map((p) => (
              <li key={p.tel}>
                <a href={`tel:${p.tel}`} className="visit__row">
                  <PhoneIcon /> <span>{p.label}</span>
                  <ArrowIcon className="visit__row-arrow" />
                </a>
              </li>
            ))}
          </ul>
          <div className="visit__actions">
            <a href={brand.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-cta btn-cta--primary">
              <PinIcon /> Get directions
            </a>
            <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-cta btn-cta--ghost">
              <ChatIcon /> WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-x site-footer__inner">
        <div className="site-footer__brand">
          <StepsMark width={34} height={34} />
          <span>
            <strong>Sri Hanuman Shoe Mart</strong>
            <br />
            Madhurawada, Visakhapatnam
          </span>
        </div>
        <p className="site-footer__note">
          {footer.credit}. {footer.note}
          <br />
          3D sneaker: “Materials Variants Shoe” by Shopify, CC BY 4.0 (re-coloured).
        </p>
      </div>
    </footer>
  );
}
