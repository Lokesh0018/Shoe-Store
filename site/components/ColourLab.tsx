import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { onSiteReady } from "@/lib/loading";
import Button from "@/components/ui/Button";
import { lab } from "../content";

/** The stage background: a whisper of the colourway on the page's surface grey. */
const tint = (c: string) => `color-mix(in srgb, ${c} 16%, var(--surface))`;

/**
 * The signature moment: one shoe, five colourways. The section pins while you scroll and the
 * colourway follows the scroll: the shoe slides out, the next slides in, the name behind it changes
 * and the rounded stage takes a soft tint of the colour.
 * Scroll-driven, so a ?record=1 laptop and phone show the same colour at the same second.
 */
export default function ColourLab() {
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

  const swatch = (c: (typeof cws)[number], k: number) => (
    <span
      className="cw-swap block h-5 w-5 shrink-0 rounded-full"
      style={{ background: c.color, boxShadow: k === i ? `0 0 0 2px var(--bg), 0 0 0 3.5px var(--text)` : "inset 0 0 0 1px rgba(0,0,0,.12)" }}
    />
  );

  return (
    <section ref={root} id="lab" aria-label={`${lab.eyebrow}: ${lab.model}`} className={`relative z-[1] ${still ? "" : "h-[340vh] md:h-[320vh]"}`}>
      {/* ?record=1: arrive at the start of the pin, then scroll through all five colourways */}
      <div aria-hidden data-record-label="Colour Lab: start" data-record-time="1" className="pointer-events-none absolute inset-x-0 top-0 h-px" />
      <div aria-hidden data-record-label="Colour Lab: all 5 colours" data-record-time="7" data-record-align="bottom" className="pointer-events-none absolute inset-x-0 bottom-0 h-px" />

      <div className={`${still ? "relative min-h-[100svh] py-28" : "sticky top-0 h-[100svh]"} flex flex-col pt-[calc(var(--nav-h)+12px)] pb-3 md:pb-5`}>
        <div className="container-x flex min-h-0 flex-1 flex-col">
          <div className="cw-swap relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--r)]" style={{ background: tint(cw.color) }}>
            {/* the colourway name, large and quiet, behind the shoe */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 select-none">
              {cws.map((c, k) => (
                <p
                  key={c.id}
                  className={`cw-swap ${k === i ? "" : "cw-out"} font-display absolute inset-x-0 text-center text-[clamp(110px,20vw,360px)] leading-none whitespace-nowrap text-fg/[0.06]`}
                  style={{ opacity: k === i ? 1 : 0, transform: `translateY(-50%) translateY(${k === i ? 0 : k < i ? -6 : 6}%)` }}
                >
                  {c.name.replace("Volt ", "")}
                </p>
              ))}
            </div>

            <div className="relative grid min-h-0 flex-1 grid-rows-[auto_1fr_auto] items-center gap-4 p-5 md:p-8 lg:grid-cols-[minmax(0,280px)_1fr_minmax(0,280px)] lg:grid-rows-1 lg:gap-8 lg:p-10">
              {/* left: heading + swatches */}
              <div className="flex flex-col gap-4 self-start lg:gap-8 lg:self-center">
                <div>
                  <p className="eyebrow">
                    {lab.eyebrow} ·{" "}
                    <span key={i} className="cw-in tnum">
                      {i + 1} of {cws.length}
                    </span>
                  </p>
                  <h2 className="font-display mt-3 text-[clamp(40px,4.4vw,76px)]">
                    {lab.heading.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </h2>
                </div>
                <ul className="hidden flex-col lg:flex">
                  {cws.map((c, k) => (
                    <li key={c.id}>
                      <button onClick={() => pick(k)} className="group flex w-full cursor-pointer items-center gap-4 border-b border-fg/10 py-3 text-left">
                        {swatch(c, k)}
                        <span className="flex flex-col">
                          <span className={`cw-swap text-[15px] font-medium ${k === i ? "text-fg" : "text-muted group-hover:text-fg"}`}>{c.name}</span>
                          <span className="text-[13px] text-muted">{c.note}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* centre: the shoe */}
              <div className="relative h-full min-h-[200px] w-full">
                <div className="lab-float absolute inset-0">
                  {cws.map((c, k) => (
                    <img
                      key={c.id}
                      src={c.image}
                      alt={k === i ? `${lab.model} in ${c.name}` : ""}
                      aria-hidden={k !== i}
                      className={`lab-shoe ${k === i ? "" : "cw-out"} absolute inset-0 m-auto h-full max-h-[min(46vh,520px)] w-full object-contain md:drop-shadow-[0_30px_30px_rgba(0,0,0,.18)] lg:max-h-[min(58vh,580px)]`}
                      style={{
                        opacity: k === i ? 1 : 0,
                        transform: `translateX(${k === i ? 0 : k < i ? -12 : 12}%) scale(${k === i ? 1 : 0.97})`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* right: model, specs, price */}
              <div className="flex flex-col gap-4 lg:gap-6">
                {/* phone: swatch dots */}
                <div className="flex items-center justify-between gap-2 lg:hidden">
                  {cws.map((c, k) => (
                    <button key={c.id} onClick={() => pick(k)} aria-label={c.name} className="flex flex-1 cursor-pointer flex-col items-center gap-2">
                      {swatch(c, k)}
                      <span className={`cw-swap text-[12px] font-medium whitespace-nowrap ${k === i ? "text-fg" : "text-muted"}`}>{c.name}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-end justify-between gap-4 lg:block">
                  <div>
                    <p className="label">{lab.model}</p>
                    <p key={i} className="cw-in font-display mt-1.5 text-[clamp(28px,2.4vw,40px)]">
                      {cw.name}
                    </p>
                  </div>
                  <p className="tnum text-[clamp(20px,1.7vw,26px)] font-medium lg:mt-3">{lab.price}</p>
                </div>
                <dl className="hidden grid-cols-2 gap-x-6 gap-y-4 border-t border-fg/10 pt-5 lg:grid">
                  {lab.specs.map((s) => (
                    <div key={s.label}>
                      <dt className="label">{s.label}</dt>
                      <dd className="mt-0.5 text-[15px] font-medium">{s.value}</dd>
                    </div>
                  ))}
                </dl>
                <div>
                  <Button href="#fit" label="Choose size" />
                </div>
              </div>
            </div>

            {/* progress: 5 hairline segments */}
            <div className="relative flex gap-1.5 px-5 pb-5 md:px-8 md:pb-6 lg:px-10" aria-hidden>
              {cws.map((c, k) => (
                <span key={c.id} className="h-[2px] flex-1 bg-fg/10">
                  <span className="cw-swap block h-full origin-left bg-fg" style={{ transform: `scaleX(${k <= i ? 1 : 0})` }} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
