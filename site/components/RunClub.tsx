import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import { club } from "../content";

const fmt = (v: number, decimals: number, suffix: string) => v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

/**
 * Counter that starts as soon as it peeks onto the screen and finishes in 1.4 s,
 * so in ?record=1 it has landed on its final number well before the page scrolls on.
 */
function Count({ value, decimals, suffix }: { value: number; decimals: number; suffix: string }) {
  const el = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const node = el.current!;
    const obj = { v: 0 };
    node.textContent = fmt(0, decimals, suffix);
    let tween: gsap.core.Tween | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      tween = gsap.to(obj, { v: value, duration: 1.4, ease: "power2.out", onUpdate: () => (node.textContent = fmt(obj.v, decimals, suffix)) });
    });
    io.observe(node);
    return () => {
      io.disconnect();
      tween?.kill();
    };
  }, [value, decimals, suffix]);
  return (
    <p ref={el} className="font-display tnum text-[clamp(26px,2.7vw,46px)] whitespace-nowrap">
      {fmt(value, decimals, suffix)}
    </p>
  );
}

/**
 * Stats, official-store style: headline, three counters on hairlines, the cities as plain pills,
 * and two rounded photos (one large, one small overlapping its corner).
 */
export default function RunClub() {
  return (
    <section
      id="club"
      className="section-y relative z-[1] overflow-hidden"
      data-record-label="Run club"
      data-record-time="2"
      data-record-hold="1.5"
      data-record-align="center"
      data-record-align-mobile="top"
      data-record-offset-mobile="-40"
    >
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <p className="eyebrow">{club.eyebrow}</p>
          <h2 className="font-display mt-3 text-[clamp(44px,4.8vw,84px)]">
            {club.heading.map((l, k) => (
              <span key={l} className={`block ${k === 1 ? "text-muted" : ""}`}>
                {l}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-[420px] text-[17px] leading-relaxed text-muted">{club.text}</p>

          <div className="mt-10 grid grid-cols-3 border-t border-line">
            {club.stats.map((s) => (
              <div key={s.label} className="pt-5 pr-2">
                <Count value={s.value} decimals={s.decimals} suffix={s.suffix} />
                <p className="label mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <ul className="mt-9 flex flex-wrap gap-2">
            {club.cities.map((c) => (
              <li key={c} className="rounded-full border border-line px-3.5 py-1.5 text-[13px]">
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <Button href="#club" label={club.cta} />
          </div>
        </div>

        {/* photos */}
        <div className="relative pb-[16%]">
          <div className="relative aspect-[16/11] overflow-hidden rounded-[var(--r)] bg-surface">
            <img src={club.images[0]} alt="Volt Run Club runners on a seafront promenade at dawn" className="absolute inset-0 h-full w-full object-cover" data-zoom />
          </div>
          <div className="absolute right-[-3%] bottom-0 w-[46%] overflow-hidden rounded-[var(--r)] border-[6px] border-bg" data-parallax="0.1">
            <img src={club.images[1]} alt="Two runners high-fiving after a morning run" className="aspect-[4/3] w-full rounded-[calc(var(--r)-6px)] object-cover" />
          </div>
          <span className="absolute bottom-[4%] left-0 text-[14px] text-muted">Every Sunday · 5:30 AM</span>
        </div>
      </div>
    </section>
  );
}
