import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { drop } from "../content";

const AUTO_MS = 1500;

/**
 * ProductGrid, official-store style: four equal tiles, the shoe on soft grey, plain details below.
 * While on screen the "hot" card (shoe lifts, "Quick add" slides up) moves along by itself;
 * in ?record=1 the timeline hold drives it.
 */
export default function DropRail() {
  const [hot, setHot] = useState(0);
  const [visible, setVisible] = useState(false);
  const hovering = useRef(false);
  const recording = useRef(false);
  const still = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const n = drop.items.length;

  useEffect(() => {
    still.current = prefersReducedMotion();
    recording.current = new URLSearchParams(window.location.search).has("record");
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(stage.current!);

    // ?record=1: step through all four cards across the hold
    let timers: ReturnType<typeof setTimeout>[] = [];
    const el = stage.current!;
    const onHold = (e: Event) => {
      const step = ((e as CustomEvent<{ duration: number }>).detail.duration * 1000) / n;
      timers.forEach(clearTimeout);
      setHot(0);
      timers = Array.from({ length: n - 1 }, (_, k) => setTimeout(() => setHot(k + 1), step * (k + 1)));
    };
    el.addEventListener("record:hold", onHold);
    return () => {
      io.disconnect();
      el.removeEventListener("record:hold", onHold);
      timers.forEach(clearTimeout);
    };
  }, [n]);

  useEffect(() => {
    if (!visible || still.current || recording.current) return;
    const t = setInterval(() => !hovering.current && setHot((h) => (h + 1) % n), AUTO_MS);
    return () => clearInterval(t);
  }, [visible, n]);

  return (
    <section id="drop" className="section-y relative z-[1]">
      <div className="container-x">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{drop.eyebrow}</p>
            <h2 className="font-display mt-3 text-[clamp(48px,5.6vw,96px)]">{drop.heading}</h2>
          </div>
          <div className="flex max-w-[340px] flex-col items-start gap-3 pb-2">
            <p className="text-[16px] leading-relaxed text-muted">{drop.text}</p>
            <a href="#collections" className="link-underline text-[15px] font-medium">
              Shop all 62 styles
            </a>
          </div>
        </div>

        <div ref={stage} className="relative mt-[clamp(40px,5vw,72px)]">
          {/* ?record=1 stop: cards centred on screen */}
          <div
            aria-hidden
            data-record-label="New drop (hold)"
            data-record-time="1.5"
            data-record-hold="2.5"
            data-record-hold-mobile="1.5"
            data-record-align="center"
            data-record-align-mobile="top"
            data-record-offset-mobile="-150"
            className="pointer-events-none absolute inset-0"
          />
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-4 md:gap-y-10 lg:grid-cols-4" onMouseLeave={() => (hovering.current = false)}>
            {drop.items.map((s, k) => {
              const on = k === hot;
              return (
                <a
                  key={s.id}
                  href="#fit"
                  aria-label={`${s.name}, ${s.kind}, ${s.price}: choose your size`}
                  onMouseEnter={() => {
                    if (recording.current) return;
                    hovering.current = true;
                    setHot(k);
                  }}
                  className="group relative block cursor-pointer rounded-[var(--r)]"
                >
                  {/* the tile */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--r)] bg-surface">
                    {s.tag && <span className="tag absolute top-2.5 left-2.5 z-[1] md:top-4 md:left-4">{s.tag}</span>}
                    <img
                      src={s.image}
                      alt={s.name}
                      className="pointer-events-none absolute inset-0 m-auto w-[86%] object-contain transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:drop-shadow-[0_22px_18px_rgba(0,0,0,.16)]"
                      style={{ transform: `translateY(${on ? -4 : 0}%) rotate(${on ? -5 : 0}deg) scale(${on ? 1.04 : 1})` }}
                    />
                    <span
                      aria-hidden
                      className="absolute right-2.5 bottom-2.5 left-2.5 rounded-full bg-fg py-2.5 text-center text-[13px] font-medium text-bg md:right-4 md:bottom-4 md:left-4 md:py-3 md:text-[14px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
                      style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(10px)" }}
                    >
                      Quick add
                    </span>
                  </div>

                  {/* details */}
                  <div className="mt-3 flex flex-col gap-1 md:mt-4 md:flex-row md:items-start md:justify-between md:gap-4">
                    <div>
                      <h3 className="text-[15px] font-medium md:text-[16px]">{s.name}</h3>
                      <p className="mt-0.5 text-[13px] text-muted md:text-[14px]">{s.kind}</p>
                    </div>
                    <p className="tnum text-[15px] font-medium whitespace-nowrap md:text-right md:text-[16px]">
                      {s.price}
                      {s.was && <span className="ml-2 text-[13px] font-normal text-muted line-through md:ml-0 md:block">{s.was}</span>}
                    </p>
                  </div>
                  <p className="mt-2 hidden text-[13px] text-muted sm:block">{s.specs}</p>
                  <div className="mt-3 flex gap-1.5">
                    {s.dots.map((d) => (
                      <span key={d} className="h-3 w-3 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.14)]" style={{ background: d }} />
                    ))}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
