import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onReveal } from "./IntroLoader";
import { nav } from "../content";

/** Tell the nav a pair went into the bag (the size picker's demo does this). */
export const addToBag = () => window.dispatchEvent(new Event("volt:bag"));

const NOTICE_MS = 3500;

const Icon = ({ d }: { d: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d={d} />
  </svg>
);
/** The brand mark: a small bolt. */
export const Bolt = ({ className = "h-[0.7em] w-auto" }: { className?: string }) => (
  <svg viewBox="0 0 10 14" className={className} aria-hidden>
    <path d="M7 0 0 8h4.2L3 14l7-8.2H5.8L7 0Z" fill="currentColor" />
  </svg>
);
const Logo = () => (
  <span className="flex items-center gap-1.5 text-[22px] font-semibold tracking-[-0.04em]">
    <Bolt />
    {nav.logo.charAt(0) + nav.logo.slice(1).toLowerCase()}
  </span>
);

const SEARCH = "M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM15.5 15.5 21 21";
const BAG = "M5 8h14l-1.2 12H6.2L5 8Zm4 0V6a3 3 0 0 1 6 0v2";

/** Announcement line (one offer at a time, rotating) + a white shop bar: wordmark · links · search · bag. */
export default function DropNav() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [bag, setBag] = useState(0);
  const [bump, setBump] = useState(0);
  const [notice, setNotice] = useState(0);
  const [active, setActive] = useState("");
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const offIntro = onReveal(() => {
      if (!prefersReducedMotion()) gsap.from(ref.current, { opacity: 0, y: -12, duration: 0.8, delay: 0.3, ease: "power3.out" });
    });
    const onBag = () => {
      setBag((n) => n + 1);
      setBump((n) => n + 1);
    };
    window.addEventListener("volt:bag", onBag);
    const still = prefersReducedMotion() || document.documentElement.classList.contains("is-static");
    const t = still ? undefined : setInterval(() => setNotice((k) => (k + 1) % nav.ticker.length), NOTICE_MS);
    return () => {
      offIntro();
      window.removeEventListener("volt:bag", onBag);
      clearInterval(t);
    };
  }, []);

  // scrollspy: the link of the section in the middle of the screen is marked current
  useEffect(() => {
    const els = nav.links.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onTop = () => window.scrollY < window.innerHeight * 0.5 && setActive("");
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, []);

  // menu: Esc closes it, focus moves into it when it opens
  useEffect(() => {
    if (!open) return;
    sheet.current?.querySelector<HTMLElement>("nav a")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) window.__lenis?.stop();
    else if (wasOpen.current) window.__lenis?.start();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <header ref={ref} className="fixed inset-x-0 top-0 z-50">
        {/* Announcement */}
        <div className="flex h-7 items-center justify-center overflow-hidden bg-surface text-[12px] font-medium text-fg md:h-8 md:text-[13px]" aria-label={nav.ticker.join(" · ")}>
          <p key={notice} className="notice-in" aria-hidden>
            {nav.ticker[notice]}
          </p>
        </div>

        {/* Shop bar */}
        <div className="border-b border-line bg-bg/95 md:bg-bg/85 md:backdrop-blur-md">
          <div className="container-x grid h-14 grid-cols-[1fr_auto] items-center md:h-16 lg:grid-cols-[1fr_auto_1fr]">
            <a href="#" aria-label="Volt Runners, home" className="justify-self-start">
              <Logo />
            </a>
            <nav className="hidden items-center gap-8 lg:flex">
              {nav.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  aria-current={active === l.href ? "location" : undefined}
                  className={`relative py-2 text-[14px] font-medium transition-colors duration-200 hover:text-fg ${active === l.href ? "text-fg" : "text-fg/70"}`}
                >
                  {l.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-px h-px origin-center bg-fg transition-transform duration-300"
                    style={{ transform: `scaleX(${active === l.href ? 1 : 0})` }}
                  />
                </a>
              ))}
            </nav>
            <div className="flex items-center justify-self-end gap-1 md:gap-2">
              <button aria-label="Search" className="hidden h-11 w-11 cursor-pointer place-items-center rounded-full transition-colors hover:bg-surface md:grid">
                <Icon d={SEARCH} />
              </button>
              <a href="#drop" aria-label={`Bag, ${bag} items`} className="relative grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-surface">
                <Icon d={BAG} />
                <span
                  key={bump}
                  className={`tnum absolute top-0.5 right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[11px] leading-none font-semibold transition-opacity ${
                    bag ? "bg-fg text-bg opacity-100" : "opacity-0"
                  } ${bump ? "bag-bump" : ""}`}
                >
                  {bag}
                </span>
              </a>
              <button onClick={() => setOpen(true)} aria-expanded={open} aria-controls="menu" className="ml-1 h-11 cursor-pointer rounded-full px-3 text-[14px] font-medium transition-colors hover:bg-surface lg:hidden">
                Menu
              </button>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div ref={sheet} id="menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[70] flex flex-col bg-bg">
          <div className="container-x flex h-[84px] items-center justify-between border-b border-line">
            <Logo />
            <button onClick={() => setOpen(false)} className="h-11 cursor-pointer rounded-full px-3 text-[14px] font-medium hover:bg-surface">
              Close
            </button>
          </div>
          <nav className="container-x flex flex-1 flex-col justify-center">
            {nav.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={active === l.href ? "location" : undefined}
                className={`font-display flex items-center justify-between border-b border-line py-5 text-[40px] ${active === l.href ? "" : "text-fg/80"}`}
              >
                {l.label}
                {active === l.href && <span className="h-2 w-2 rounded-full bg-fg" aria-hidden />}
              </a>
            ))}
          </nav>
          <p className="container-x pb-8 text-[13px] text-muted">{nav.ticker[1]}</p>
        </div>
      )}
    </>
  );
}
