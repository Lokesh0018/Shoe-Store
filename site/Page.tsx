import IntroLoader from "./components/IntroLoader";
import DropNav from "./components/DropNav";
import StoreHero from "./components/StoreHero";
import Statement from "./components/Statement";
import ColourLab from "./components/ColourLab";
import DropRail from "./components/DropRail";
import SizeLab from "./components/SizeLab";
import TechStack from "./components/TechStack";
import CollectionStrips from "./components/CollectionStrips";
import LimitedDrop from "./components/LimitedDrop";
import RunClub from "./components/RunClub";
import VoltFooter from "./components/VoltFooter";
import { meta } from "./site";

const ICON = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#111"/><path d="M19 5 9 18h6.5l-2 9 10-13h-6.5l2-9Z" fill="#fff"/></svg>',
)}`;

// Runs once, before the first render: never restore the old scroll position on reload,
// and with ?record=1 hide the mouse arrow + scrollbar from the very first frame.
history.scrollRestoration = "manual";
if (/[?&]record/.test(location.search)) {
  const s = document.createElement("style");
  s.textContent = "*,*::before,*::after{cursor:none!important}html{scrollbar-width:none}html::-webkit-scrollbar{display:none}";
  document.head.appendChild(s);
}

/** Volt Runners, official minimal. Plan + reasons: site/DESIGN.md. */
export default function Page() {
  return (
    <>
      <link rel="icon" type="image/svg+xml" href={ICON} />
      <a href="#main" className="sr-only z-[90] rounded-full bg-fg px-5 py-3 text-[14px] font-medium text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <IntroLoader name={meta.loaderText ?? meta.name} />
      <DropNav />
      <main id="main" tabIndex={-1} className="relative z-[1] overflow-x-clip outline-none">
        <StoreHero />
        <Statement />
        <ColourLab />
        <DropRail />
        <SizeLab />
        <TechStack />
        <CollectionStrips />
        <LimitedDrop />
        <RunClub />
      </main>
      <VoltFooter />
    </>
  );
}
