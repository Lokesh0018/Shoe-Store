import { useEffect, useRef, useState } from "react";
import { activeSection, installAnchorScroll } from "../navScroll";
import { brand, nav } from "@/site/content";
import { ChatIcon, ChevronDownIcon, CloseIcon, MenuIcon, PhoneIcon, PinIcon, StepsMark } from "@/site/components/Icons";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [active, setActive] = useState("#top");
  const [activeSub, setActiveSub] = useState("");
  const menuBtn = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // highlight: which nav item owns the part of the page under the nav (labs count as Collections)
    let raf = 0;
    const track = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { main, sub } = activeSection();
        setActive(main);
        setActiveSub(sub);
      });
    };
    track();
    window.addEventListener("scroll", track, { passive: true });
    window.addEventListener("resize", track);
    // in-page links land just under the nav (and work from the mobile menu)
    const uninstall = installAnchorScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", track);
      window.removeEventListener("resize", track);
      cancelAnimationFrame(raf);
      uninstall();
    };
  }, []);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onDocKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onDocKey);
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
              {nav.map((n) => {
                if (n.submenu) {
                  return (
                    <li
                      key={n.href}
                      ref={dropdownRef}
                      className="nav-dropdown"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div className="nav-dropdown__trigger-wrap">
                        <a
                          href={n.href}
                          className="nav-link"
                          aria-current={active === n.href ? "true" : undefined}
                          onClick={() => setDropdownOpen(false)}
                        >
                          {n.label}
                        </a>
                        <button
                          type="button"
                          className={`nav-dropdown__btn${dropdownOpen ? " is-open" : ""}`}
                          aria-expanded={dropdownOpen}
                          aria-haspopup="true"
                          aria-label="Toggle collections categories"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropdownOpen((prev) => !prev);
                          }}
                        >
                          <ChevronDownIcon width={14} height={14} />
                        </button>
                      </div>

                      <div
                        className={`nav-dropdown__menu${dropdownOpen ? " is-open" : ""}`}
                        role="menu"
                        aria-label="Collections sub-categories"
                      >
                        <div className="nav-dropdown__header">
                          <span className="nav-dropdown__label">Browse By Category</span>
                        </div>
                        <ul className="nav-dropdown__list">
                          {n.submenu.map((sub) => (
                            <li key={sub.href} role="none">
                              <a
                                href={sub.href}
                                role="menuitem"
                                aria-current={activeSub === sub.href ? "true" : undefined}
                                className="nav-dropdown__item"
                                onClick={() => setDropdownOpen(false)}
                              >
                                <span className="nav-dropdown__item-title">{sub.label}</span>
                                <span className="nav-dropdown__item-desc">{sub.desc}</span>
                              </a>
                            </li>
                          ))}
                          <li className="nav-dropdown__footer-link" role="none">
                            <a
                              href="#collections"
                              role="menuitem"
                              className="nav-dropdown__all"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <span>View All 8 Categories</span>
                              <span aria-hidden>→</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={n.href}>
                    <a href={n.href} className="nav-link" aria-current={active === n.href ? "true" : undefined}>
                      {n.label}
                    </a>
                  </li>
                );
              })}
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
        // any link inside the sheet (logo included) closes it; navScroll then does the scrolling
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
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
              {n.submenu && (
                <div className="m-menu__sub">
                  {n.submenu.map((sub) => (
                    <a
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setOpen(false)}
                      className="m-menu__sub-link"
                    >
                      <span className="m-menu__sub-bullet">•</span>
                      <span>{sub.label}</span>
                      <span className="m-menu__sub-desc">{sub.desc}</span>
                    </a>
                  ))}
                </div>
              )}
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
