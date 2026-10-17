/**
 * In-page link scrolling for this site, with the fixed nav accounted for.
 *
 * The engine's SmoothScroll also handles "#" links, but it scrolls the section's top edge to the very top of
 * the screen (under the 84px nav). This listener works out a better landing spot per section and stops the click
 * before the engine's handler sees it. Engine code is untouched.
 */

const navH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 84;
/** Page position from layout (offsetTop chain), so reveal animations that shift an element don't skew it. */
const absTop = (el: Element) => {
  let y = 0;
  for (let n = el as HTMLElement | null; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
  return y;
};

/** Where the page should stop for a given target element. */
export function landingY(el: HTMLElement): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  let y: number;
  if (el.id === "top") y = 0;
  // pinned labs lay themselves out under the nav: start exactly at the pin so step 1 is on screen
  else if (el.classList.contains("lab")) y = absTop(el);
  else {
    // land with the section's eyebrow/heading just under the nav (skips big top padding)
    const head = el.tagName === "SECTION" ? el.querySelector<HTMLElement>(".eyebrow, h2") : null;
    const headTop = head ? absTop(head) : NaN;
    y = head && headTop - absTop(el) < 320 ? headTop - navH() - 36 : absTop(el) - navH() - 20;
  }
  return Math.max(0, Math.min(max, Math.round(y)));
}

export function goTo(hash: string) {
  const el = hash === "#top" ? document.getElementById("top") : document.querySelector<HTMLElement>(hash);
  if (!el) return false;
  const run = () => {
    const y = landingY(el);
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.4, force: true });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };
  // the mobile menu locks scrolling while open; wait one tick for it to close and unlock
  if (document.documentElement.style.overflow === "hidden") setTimeout(run, 60);
  else run();
  return true;
}

/**
 * Take over every same-page "#" link. Returns a cleanup.
 * Listens on React's root in the bubble phase: React's own onClick handlers (e.g. closing the mobile menu) run
 * first, then this scrolls and stops the click before it reaches the engine's listener on `document`.
 */
export function installAnchorScroll() {
  const host = document.getElementById("root") ?? document.body;
  const onClick = (e: MouseEvent) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#']");
    const hash = a?.getAttribute("href");
    if (!a || !hash || hash === "#") return;
    if (a.classList.contains("skip-link")) return; // keep the keyboard skip link's native focus jump
    if (goTo(hash)) {
      e.preventDefault();
      e.stopPropagation(); // the engine's document listener must not scroll a second time
    }
  };
  host.addEventListener("click", onClick);
  return () => host.removeEventListener("click", onClick);
}

/**
 * Which nav item owns the part of the page under the nav. A section "starts" when its top passes a line a third
 * of the way down the screen. Collections owns the three labs too (its dropdown points at them).
 */
const OWNERS: [href: string, startId: string][] = [
  ["#top", "top"],
  ["#collections", "lab"],
  ["#brands", "brands"],
  ["#about", "about"],
  ["#enquire", "enquire"],
];
const SUBS: [href: string, startId: string][] = [
  ["#lab", "lab"],
  ["#slippers", "slippers"],
  ["#bags", "bags"],
  ["#collections", "collections"],
];

function owner(list: [string, string][], probe: number) {
  let current = "";
  for (const [href, id] of list) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= probe) current = href;
  }
  return current;
}

export function activeSection() {
  const probe = navH() + window.innerHeight * 0.33;
  const main = owner(OWNERS, probe) || "#top";
  const sub = main === "#collections" ? owner(SUBS, probe) : "";
  return { main, sub };
}
