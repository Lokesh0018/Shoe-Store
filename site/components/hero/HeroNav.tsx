import { useEffect, useRef, useState } from "react";
import { brand, nav } from "@/site/content";
import { ChatIcon, CloseIcon, MenuIcon, PhoneIcon, PinIcon, StepsMark } from "@/site/components/Icons";

function Logo() {
  return (
    <a href="#top" className="logo" aria-label="Sri Hanuman Shoe Mart, home">
      <StepsMark className="logo__mark" />
      <span className="logo__words" aria-hidden>
        <span className="logo__l1">{brand.name}</span>
        <span className="logo__l2">{brand.line2}</span>
      </span>
    </a>
  );
}

/** Transparent over the hero, lightly frosted once the page scrolls. Thin orange underline marks the section on screen. */
export default function HeroNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");
  const menuBtn = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const ids = nav.map((n) => n.href);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.querySelector(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  // Mobile menu: lock scroll, close on Escape, keep focus inside, return focus to the button.
  useEffect(() => {
    if (!open) return;
    const lenis = window.__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const first = sheet.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && sheet.current) {
        const f = Array.from(sheet.current.querySelectorAll<HTMLElement>("a,button"));
        const [a, z] = [f[0], f[f.length - 1]];
        if (e.shiftKey && document.activeElement === a) (e.preventDefault(), z.focus());
        else if (!e.shiftKey && document.activeElement === z) (e.preventDefault(), a.focus());
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
      menuBtn.current?.focus();
    };
  }, [open]);

  return (
    <>
    <header className={`site-nav hs-nav${solid ? " is-solid" : ""}`}>
      <div className="site-nav__inner">
        <Logo />

        <nav aria-label="Main" className="site-nav__links">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="nav-link" aria-current={active === n.href ? "true" : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-nav__actions">
          <div className="nav-phones">
            <PhoneIcon className="nav-phones__icon" />
            <span className="nav-phones__list">
              {brand.phones.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} aria-label={`Call ${p.label}`}>
                  {p.label}
                </a>
              ))}
            </span>
          </div>
          <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="pill pill--wa" aria-label="Chat on WhatsApp (opens WhatsApp)">
            <ChatIcon />
            <span className="pill__text">WhatsApp</span>
          </a>
          <a href="#contact" className="pill pill--visit">
            <PinIcon />
            <span>Visit Our Store</span>
          </a>
          <a href={`tel:${brand.phones[0].tel}`} className="icon-btn show-sm" aria-label={`Call ${brand.phones[0].label}`}>
            <PhoneIcon />
          </a>
          <button
            ref={menuBtn}
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>
    </header>

      <div
        id="mobile-menu"
        ref={sheet}
        className={`m-menu${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
      >
        <div className="m-menu__top">
          <Logo />
          <button type="button" className="icon-btn" onClick={() => setOpen(false)}>
            <CloseIcon />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <ul className="m-menu__links">
          {nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={() => setOpen(false)} aria-current={active === n.href ? "true" : undefined}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="m-menu__contact">
          {brand.phones.map((p) => (
            <a key={p.tel} href={`tel:${p.tel}`} className="m-menu__row">
              <PhoneIcon /> {p.label}
            </a>
          ))}
          <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-cta btn-cta--primary">
            <ChatIcon /> Chat on WhatsApp
          </a>
          <a href="#contact" onClick={() => setOpen(false)} className="btn-cta btn-cta--ghost">
            <PinIcon /> Find Our Store
          </a>
        </div>
      </div>
    </>
  );
}
