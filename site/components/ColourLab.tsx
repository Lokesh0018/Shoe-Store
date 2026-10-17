import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { onSiteReady } from "@/lib/loading";
import { lab as shoeLab } from "@/site/content";
import { ChatIcon } from "./Icons";

/** The stage background: a soft wash of the colourway over cool white. */
const tint = (c: string) => `color-mix(in srgb, ${c} 20%, #ffffff)`;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Ported from the Volt site's Colour Lab (Init commit): one shoe, five colourways. The section pins while
 * you scroll and the colourway follows the scroll: the shoe slides out, the next slides in, the name behind
 * it changes and the rounded stage takes a soft tint of the colour.
 * Scroll-driven, so a ?record=1 laptop and phone show the same colour at the same second.
 */
type Lab = typeof shoeLab;

/** `data` picks the product (shoes by default); `flip` mirrors the layout so a second lab doesn't look copied. */
export default function ColourLab({ data = shoeLab, id = "lab", flip = false }: { data?: Lab; id?: string; flip?: boolean }) {
  const lab = data;
  const cws = lab.colourways;
  const [i, setI] = useState(0);
  const [still, setStill] = useState(false);
  const root = useRef<HTMLElement>(null);
  const cw = cws[i];

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStill(true);
      return;
    }
    let st: ScrollTrigger | undefined;
    const off = onSiteReady(() => {
      // the pinned stretch is split into 5 equal parts
      st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setI(Math.min(cws.length - 1, Math.floor(self.progress * cws.length))),
      });
    });
    return () => {
      off();
      st?.kill();
    };
  }, [cws.length]);

  // clicking a swatch scrolls to that colourway's part of the pin
  const pick = (k: number) => {
    if (still || !root.current || !window.__lenis) return setI(k);
    const r = root.current.getBoundingClientRect();
    const top = r.top + window.scrollY;
    const run = r.height - window.innerHeight;
    window.__lenis.scrollTo(top + ((k + 0.5) / cws.length) * run, { duration: 1.1 });
  };

  return (
    <section ref={root} id={id} aria-label={`${lab.eyebrow}: ${lab.model}`} className={`lab ${flip ? "lab--flip" : ""} ${still ? "lab--still" : ""}`}>
      {/* ?record=1: arrive at the start of the pin, then scroll through all five colourways */}
      <div aria-hidden data-record-label={`${lab.eyebrow}: start`} data-record-time="1" className="pointer-events-none absolute inset-x-0 top-0 h-px" />
      <div aria-hidden data-record-label={`${lab.eyebrow}: all colours`} data-record-time="7" data-record-align="bottom" className="pointer-events-none absolute inset-x-0 bottom-0 h-px" />

      <div className="lab__pin">
        <div className="lab__wrap">
          <div className="lab__stage cw-swap" style={{ background: tint(cw.color), ["--cw" as string]: cw.color }}>
            <header className="lab__top">
              <p className="eyebrow">
                <span className="eyebrow__dash" aria-hidden />
                {lab.eyebrow}
              </p>
              <p className="lab__count tnum" aria-hidden>
                <span key={i} className="cw-in">{pad(i + 1)}</span>
                <span className="lab__count-of">/ {pad(cws.length)}</span>
              </p>
            </header>

            <div className="lab__grid">
              {/* left: heading + colour list */}
              <div className="lab__left">
                <h2 className="lab__title">
                  {lab.heading.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </h2>
                <ul className="lab__list">
                  {cws.map((c, k) => (
                    <li key={c.id}>
                      <button type="button" onClick={() => pick(k)} aria-current={k === i} className="lab__opt cw-swap">
                        <span className="lab__sw cw-swap" style={{ background: c.color }} />
                        <span className="lab__opt-name">{c.name}</span>
                        <span className="lab__opt-note">{c.note}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* centre: the shoe on a soft spotlight + floor shadow */}
              <div className="lab__shoe-area">
                {/* the colourway name, big and white, sized to the shoe column */}
                <div aria-hidden className="lab__ghosts">
                  {cws.map((c, k) => (
                    <p
                      key={c.id}
                      className={`lab__ghost cw-swap ${k === i ? "" : "cw-out"}`}
                      style={{ opacity: k === i ? 1 : 0, transform: `translateY(${k === i ? 0 : k < i ? -8 : 8}%)` }}
                    >
                      {c.name}
                    </p>
                  ))}
                </div>
                <span className="lab__spot" aria-hidden />
                <div className="lab-float lab__float">
                  {cws.map((c, k) => (
                    <img
                      key={c.id}
                      src={c.image}
                      alt={k === i ? `${lab.model} in ${c.name}` : ""}
                      aria-hidden={k !== i}
                      draggable={false}
                      className={`lab-shoe ${k === i ? "" : "cw-out"}`}
                      style={{
                        opacity: k === i ? 1 : 0,
                        transform: `translateX(${k === i ? 0 : k < i ? -14 : 14}%) rotate(${k === i ? -4 : 0}deg) scale(${k === i ? 1 : 0.96})`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* right: product card */}
              <div className="lab__card">
                <p className="lab__model">{lab.model}</p>
                <p key={i} className="lab__cw cw-in">
                  {cw.name}
                </p>
                <p className="lab__note">{cw.note}</p>
                <p className="lab__price tnum">
                  {lab.price}
                  <span>sample price</span>
                </p>
                <dl className="lab__specs">
                  {lab.specs.map((s) => (
                    <div key={s.label}>
                      <dt>{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
                <a href={lab.cta.href} target="_blank" rel="noreferrer" className="btn-cta btn-cta--primary lab__cta">
                  <ChatIcon />
                  {lab.cta.label}
                </a>
              </div>
            </div>

            {/* progress: 5 segments */}
            <div className="lab__progress" aria-hidden>
              {cws.map((c, k) => (
                <span key={c.id}>
                  <span className="cw-swap" style={{ transform: `scaleX(${k <= i ? 1 : 0})` }} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
