import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import { onReveal } from "./IntroLoader";
import { hero } from "../content";

/**
 * Official-store hero: one full-bleed photo with a very slow zoom, a single big headline bottom-left,
 * two pill buttons, and the featured product + price bottom-right. Nothing else.
 */
export default function StoreHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    return onReveal(() => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root.current);
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(q(".hw"), { yPercent: 100, duration: 1.1 }, 0.1)
        .from(q(".hi"), { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.35);
    });
  }, []);

  return (
    <section ref={root} id="top" className="on-dark relative h-[100svh] min-h-[640px] overflow-hidden bg-[#0b0c0d] text-white">
      {/* ?record=1: first stop, 3 s on the hero */}
      <div aria-hidden data-record-label="Hero" data-record-time="0" data-record-hold="3" className="pointer-events-none absolute inset-x-0 top-0 h-px" />

      <div className="absolute inset-0 overflow-hidden">
        <img
          src={hero.image}
          alt="Runner in Volt Runners shoes on a wet city road at night"
          fetchPriority="high"
          className="hero-zoom absolute inset-0 h-full w-full object-cover object-[72%_50%] md:object-center"
        />
      </div>
      {/* readability: a soft shade from the bottom only */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.78)_0%,rgba(0,0,0,.45)_45%,rgba(0,0,0,.05)_75%)] md:bg-[linear-gradient(0deg,rgba(0,0,0,.62)_0%,rgba(0,0,0,.18)_42%,transparent_65%)]" />

      <div className="container-x relative z-10 flex h-full flex-col justify-end pt-[var(--nav-h)] pb-[clamp(32px,6vh,64px)]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <p className="hi mb-4 text-[15px] font-medium text-white/80">{hero.eyebrow}</p>
            <h1 className="font-display overflow-hidden pb-[0.06em] text-[clamp(64px,9vw,156px)]">
              <span className="hw block">{hero.line}</span>
            </h1>
            <p className="hi mt-5 max-w-[460px] text-[16px] leading-relaxed text-white/80 md:text-[17px]">{hero.text}</p>
            <div className="hi mt-8 flex flex-wrap gap-3">
              <Button href={hero.primary.href} label={hero.primary.label} />
              <Button href={hero.secondary.href} label={hero.secondary.label} style="outline" />
            </div>
          </div>

          <div className="hi hidden border-l border-white/30 pl-5 text-[14px] sm:block lg:mb-2">
            <p className="font-medium">
              {hero.strip.model} <span className="tnum ml-2 text-white/80">{hero.strip.price}</span>
            </p>
            <p className="mt-1 text-white/70">{hero.strip.specs}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
