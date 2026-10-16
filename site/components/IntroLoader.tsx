import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { atFromUrl, waitForClock } from "@/lib/atTime";

// The engine loader is switched off (meta.loader = false). This one always takes exactly LOADER_SECONDS,
// then tells the page to play its intro. With &at=HH:MM:SS it shows its first frame, frozen, until that
// time, while it preloads every image on the page (docs/RECORDING.md).

const FILL = 1.7; // the hairline fills, the counter runs to 100
const LIFT = 0.8; // the white sheet lifts away, revealing the page
export const LOADER_SECONDS = FILL + LIFT; // 2.5

let revealed = false;

/** Run once the loader has opened (immediately with ?static=1). */
export function onReveal(fn: () => void) {
  if (revealed) {
    fn();
    return () => {};
  }
  const h = () => fn();
  window.addEventListener("volt:reveal", h, { once: true });
  return () => window.removeEventListener("volt:reveal", h);
}

function reveal() {
  if (revealed) return;
  revealed = true;
  window.dispatchEvent(new Event("volt:reveal"));
}

const loadImage = (src: string) =>
  new Promise<void>((done) => {
    const img = new Image();
    img.onload = img.onerror = () => done();
    img.src = src;
  });

/** Every <img> on the page (fetched by URL, so lazy or hidden ones count too) and the fonts. */
async function preloadAll() {
  const urls = [...new Set(Array.from(document.images).map((i) => i.currentSrc || i.src).filter(Boolean))];
  await Promise.all([...urls.map(loadImage), document.fonts.ready]);
}

/**
 * Quiet opening: the wordmark on white, a hairline that fills while a counter runs to 100,
 * then the whole sheet lifts away and the page plays its intro.
 */
export default function IntroLoader({ name }: { name: string }) {
  const sheet = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // ?static=1: a class that stops the CSS loops (hero zoom, shoe float...)
    if (new URLSearchParams(window.location.search).has("static")) document.documentElement.classList.add("is-static");
    if (prefersReducedMotion()) {
      setGone(true);
      reveal();
      return;
    }
    window.scrollTo(0, 0);
    window.__lenis?.stop();

    // &at=: freeze on the first frame (empty line, name visible), preload everything, play at that time
    const target = atFromUrl();
    let ready = !target;
    let cancelClock = () => {};
    if (target) {
      const t0 = performance.now();
      preloadAll().then(() => {
        ready = true;
        console.log(`[record] loader: all images ready in ${((performance.now() - t0) / 1000).toFixed(1)} s`);
      });
    }

    const n = { v: 0 };
    const show = () => {
      if (count.current) count.current.textContent = String(Math.round(n.v)).padStart(3, "0");
    };

    // context + revert: React dev mode runs this effect twice
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: !!target });
      if (!target) tl.from(word.current, { opacity: 0, y: 12, duration: 0.6, ease: "power3.out" }, 0);
      tl.fromTo(line.current, { scaleX: 0 }, { scaleX: 0.92, duration: FILL - 0.15, ease: "power2.inOut" }, 0.05)
        .to(n, { v: 92, duration: FILL - 0.15, ease: "power2.inOut", onUpdate: show }, 0.05)
        .addLabel("done", FILL - 0.1)
        .add(() => {
          // &at= and still loading: hold at 92 until everything is in, then finish
          if (ready) return;
          tl.pause();
          const wait = () => (ready ? tl.play() : requestAnimationFrame(wait));
          wait();
        }, "done")
        .to(line.current, { scaleX: 1, duration: 0.1, ease: "none" }, "done")
        .to(n, { v: 100, duration: 0.1, ease: "none", onUpdate: show }, "done")
        .addLabel("lift", FILL)
        .add(() => {
          window.__lenis?.start();
          reveal();
        }, "lift")
        .to(word.current, { opacity: 0, y: -24, duration: LIFT * 0.5, ease: "power2.in" }, "lift")
        .to(sheet.current, { yPercent: -100, duration: LIFT, ease: "power3.inOut" }, "lift")
        .add(() => setGone(true), LOADER_SECONDS);

      if (target) {
        if (Date.now() < target.getTime()) console.log(`[record] loader frozen until ${target.toLocaleTimeString()}`);
        cancelClock = waitForClock(target, () => {
          if (!ready) console.warn("[record] assets not ready at start time: the loader holds until they are");
          tl.play(0);
        });
      }
    });

    return () => {
      cancelClock();
      ctx.revert();
    };
  }, []);

  if (gone) return null;

  return (
    <div data-loader aria-hidden className="fixed inset-0 z-[100] overflow-hidden">
      <div ref={sheet} className="absolute inset-0 flex items-center justify-center bg-bg">
        <div ref={word} className="flex w-[min(78vw,420px)] flex-col gap-5">
          <div className="flex items-baseline justify-between gap-6">
            <span className="font-display text-[clamp(30px,3.4vw,48px)]">{name}</span>
            <span ref={count} className="tnum text-[13px] font-medium text-muted">
              000
            </span>
          </div>
          <span className="block h-px w-full bg-line">
            <span ref={line} className="block h-full w-full origin-left scale-x-0 bg-fg" />
          </span>
        </div>
      </div>
    </div>
  );
}
