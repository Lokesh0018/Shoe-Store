import { prefersReducedMotion } from "@/lib/gsap";

/**
 * One mutable object shared by the GSAP timeline (writes) and the 3D render loop (reads).
 * Values are plain numbers so pointer moves and scroll never trigger React re-renders.
 */
export type HeroMotion = {
  /** 0 → 1 while the sneaker eases into place during the intro */
  enter: number;
  /** pointer position, -1…1 on each axis (0 = centre); always 0 on touch screens */
  px: number;
  py: number;
  /** 0 at the top of the page → 1 when the hero has scrolled away */
  scroll: number;
  /** false when the hero is off-screen: the render loop stops */
  visible: boolean;
  /** true = no ambient loops (prefers-reduced-motion or ?static=1) */
  still: boolean;
};

export function createHeroMotion(): HeroMotion {
  const still = prefersReducedMotion();
  return { enter: still ? 1 : 0, px: 0, py: 0, scroll: 0, visible: true, still };
}

/** Can this device draw the 3D sneaker? (WebGL present and not an obviously low-power phone.) */
export function canRender3D() {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).has("no3d")) return false;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return false;
  } catch {
    return false;
  }
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  const small = window.matchMedia("(max-width: 767px)").matches;
  // Phones with little memory or few cores get the still image instead
  if (small && ((nav.deviceMemory ?? 4) < 4 || (navigator.hardwareConcurrency ?? 4) < 4)) return false;
  return true;
}

export const finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
