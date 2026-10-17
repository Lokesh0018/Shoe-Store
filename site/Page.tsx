import HeroNav from "./components/hero/HeroNav";
import HeroSection from "./components/hero/HeroSection";
import AisleMarquee from "./components/AisleMarquee";
import Collections from "./components/Collections";
import { Brands, SiteFooter, Visit } from "./components/BrandsAndVisit";

const ICON = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none"><defs><linearGradient id="g" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="%23EA580C"/><stop offset="55%" stop-color="%23D9541E"/><stop offset="100%" stop-color="%23C2410C"/></linearGradient></defs><rect width="40" height="40" rx="12" fill="url(%23g)"/><path d="M8.5 27.5C11.2 27.5 13.8 26.9 17 26.1C21.2 25.1 24.5 25.8 28.2 26.5C30.2 26.9 31.8 26.2 32.5 24.6C32.9 23.6 32.4 22.4 31 22.2C28.8 21.9 26.5 21 24.5 19.8C22.2 18.5 20.2 16.5 18.6 14.8C17.5 13.7 16.1 13.5 15.2 14.5C14.1 15.7 13.2 17.5 12.8 19.3L9.6 20.8C8.5 21.3 7.8 22.4 8 23.6C8.2 25.1 8.2 27.5 8.5 27.5Z" fill="%23FFFFFF"/><path d="M8.8 25.2C12.5 25.2 16.2 24.4 20 23.4C24.4 22.3 27.8 23.2 31.5 24.5" stroke="%23D9541E" stroke-width="1.6" stroke-linecap="round"/><circle cx="28.8" cy="14.2" r="1.6" fill="%23F8FAFC"/><circle cx="32.5" cy="17.2" r="1.1" fill="%23F8FAFC" opacity="0.8"/></svg>'
)}`;

history.scrollRestoration = "manual";
if (/[?&]record/.test(location.search)) {
  const s = document.createElement("style");
  s.textContent = "*,*::before,*::after{cursor:none!important}html{scrollbar-width:none}html::-webkit-scrollbar{display:none}";
  document.head.appendChild(s);
}

/** Sri Hanuman Shoe Mart — cool daylight showroom. Plan + reasons: site/DESIGN.md. */
export default function Page() {
  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <HeroNav />
      <main id="main" tabIndex={-1} className="relative z-[1] overflow-x-clip outline-none">
        <HeroSection />
        <AisleMarquee />
        <Collections />
        <Brands />
        <Visit />
      </main>
      <SiteFooter />
    </>
  );
}
