import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { brand, categories } from "@/site/content";
import { ArrowIcon, ChatIcon } from "./Icons";

/** "Shop by category": the section the hero's primary CTA lands on. Cards rise in a stagger as it enters. */
export default function Collections() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".cat-card", {
        y: 48,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: { each: 0.07, grid: "auto", from: "start" },
        scrollTrigger: { trigger: ".cat-grid", start: "top 82%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="collections" ref={root} className="collections" aria-labelledby="col-title">
      <div className="container-x">
        <header className="sec-head sec-head--split">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__dash" aria-hidden />
              Collections
            </p>
            <h2 id="col-title" className="sec-title" data-reveal>
              Something for every
              <br />
              foot in the family.
            </h2>
          </div>
          <div className="sec-head__side" data-reveal>
            <p className="sec-lede">Walk in and try them on. Ask us on WhatsApp if your size is in stock before you come.</p>
            <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-cta btn-cta--primary">
              <ChatIcon /> Ask about sizes
            </a>
          </div>
        </header>

        <ul className="cat-grid">
          {categories.map((c, k) => (
            <li key={c.name} className="cat-card">
              <div className="cat-card__stage">
                <span className="cat-card__num" aria-hidden>
                  {String(k + 1).padStart(2, "0")}
                </span>
                <span className="cat-card__disc" aria-hidden />
                <img src={c.img.src} alt={c.img.alt} width={c.img.w} height={c.img.h} loading="lazy" decoding="async" className="cat-card__img" />
              </div>
              <div className="cat-card__text">
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.note}</p>
                </div>
                <span className="cat-card__go" aria-hidden>
                  <ArrowIcon />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
