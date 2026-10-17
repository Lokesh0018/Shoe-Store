import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onSiteReady } from "@/lib/loading";
import { tech } from "../content";

/**
 * Stacking cards: each card sticks under the nav and the next one slides straight up over it,
 * while the card underneath steps back a little and fades toward the page colour.
 */
export default function TechStack() {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const off = onSiteReady(() => {
      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".tech-card", list.current);
        cards.forEach((card, k) => {
          // step back a little once the next card is half way up (never goes dark: the stack stays readable)
          const next = cards[k + 1]?.parentElement;
          if (next)
            {
            const st = { trigger: next, start: "top 60%", end: "top 25%", scrub: true };
            gsap.to(card, { scale: 0.95, ease: "none", scrollTrigger: st });
            gsap.to(card.querySelector(".tech-dim"), { opacity: 0.55, ease: "none", scrollTrigger: st });
          }
        });
      }, list);
    });
    return () => {
      off();
      ctx?.revert();
    };
  }, []);

  return (
    <section id="tech" className="section-y relative z-[1] !pb-[clamp(40px,6vh,72px)]">
      {/* ?record=1: one move from the size picker to the last card settled */}
      <div aria-hidden data-record-label="Tech stack (all 3 cards)" data-record-time="4.5" data-record-align="bottom" className="pointer-events-none absolute inset-x-0 bottom-0 h-px" />

      <div className="container-x">
        <div data-reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-14">
          <div>
            <p className="eyebrow">{tech.eyebrow}</p>
            <h2 className="font-display mt-3 text-[clamp(44px,4.8vw,84px)]">{tech.heading}</h2>
          </div>
          <p className="label">Foam · Plate · Grip</p>
        </div>

        <div ref={list}>
          {tech.cards.map((c, k) => (
            <div key={c.n} className="sticky mb-[6vh] last:mb-0" style={{ top: `calc(var(--nav-h) + 16px + ${k * 14}px)` }}>
              <article className="tech-card relative h-[min(74svh,600px)] origin-top overflow-hidden rounded-[var(--r)] border border-line bg-bg will-change-transform">
                <div className="grid h-full grid-rows-[42%_1fr] md:grid-cols-[1.25fr_1fr] md:grid-rows-1">
                  <div className="relative overflow-hidden bg-surface">
                    <img src={c.image} alt={`${c.name}: ${c.part}`} className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between p-6 md:p-10 lg:p-12">
                    <div>
                      <p className="tnum text-[14px] text-muted">
                        {c.n} <span className="mx-1.5 text-fg/25">/</span> {c.part}
                      </p>
                      <h3 className="font-display mt-3 text-[clamp(36px,3.6vw,64px)] md:mt-5">{c.name}</h3>
                      <p className="mt-3 max-w-[400px] text-[15px] leading-relaxed text-muted md:mt-5 md:text-[17px]">{c.text}</p>
                    </div>
                    <div className="border-t border-line pt-4 md:pt-6">
                      <p className="font-display tnum text-[clamp(48px,5vw,92px)]" data-count={c.stat} data-decimals={c.decimals} data-suffix={c.suffix}>
                        {c.stat.toLocaleString("en-US", { minimumFractionDigits: c.decimals })}
                        {c.suffix}
                      </p>
                      <p className="label mt-1">{c.label}</p>
                    </div>
                  </div>
                </div>
                {/* fades the card toward the page colour as the next one covers it (opacity only: cheap on phones) */}
                <div aria-hidden className="tech-dim pointer-events-none absolute inset-0 bg-bg opacity-0" />
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
