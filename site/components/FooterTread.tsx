import { useEffect, useId, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Footer walk: a pair of drawn sneakers (inline SVG) walking across the strip from left to right,
 * then re-entering from the left. Real walking, not sliding: each foot stays planted while the other
 * swings forward one stride (heel lifts at push-off, toe rises before the heel lands), so the pair
 * moves at a steady average speed. Each landing squashes the sole a touch, kicks a small dust puff
 * off the heel and leaves a tread print that fades away; a soft warm spotlight follows the pair.
 * One linear GSAP tween drives the clock and everything (prints and dust included) is computed from
 * it, so the loop is seamless and pausing freezes the whole scene. It plays only while the strip is on screen and resumes
 * where it stopped. With ?static=1 / reduced motion the pair stands still in the middle.
 */

const STEP = 0.62; // seconds per step (one foot swing)
const STRIDE = 200; // px a foot travels in one swing (feet land STRIDE / 2 apart)
const LIFT = 14; // px a foot rises at mid-swing
const EDGE = 220; // px the pair starts/ends beyond the strip edges (hidden by the edge fade)
const PRINT_LIFE = 3.2; // s a footprint takes to fade
const DUST_LIFE = 0.55; // s a heel-strike puff lasts
const SQUASH = 0.14; // s of sole compression after landing
const PRINTS = 12; // pooled footprint elements (enough for PRINT_LIFE / STEP landings)
const DUSTS = 4;

function Sneaker({ back = false }: { back?: boolean }) {
  // gradient ids must be unique per instance (two shoes on the page)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const up = `ftw-up-${uid}`;
  const so = `ftw-so-${uid}`;
  return (
    <svg className={`ftw__svg${back ? " ftw__svg--back" : ""}`} viewBox="0 0 120 58" aria-hidden="true">
      <defs>
        <linearGradient id={up} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="ftw__stop-hi" />
          <stop offset="0.55" className="ftw__stop-mid" />
          <stop offset="1" className="ftw__stop-lo" />
        </linearGradient>
        <linearGradient id={so} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dbe3ee" />
        </linearGradient>
      </defs>
      {/* sole: white midsole over a slate outsole */}
      <path className="ftw__outsole" d="M5.4 46c.4 4.6 3.4 7 7.6 7h93c6 0 9.6-2.6 10.4-7z" />
      <path fill={`url(#${so})`} d="M5 42c-.6 2.4-.4 4.4.4 6h111.2c.4-1.6.6-3.2.4-4.6L114 40H7z" />
      <path className="ftw__tread" d="M14 51h90" />
      <path className="ftw__mid" d="M7 44.6h108" />
      {/* upper */}
      <path
        fill={`url(#${up})`}
        d="M7 41C4 31 5 21 12 15.5L23 12c5.5 6 13.5 8 20 5L51 6.5c3-3 8-2.6 9.6 1.4L66 19.5c15 4 33 7.5 45 13.5 5 2.6 6.4 5.5 5 8z"
      />
      {/* toe cap with perforations */}
      <path className="ftw__cap" d="M92 28.2c9 2.4 15.6 4.4 19 6.4 4 2.3 5.4 4.4 4.6 6.4H90c-2-5-1.4-9.6 2-12.8z" />
      <path className="ftw__perf" d="M100 33.2h.01M104 34.4h.01M108 35.8h.01M102 37.2h.01M106 38.4h.01" />
      {/* heel counter + pull tab */}
      <path className="ftw__heel" d="M7 41C4 31 5 21 12 15.5l6-1.9c-3 7.5-3.4 17.8-1 27.4z" />
      <path className="ftw__tab" d="M12.2 15.6c-.9-1.9-.7-3.8.7-4.9l3 3.8z" />
      {/* side stripes */}
      <path className="ftw__stripe" d="M22 36.5c11-.8 22-3.6 33-8.4M28 39.6c11-.8 22-3.4 32-7.6" />
      {/* eyelets + laces */}
      <path className="ftw__eyelet" d="M51 14h.01M54 19h.01M57.5 23.8h.01M61.5 28.2h.01" />
      <path className="ftw__lace" d="M51.5 13.6l7.2-2.6M54.5 18.6l7.6-2.6M58 23.4l7.8-2.4M62 27.8l8.2-2" />
      {/* collar + gloss highlight along the top */}
      <path className="ftw__collar" d="M23 12c5.5 6 13.5 8 20 5" />
      <path className="ftw__gloss" d="M68 21.6c14 3.6 28 6.8 40 12" />
    </svg>
  );
}

const smooth = (s: number) => s * s * (3 - 2 * s);

/**
 * Pose of one foot at time t (seconds). `offset` is in steps: the back foot runs one step behind.
 * Each foot alternates a planted step and a swing step, so it advances one STRIDE per two steps.
 */
function footPose(t: number, offset: number) {
  const u = t / STEP + offset;
  const k = Math.floor(u / 2); // completed stride cycles
  const f = u / 2 - k; // 0..1 within this foot's cycle
  if (f < 0.5) return { x: k * STRIDE, y: 0, r: 0, lift: 0, k, since: f * 2 * STEP }; // planted
  const s = (f - 0.5) * 2; // swing progress 0..1
  const lift = Math.sin(Math.PI * s);
  return {
    x: k * STRIDE + STRIDE * smooth(s),
    y: -LIFT * Math.pow(lift, 0.85),
    r: 11 * Math.sin(2 * Math.PI * s), // heel up after push-off (+), toe up before landing (-)
    lift,
    k,
    since: -1,
  };
}

export default function FooterTread() {
  const root = useRef<HTMLDivElement>(null);
  const feet = useRef<(HTMLDivElement | null)[]>([]);
  const shadows = useRef<(HTMLSpanElement | null)[]>([]);
  const prints = useRef<(HTMLSpanElement | null)[]>([]);
  const dusts = useRef<(HTMLSpanElement | null)[]>([]);
  const glow = useRef<HTMLSpanElement>(null);
  const [still, setStill] = useState(false);
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const tween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => setStill(prefersReducedMotion()), []);

  // One linear clock over a full crossing; rebuilt on resize, keeping the progress.
  useEffect(() => {
    const el = root.current;
    if (!el || still) return;
    const clock = { t: 0 };
    // [front, back]: the back foot is one step out of phase and half a stride behind, so they leapfrog
    const feetCfg = [
      { phase: 0, dx: 0 },
      { phase: 1, dx: -STRIDE / 2 },
    ];

    // landing effects, born at a clock time and aged by the clock
    type Mark = { born: number; x: number; back: boolean };
    let printMarks: (Mark | null)[] = [];
    let dustMarks: (Mark | null)[] = [];
    let nextPrint = 0;
    let nextDust = 0;
    let lastK = [NaN, NaN];
    let lastT = 0;
    let shoeW = 118;

    const reset = () => {
      printMarks = Array(PRINTS).fill(null);
      dustMarks = Array(DUSTS).fill(null);
      lastK = [NaN, NaN];
    };
    reset();

    const render = () => {
      const t = clock.t;
      if (t < lastT) reset(); // loop wrapped (pair is off screen): clear old marks
      lastT = t;
      const start = -EDGE; // fully off the left edge at t = 0
      let sumX = 0;
      feetCfg.forEach((cfg, i) => {
        const p = footPose(t, cfg.phase);
        const foot = feet.current[i];
        const sh = shadows.current[i];
        const x = start + cfg.dx + p.x;
        sumX += x;

        // a new planted step = a landing
        if (p.since >= 0 && p.k !== lastK[i]) {
          if (!Number.isNaN(lastK[i])) {
            printMarks[nextPrint] = { born: t - p.since, x, back: i === 1 };
            nextPrint = (nextPrint + 1) % PRINTS;
            dustMarks[nextDust] = { born: t - p.since, x, back: i === 1 };
            nextDust = (nextDust + 1) % DUSTS;
          }
          lastK[i] = p.k;
        }

        // brief sole compression right after landing
        const sq = p.since >= 0 && p.since < SQUASH ? Math.sin((Math.PI * p.since) / SQUASH) : 0;
        if (foot) {
          foot.style.transform = `translate3d(${x}px, ${p.y}px, 0) rotate(${p.r}deg) scale(${1 + sq * 0.03}, ${1 - sq * 0.06})`;
        }
        if (sh) {
          sh.style.transform = `translate3d(${x}px, 0, 0) scaleX(${1 - p.lift * 0.35 + sq * 0.06})`;
          sh.style.opacity = String(1 - p.lift * 0.55);
        }
      });

      printMarks.forEach((m, j) => {
        const el2 = prints.current[j];
        if (!el2) return;
        const age = m ? (t - m.born) / PRINT_LIFE : 1;
        if (!m || age >= 1) {
          el2.style.opacity = "0";
          return;
        }
        el2.style.transform = `translate3d(${m.x + shoeW * 0.1}px, ${m.back ? -4 : 0}px, 0)`;
        el2.style.opacity = String((m.back ? 0.32 : 0.5) * (1 - age) * Math.min(1, age * 12));
      });

      dustMarks.forEach((m, j) => {
        const el2 = dusts.current[j];
        if (!el2) return;
        const d = m ? (t - m.born) / DUST_LIFE : 1;
        if (!m || d >= 1) {
          el2.style.opacity = "0";
          return;
        }
        const e = 1 - (1 - d) * (1 - d); // ease-out
        el2.style.transform = `translate3d(${m.x + shoeW * 0.04 - e * 20}px, ${(m.back ? -4 : 0) - e * 9}px, 0) scale(${0.5 + e * 0.9})`;
        el2.style.opacity = String(0.6 * (1 - d));
      });

      // warm spotlight centred under the pair
      const g = glow.current;
      if (g) g.style.transform = `translate3d(${sumX / 2 + shoeW / 2}px, 0, 0) translateX(-50%)`;
    };

    let progress = 0;
    const build = () => {
      const was = tween.current;
      if (was) {
        progress = was.progress();
        was.kill();
      }
      shoeW = feet.current[0]?.offsetWidth || shoeW;
      const distance = el.offsetWidth + EDGE * 2; // px the pair covers per crossing
      const steps = Math.ceil(distance / (STRIDE / 2)); // pair advances half a stride per step
      const duration = steps * STEP;
      // whole number of steps per loop, so the restart lands exactly on a planted pose
      const t = gsap.fromTo(clock, { t: 0 }, { t: duration, duration, ease: "none", repeat: -1, onUpdate: render, paused: true });
      t.progress(progress);
      tween.current = t;
      render();
      if (visibleRef.current) t.play();
    };

    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    };
    build();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      tween.current?.kill();
      tween.current = null;
    };
  }, [still]);

  // Animate only while on screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      visibleRef.current = e.isIntersecting;
      setVisible(e.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const t = tween.current;
    if (!t) return;
    if (visible) t.play();
    else t.pause();
  }, [visible, still]);

  return (
    <div ref={root} className={`ftw${still ? " ftw--still" : ""}`} aria-hidden="true">
      <span ref={glow} className="ftw__glow" />
      <span className="ftw__floor" />
      {Array.from({ length: PRINTS }, (_, j) => (
        <span key={`p${j}`} ref={(n) => void (prints.current[j] = n)} className="ftw__print" />
      ))}
      {/* back foot first so the front foot draws over it */}
      {[1, 0].map((i) => (
        <span key={`s${i}`} ref={(n) => void (shadows.current[i] = n)} className={`ftw__shadow ftw__shadow--${i ? "back" : "front"}`} />
      ))}
      {[1, 0].map((i) => (
        <div key={`f${i}`} ref={(n) => void (feet.current[i] = n)} className={`ftw__foot ftw__foot--${i ? "back" : "front"}`}>
          <Sneaker back={i === 1} />
        </div>
      ))}
      {Array.from({ length: DUSTS }, (_, j) => (
        <span key={`d${j}`} ref={(n) => void (dusts.current[j] = n)} className="ftw__dust" />
      ))}
    </div>
  );
}
