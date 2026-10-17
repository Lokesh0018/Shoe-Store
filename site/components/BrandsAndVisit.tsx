import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { about, brand, categories, footer, nav, stockedBrands } from "@/site/content";
import { ArrowIcon, ChatIcon, PhoneIcon, PinIcon, StepsMark } from "./Icons";

/**
 * Brand showcase: centred heading, then two rows of identical white logo chips gliding in opposite
 * directions (the second row in a shuffled order). Each logo gets the same visual area (wide logos shorter,
 * square ones taller). Rows pause under the mouse; still with ?static=1 / reduced motion.
 */
export function Brands() {
  const [still, setStill] = useState(false);
  useEffect(() => setStill(prefersReducedMotion()), []);
  // both rows carry every brand; the second walks the list 5 at a time (a shuffle, not a shift), so when the
  // rows cross each other at most one logo ever sits above the same logo
  const n = stockedBrands.length;
  const rows = [stockedBrands, stockedBrands.map((_, j) => stockedBrands[(j * 5) % n])];

  return (
    <section id="brands" className={`bmq ${still ? "bmq--still" : ""}`} aria-labelledby="brands-title">
      <header className="container-x bmq__head">
        <p className="eyebrow">
          <span className="eyebrow__dash" aria-hidden />
          Trusted brands
        </p>
        <h2 id="brands-title" className="bmq__title" data-reveal>
          Names you know,
          <br />
          on our shelves.
        </h2>
        <p className="bmq__count" data-reveal>
          <span className="bmq__count-n">{stockedBrands.length}</span> brands for shoes, sandals &amp; bags
        </p>
      </header>
      <ul className="sr-only">
        {stockedBrands.map((b) => (
          <li key={b.name}>{b.name}</li>
        ))}
      </ul>
      <div className="bmq__rows" aria-hidden>
        {rows.map((row, r) => {
          // two copies per half so each half is always wider than a 2560px screen
          const run = [...row, ...row];
          return (
            <div key={r} className={`bmq__viewport ${r ? "bmq__viewport--rev" : ""}`}>
              <div className="bmq__track">
                {[0, 1].map((half) => (
                  <div key={half} className="bmq__half">
                    {run.map((b, i) => (
                      <span key={i} className="bmq__chip">
                        <img
                          src={b.logo}
                          alt=""
                          draggable={false}
                          loading="lazy"
                          className="bmq__logo"
                          style={{ width: `calc(var(--logo-area) * ${(Math.sqrt(b.r) * (b.s ?? 1)).toFixed(3)})`, aspectRatio: String(b.r) }}
                        />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * About + visit card. #contact is the hero's "Find Our Store" target.
 * Every fact here comes from data: categories + brands are counted, the offer and address are from the shop's card.
 */
export function Visit() {
  const facts = [
    { n: String(categories.length), label: "Categories under one roof" },
    { n: String(stockedBrands.length), label: "Trusted brands in store" },
    { n: "All ages", label: "Kids to grandparents" }, // the shop line: footwear for every generation
  ];
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

          <dl className="visit__facts" data-reveal="stagger">
            {facts.map((f) => (
              <div key={f.label} className="visit__fact">
                <dt>{f.label}</dt>
                <dd>{f.n}</dd>
              </div>
            ))}
          </dl>

          <ul className="visit__cats" aria-label="What you will find" data-reveal="stagger">
            {categories.map((c) => (
              <li key={c.name} className="visit__cat">
                <span className="visit__cat-img" aria-hidden>
                  <img src={c.img.src} alt="" width={c.img.w} height={c.img.h} loading="lazy" />
                </span>
                {c.name}
              </li>
            ))}
          </ul>

          <div className="visit__ticket" data-reveal>
            <span className="visit__ticket-off">
              <small>Extra</small>
              5–10%
              <small>off</small>
            </span>
            <span className="visit__ticket-text">
              <strong>Card offer</strong>
              {brand.offer}
            </span>
          </div>
        </div>

        <div id="contact" className="visit__card" data-reveal>
          <div className="visit__map">
            <iframe
              src={brand.mapEmbed}
              title={`Map: ${brand.name} ${brand.line2}, Madhurawada`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              tabIndex={-1}
            />
            <span className="visit__landmark">
              <PinIcon /> {brand.landmark}
            </span>
          </div>
          <div className="visit__card-body">
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
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo" aria-label="Store Information and Footer">
      <div className="container-x site-footer__main">
        {/* Col 1: Brand Overview & Tagline */}
        <div className="site-footer__col site-footer__col--brand">
          <a href="#top" className="site-footer__logo" aria-label="Sri Hanuman Shoe Mart - Back to top">
            <StepsMark width={42} height={42} />
            <div className="site-footer__logo-text">
              <span className="site-footer__logo-l1">{brand.name}</span>
              <span className="site-footer__logo-l2">{brand.line2}</span>
            </div>
          </a>
          <p className="site-footer__desc">
            Your trusted family footwear destination on Madhurawada Main Road. Bringing comfort, durability, and style for every age and every stride.
          </p>
          <div className="site-footer__pill-row">
            <span className="site-footer__badge">
              <span className="site-footer__badge-dot" />
              Store Open Today · 9:30 AM – 9:30 PM
            </span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="site-footer__col">
          <h3 className="site-footer__heading">Quick Navigation</h3>
          <ul className="site-footer__links">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="site-footer__link">
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#lab" className="site-footer__link">
                Shoe Lab 3D
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Footwear Categories */}
        <div className="site-footer__col">
          <h3 className="site-footer__heading">Footwear Categories</h3>
          <ul className="site-footer__links">
            <li>
              <a href="#collections" className="site-footer__link">
                School Shoes (Black & White)
              </a>
            </li>
            <li>
              <a href="#collections" className="site-footer__link">
                Sports & Running Footwear
              </a>
            </li>
            <li>
              <a href="#collections" className="site-footer__link">
                Formal Leather Shoes
              </a>
            </li>
            <li>
              <a href="#collections" className="site-footer__link">
                Sandals & Daily Slippers
              </a>
            </li>
            <li>
              <a href="#collections" className="site-footer__link">
                Backpacks & School Bags
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Store Visit & Connect */}
        <div className="site-footer__col site-footer__col--contact">
          <h3 className="site-footer__heading">Visit & Enquire</h3>
          <address className="site-footer__address">
            {brand.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <div className="site-footer__cta-group">
            <a
              href={brand.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__btn site-footer__btn--wa"
              aria-label="Order or enquire stock on WhatsApp (opens new tab)"
            >
              <ChatIcon width={16} height={16} />
              <span>WhatsApp Store</span>
            </a>
            <a
              href={brand.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__btn site-footer__btn--map"
              aria-label="Get Google Maps driving directions (opens new tab)"
            >
              <PinIcon width={16} height={16} />
              <span>Google Maps</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sub-footer bottom bar */}
      <div className="site-footer__bottom">
        <div className="container-x site-footer__bottom-inner">
          <p className="site-footer__copyright">
            © {new Date().getFullYear()} Sri Hanuman Shoe Mart. {footer.credit}.
          </p>
          <div className="site-footer__legal">
            <span className="site-footer__subnote">
              {footer.note} · 3D sneaker: “Materials Variants Shoe” by Shopify, CC BY 4.0.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
