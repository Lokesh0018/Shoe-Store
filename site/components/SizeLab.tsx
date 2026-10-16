import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { addToBag } from "./DropNav";
import { fit } from "../content";

type Step = "idle" | "size" | "width" | "added";

const PERK_ICONS = [
  "M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  "M12 3a9 9 0 1 0 9 9M12 7v5l3 2M17 3l4 4-4 4",
  "M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4",
];

/**
 * Size picker. Plays by itself (nobody touches the mouse on camera): UK 8 → UK 9 → Wide → Add to bag,
 * and the bag in the nav counts up. Normal visit: plays once each time it comes on screen.
 * ?record=1: plays across the timeline hold, scaled to its length.
 */
export default function SizeLab() {
  const [size, setSize] = useState<string | null>(null);
  const [width, setWidth] = useState(fit.widths[0]);
  const [step, setStep] = useState<Step>("idle");
  const [tap, setTap] = useState<string | null>(null); // key of the element showing the tap ring
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const press = (key: string, fn: () => void) => {
    setTap(`${key}-${Date.now()}`);
    fn();
  };

  /** The hands-free demo, spread over `total` seconds. */
  const play = (total: number) => {
    clear();
    setSize(null);
    setWidth(fit.widths[0]);
    setStep("idle");
    const at = (f: number, fn: () => void) => timers.current.push(setTimeout(fn, total * 1000 * f));
    at(0.08, () => press("size-8", () => setSize("8")));
    at(0.3, () => press(`size-${fit.demo.size}`, () => (setSize(fit.demo.size), setStep("size"))));
    at(0.52, () => press(`width-${fit.demo.width}`, () => (setWidth(fit.demo.width), setStep("width"))));
    at(0.74, () =>
      press("add", () => {
        setStep("added");
        addToBag();
      }),
    );
  };

  useEffect(() => {
    const el = stage.current!;
    const recording = new URLSearchParams(window.location.search).has("record");
    const onHold = (e: Event) => play((e as CustomEvent<{ duration: number }>).detail.duration);
    el.addEventListener("record:hold", onHold);

    let io: IntersectionObserver | undefined;
    if (!recording && !prefersReducedMotion()) {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting && !touched.current) play(4);
          if (!e.isIntersecting) clear();
        },
        { threshold: 0.55 },
      );
      io.observe(el);
    }
    return () => {
      el.removeEventListener("record:hold", onHold);
      io?.disconnect();
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // a real click stops the demo
  const user = (fn: () => void) => {
    touched.current = true;
    clear();
    fn();
  };

  const left = size ? fit.low[size] : undefined;
  const ring = (key: string) => (tap?.startsWith(`${key}-`) ? <span key={tap} className="tap-ring" aria-hidden /> : null);

  return (
    <section id="fit" className="section-y relative z-[1] border-t border-line">
      <div ref={stage} className="container-x relative">
        {/* ?record=1 stop: the picker centred, the demo plays during the hold */}
        <div aria-hidden data-record-label="Size picker (demo)" data-record-time="1.5" data-record-hold="4" data-record-align="center" className="pointer-events-none absolute inset-0" />

        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          {/* the shoe on a sizing pad */}
          <div data-reveal className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--r)] bg-surface">
              {/* ruler */}
              <div aria-hidden className="absolute inset-x-8 bottom-7 flex items-end justify-between">
                {Array.from({ length: 41 }, (_, k) => (
                  <span key={k} className={`w-px ${k % 5 === 0 ? "h-3.5 bg-fg/40" : "h-2 bg-fg/15"}`} />
                ))}
              </div>
              <p aria-hidden className="tnum absolute top-6 left-7 text-[13px] font-medium text-muted">
                Foot length <span className="ml-2 text-fg">{size ? `${(22.4 + (Number(size) - 6) * 0.85).toFixed(1)} cm` : "—"}</span>
              </p>
              <p aria-hidden className="font-display tnum absolute top-5 right-7 text-[clamp(56px,6vw,96px)] leading-none text-fg/10">
                {size ? `UK ${size}` : "UK"}
              </p>
              <img src={fit.image} alt={fit.model} className="absolute inset-x-[8%] top-[22%] w-[84%] -rotate-[3deg] object-contain md:drop-shadow-[0_26px_22px_rgba(0,0,0,.16)]" />
            </div>
          </div>

          {/* the picker */}
          <div>
            <p className="eyebrow">{fit.eyebrow}</p>
            <h2 className="font-display mt-3 text-[clamp(44px,4.8vw,84px)]">
              {fit.heading.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </h2>
            <p className="mt-4 text-[15px] text-muted">{fit.model}</p>

            <div className="mt-9 flex items-baseline justify-between">
              <span className="text-[15px] font-medium">Select size (UK)</span>
              <a href="#fit" className="link-underline text-[14px] text-muted">
                Size guide
              </a>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-7 lg:grid-cols-5 xl:grid-cols-7">
              {fit.sizes.map((s) => {
                const out = fit.soldOut.includes(s);
                return (
                  <button
                    key={s}
                    disabled={out}
                    onClick={() => user(() => setSize(s))}
                    aria-pressed={size === s}
                    className={`size-btn tnum h-12 text-[15px] font-medium enabled:cursor-pointer ${size === s ? "is-on" : ""}`}
                  >
                    {s}
                    {ring(`size-${s}`)}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="w-16 text-[15px] font-medium">Width</span>
              <div className="flex gap-2">
                {fit.widths.map((w) => (
                  <button key={w} onClick={() => user(() => setWidth(w))} aria-pressed={width === w} className={`size-btn h-11 cursor-pointer px-5 text-[14px] font-medium ${width === w ? "is-on" : ""}`}>
                    {w}
                    {ring(`width-${w}`)}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-6 flex min-h-6 items-center gap-2 text-[14px]" aria-live="polite">
              {left ? (
                <>
                  <span className="live-dot h-2 w-2 rounded-full bg-[#d9480f]" />
                  <span className="font-medium">
                    Only <span className="tnum">{left}</span> left in UK {size}
                  </span>
                </>
              ) : size ? (
                <span className="text-muted">In stock · ships in 24 hours</span>
              ) : (
                <span className="text-muted">Pick a size to see stock</span>
              )}
            </p>

            <button
              onClick={() => user(() => (setStep("added"), addToBag()))}
              className="btn btn-solid relative mt-6 w-full cursor-pointer justify-center !py-[1.1rem] text-[15px]"
            >
              {step === "added" ? "Added to bag" : `Add to bag · ${fit.price}`}
              {ring("add")}
            </button>
          </div>
        </div>

        {/* perks */}
        <ul className="mt-16 grid gap-8 border-t border-line pt-10 sm:grid-cols-3 lg:mt-24">
          {fit.perks.map((p, k) => (
            <li key={p.title} className="flex items-start gap-4">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="mt-0.5 shrink-0" aria-hidden>
                <path d={PERK_ICONS[k]} />
              </svg>
              <div>
                <p className="text-[15px] font-medium">{p.title}</p>
                <p className="mt-0.5 text-[14px] text-muted">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
