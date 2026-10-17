import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { hero } from "@/site/content";
import { ArrowIcon, PinIcon } from "@/site/components/Icons";
import ShowroomStage from "./ShowroomStage";
import { canRender3D, createHeroMotion, finePointer } from "./heroMotion";

/**
 * Sri Hanuman hero: copy on the left (~40%), a sunlit showroom on the right (~60%).
 * One GSAP timeline plays the whole entrance; afterwards only the sneaker floats,
 * the orbit's light travels, and (on desktop) the layers follow the pointer.
 *
 * Integration point for the next section: the hero exposes its scroll progress on
 * `motion.scroll` and fades out over its own height — no pinning, normal document flow.
 */
export default function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const [motion] = useState(createHeroMotion);
  const [use3D] = useState(canRender3D);
  const [active, setActive] = useState(true);

  // ENTRANCE — layout effect so the "from" states apply before the first paint (no flash).
  useLayoutEffect(() => {
    const el = root.current!;
    if (motion.still) {
      el.dataset.intro = "done";
      return;
    }
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: () => (el.dataset.intro = "done") });

      // Phase 1 — room, header, pedestals (0 → 1.2 s)
      tl.fromTo(q(".hs-bg"), { opacity: 0 }, { opacity: 1, duration: 1.1, ease: "power1.out" }, 0)
        .fromTo(document.querySelectorAll(".hs-nav"), { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.9 }, 0.15)
        .fromTo(q(".hs-arch"), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.06 }, 0.1)
        .fromTo(q(".hs-ped"), { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.07 }, 0.25)
        .fromTo(q(".hs-prod"), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1, stagger: 0.06 }, 0.55);

      // Phase 2 — typography (0.8 → 1.8 s)
      tl.fromTo(q(".hs-eyebrow"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.8)
        .fromTo(q(".hs-line > span"), { yPercent: 108 }, { yPercent: 0, duration: 1.05, stagger: 0.13, ease: "power4.out" }, 0.88)
        .fromTo(q(".hs-body"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, 1.25)
        .fromTo(q(".hs-cta-1"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 1.42)
        .fromTo(q(".hs-cta-2"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 1.54)
        .fromTo(q(".hs-note"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.7);

      // Phase 3 — sneaker settles, orbit draws, orange reflection on the pedestal (0.8 → 2.4 s)
      // (the still image plays this; the WebGL sneaker takes over at the same pose right after)
      tl.fromTo(q(".sneaker"), { opacity: 0, y: 40, rotate: -5 }, { opacity: 1, y: 0, rotate: 0, duration: 1.4 }, 0.8)
        .fromTo(motion, { enter: 0 }, { enter: 1, duration: 1.5, ease: "power3.out" }, 0.8)
        .fromTo(q(".orbit-line"), { strokeDasharray: "1000 1000", strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 1.05)
        .fromTo(q(".orbit-comet"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 2.2)
        .fromTo(q(".ped__glow"), { opacity: 0, scaleX: 0.4 }, { opacity: 1, scaleX: 1, duration: 1, ease: "power2.out" }, 1.6);
    }, el);
    return () => ctx.revert();
  }, [motion]);

  // AMBIENT + POINTER + SCROLL + VISIBILITY
  useEffect(() => {
    const el = root.current!;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);

      // The light on the orbit travels round once every 9 s
      const comet = motion.still ? null : gsap.fromTo(q(".orbit-comet"), { strokeDashoffset: 0 }, { strokeDashoffset: -1000, duration: 9, ease: "none", repeat: -1 });

      // Scroll hand-off: copy lifts away, the room eases back, the sneaker turns (read by the 3D loop)
      if (!motion.still) {
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            onUpdate: (st) => (motion.scroll = st.progress),
          },
        })
          .to(q(".hs-copy"), { y: -70, opacity: 0, ease: "none" }, 0)
          .to(q(".hs-scene"), { yPercent: 6, scale: 0.97, ease: "none" }, 0)
          .to(q(".hs-bg"), { yPercent: 10, ease: "none" }, 0);
      }

      // Pointer parallax (desktop only): each layer moves by its depth
      let offPointer = () => {};
      if (!motion.still && finePointer()) {
        const layers = q<HTMLElement>(".hs-layer").map((l) => {
          const d = Number(l.dataset.depth || 0.5);
          return { d, x: gsap.quickTo(l, "x", { duration: 1.1, ease: "power3.out" }), y: gsap.quickTo(l, "y", { duration: 1.1, ease: "power3.out" }) };
        });
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          motion.px = gsap.utils.clamp(-1, 1, ((e.clientX - r.left) / r.width) * 2 - 1);
          motion.py = gsap.utils.clamp(-1, 1, ((e.clientY - r.top) / r.height) * 2 - 1);
          for (const l of layers) {
            l.x(-motion.px * 16 * l.d);
            l.y(-motion.py * 9 * l.d);
          }
        };
        const onLeave = () => {
          motion.px = motion.py = 0;
          for (const l of layers) (l.x(0), l.y(0));
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        offPointer = () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      }

      // Stop every loop while the hero is off-screen
      const io = new IntersectionObserver(([e]) => {
        motion.visible = e.isIntersecting;
        setActive(e.isIntersecting);
        if (comet) e.isIntersecting ? comet.play() : comet.pause();
      });
      io.observe(el);

      return () => {
        offPointer();
        io.disconnect();
      };
    }, el);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [motion]);

  return (
    <section id="top" ref={root} className="hero" data-intro="playing" aria-labelledby="hero-title">
      {/* Room: warm wall, sun from the left. Decorative. */}
      <div className="hs-bg" aria-hidden>
        <div className="hs-wall" />
        <div className="hs-sun" />
      </div>

      <div className="hero__grid">
        <div className="hs-copy">
          <p className="eyebrow hs-eyebrow">
            <span className="eyebrow__dash" aria-hidden />
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="hs-line">
              <span>{hero.lines[0]}</span>
            </span>{" "}
            <span className="hs-line">
              <span>
                A Better Story<span className="dot">.</span>
              </span>
            </span>
          </h1>
          <p className="hero__body hs-body">{hero.body}</p>
          <div className="hero__ctas">
            <a href={hero.primary.href} className="btn-cta btn-cta--primary hs-cta-1">
              {hero.primary.label}
              <ArrowIcon className="btn-cta__arrow" />
            </a>
            <a href={hero.secondary.href} className="btn-cta btn-cta--ghost hs-cta-2">
              <PinIcon />
              {hero.secondary.label}
            </a>
          </div>
          <p className="hero__note hs-note">{hero.note}</p>
        </div>

        <div className="hero__stage">
          <ShowroomStage motion={motion} use3D={use3D} active={active} shadowRef={shadowRef} />
        </div>
      </div>
    </section>
  );
}
