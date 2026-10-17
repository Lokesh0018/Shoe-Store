import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { marquee } from "@/site/content";

/**
 * Navy band right under the hero. Row 1: big category words with a product cut-out between each.
 * Row 2: slim facts line running the other way. Both loop on their own (no mouse needed on camera)
 * and lean a little faster with scroll speed. Restyled from components/patterns/Marquee.
 */
export default function AisleMarquee() {
  const big = useRef<HTMLDivElement>(null);
  const small = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const a = gsap.fromTo(big.current, { xPercent: 0 }, { xPercent: -50, duration: 42, ease: "none", repeat: -1 });
    const b = gsap.fromTo(small.current, { xPercent: -50 }, { xPercent: 0, duration: 34, ease: "none", repeat: -1 });
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const boost = gsap.utils.clamp(1, 3, 1 + Math.abs(self.getVelocity()) / 1200);
        gsap.to([a, b], { timeScale: boost, duration: 0.3, overwrite: true });
        gsap.to([a, b], { timeScale: 1, duration: 1.4, delay: 0.35 });
      },
    });
    return () => {
      a.kill();
      b.kill();
      st.kill();
    };
  }, []);

  const label = marquee.words.map((w) => w.word).join(", ");

  return (
    <section className="aisle" aria-label={`We stock: ${label}`}>
      <div className="aisle__row" aria-hidden>
        <div ref={big} className="aisle__track">
          {[0, 1].map((half) => (
            <div key={half} className="aisle__half">
              {[...marquee.words, ...marquee.words].map((w, i) => (
                <span key={i} className={`aisle__item${i % 2 ? " aisle__item--outline" : ""}`}>
                  <span className="aisle__word">{w.word}</span>
                  <img className="aisle__img" src={w.img.src} alt="" width={w.img.w} height={w.img.h} loading="lazy" draggable={false} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="aisle__facts" aria-hidden>
        <div ref={small} className="aisle__track">
          {[0, 1].map((half) => (
            <div key={half} className="aisle__half">
              {[...marquee.facts, ...marquee.facts, ...marquee.facts].map((f, i) => (
                <span key={i} className="aisle__fact">
                  {f}
                  <span className="aisle__dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
