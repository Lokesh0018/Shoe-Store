import { lazy, Suspense, useCallback, useEffect, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { heroSneaker, plant, products } from "@/site/content";
import OrangeOrbit from "./OrangeOrbit";
import type { HeroMotion } from "./heroMotion";

const loadCanvas = () => import("./SneakerCanvas");
const SneakerCanvas = lazy(loadCanvas);

/** When the WebGL sneaker mounts: after the intro has played (the matching still image plays it),
 *  so shader compilation never stalls the entrance. Immediately when there is no intro. */
const MOUNT_3D_AFTER_MS = 2300;

/*
 * The showroom is laid out on a 1000 × 900 grid (x, y in grid units) inside a box that keeps
 * that aspect ratio and is a CSS size container, so 1 grid unit = 0.1cqw at every screen size.
 * Layers (back → front): architecture · shelves · orbit back · sneaker canvas · orbit front ·
 * mid pedestals · front plinths. Each layer drifts by its own depth with the pointer.
 */

type P = { x: number; y: number };
const pos = ({ x, y }: P): CSSProperties => ({ left: `${x / 10}%`, top: `${y / 9}%` });
/** Anchor an element's bottom edge on y (so images of any height stand on their base). */
const base = ({ x, y }: P): CSSProperties => ({ left: `${x / 10}%`, bottom: `${(900 - y) / 9}%` });

function Pedestal({ x, y, w, h, kind = "cyl", glow, hideSm }: P & { w: number; h: number; kind?: "cyl" | "block" | "disc"; glow?: boolean; hideSm?: boolean }) {
  return (
    <div
      className={`ped ped--${kind} hs-ped${hideSm ? " hide-sm" : ""}`}
      style={{ ...pos({ x, y }), ["--w" as string]: w, ["--h" as string]: h }}
      aria-hidden
    >
      <div className="ped__body" />
      <div className="ped__top" />
      {glow && <div className="ped__glow" />}
    </div>
  );
}

type Prod = (typeof products)[keyof typeof products];

/** A cut-out product standing with its base on (x, y). */
function Product({ item, x, y, w, flip, hideSm, tone }: P & { item: Prod; w: number; flip?: boolean; hideSm?: boolean; tone?: "shelf" }) {
  return (
    <figure className={`prod hs-prod${hideSm ? " hide-sm" : ""}${tone === "shelf" ? " prod--shelf" : ""}`} style={{ ...base({ x, y }), ["--w" as string]: w }}>
      <img
        src={item.src}
        alt={item.alt}
        width={item.w}
        height={item.h}
        loading="eager"
        decoding="async"
        draggable={false}
        style={flip ? { transform: "scaleX(-1)" } : undefined}
      />
    </figure>
  );
}

function Layer({ depth, className = "", children }: { depth: number; className?: string; children: ReactNode }) {
  return (
    <div className={`hs-layer ${className}`} data-depth={depth}>
      {children}
    </div>
  );
}

type Props = {
  motion: HeroMotion;
  use3D: boolean;
  active: boolean;
  shadowRef: RefObject<HTMLDivElement | null>;
};

export default function ShowroomStage({ motion, use3D, active, shadowRef }: Props) {
  // "loading" → the still image shows; "ready" → the canvas fades in over it; "failed" → still image stays
  const [model, setModel] = useState<"loading" | "ready" | "failed">(use3D ? "loading" : "failed");
  const onReady = useCallback(() => setModel((m) => (m === "failed" ? m : "ready")), []);
  const onError = useCallback(() => setModel("failed"), []);
  const [mount3D, setMount3D] = useState(false);

  useEffect(() => {
    if (!use3D) return;
    loadCanvas(); // fetch the 3D code + model now, in parallel with the intro
    const idle = (fn: () => void) => ("requestIdleCallback" in window ? window.requestIdleCallback(fn, { timeout: 800 }) : setTimeout(fn, 0));
    const t = setTimeout(() => idle(() => setMount3D(true)), motion.still ? 0 : MOUNT_3D_AFTER_MS);
    return () => clearTimeout(t);
  }, [use3D, motion]);

  return (
    <div className="hs-scene" data-model={model}>
      {/* ARCHITECTURE */}
      <Layer depth={0.25} className="hs-arch-layer">
        <div className="hs-floor" aria-hidden />
        <div className="arch arch--side hs-arch" style={{ left: "3.5%", top: `${190 / 9}%`, width: "23%", height: `${410 / 9}%` }} aria-hidden>
          <span className="arch__led" />
        </div>
        <div className="arch arch--main hs-arch" style={{ left: "32%", top: `${30 / 9}%`, width: "45%", height: `${570 / 9}%` }} aria-hidden>
          <span className="arch__led" />
          <span className="arch__warm" />
        </div>
        <div className="niche hs-arch hide-sm" style={{ left: "82%", top: `${150 / 9}%`, width: "24%", height: `${450 / 9}%` }} aria-hidden />
      </Layer>

      {/* SHELVES (back row) */}
      <Layer depth={0.4} className="hs-shelf-layer">
        <div className="shelf hs-arch hide-sm" style={{ left: "5.5%", top: `${360 / 9}%`, width: "19%" }} aria-hidden />
        <div className="shelf hs-arch hide-sm" style={{ left: "5.5%", top: `${485 / 9}%`, width: "19%" }} aria-hidden />
        <div className="shelf hs-arch hide-sm" style={{ left: "83.5%", top: `${445 / 9}%`, width: "20%" }} aria-hidden />
        <Product item={products.athleticNavy} x={150} y={362} w={150} tone="shelf" hideSm />
        <Product item={products.schoolWhite} x={150} y={487} w={140} tone="shelf" flip hideSm />
        <Product item={products.bagTote} x={918} y={447} w={98} tone="shelf" hideSm />
        {/* olive tree in a travertine pot, standing between the arches */}
        <figure className="prod prod--plant hs-prod hide-sm" style={{ ...base({ x: 296, y: 616 }), ["--w" as string]: 108 }} aria-hidden>
          <img src={plant.src} alt="" width={plant.w} height={plant.h} decoding="async" draggable={false} />
        </figure>
      </Layer>

      {/* HERO: pedestal, orbit, sneaker */}
      <Layer depth={0.6} className="hs-hero-layer">
        <Pedestal x={545} y={585} w={300} h={175} glow />
        <div ref={shadowRef} className="sneaker-shadow" style={pos({ x: 545, y: 585 })} aria-hidden />
        <OrangeOrbit part="back" />
        <div className="sneaker" aria-hidden={model === "ready" ? undefined : true}>
          {/* The still image is always in the DOM first, so the hero is complete before WebGL loads. */}
          <img
            className="sneaker__still"
            src={heroSneaker.fallback}
            alt={model === "ready" ? "" : heroSneaker.alt}
            width={813}
            height={896}
            fetchPriority="high"
            decoding="async"
          />
          {use3D && mount3D && model !== "failed" && (
            <div className="sneaker__canvas">
              <Suspense fallback={null}>
                <SneakerCanvas motion={motion} shadow={shadowRef} active={active} onReady={onReady} onError={onError} />
              </Suspense>
            </div>
          )}
          {model === "ready" && <span className="sr-only">{heroSneaker.alt}</span>}
        </div>
        <OrangeOrbit part="front" />
      </Layer>

      {/* MID ROW */}
      <Layer depth={0.8} className="hs-mid-layer">
        <Pedestal x={170} y={640} w={220} h={120} kind="block" />
        <Product item={products.schoolBlack} x={170} y={652} w={175} />
        <Pedestal x={872} y={655} w={200} h={125} hideSm />
        <Product item={products.formalBrown} x={872} y={664} w={185} hideSm />
      </Layer>

      {/* FRONT ROW */}
      <Layer depth={1} className="hs-front-layer">
        <Pedestal x={235} y={838} w={330} h={40} kind="disc" />
        <Product item={products.bagRed} x={175} y={848} w={112} />
        <Product item={products.bagPink} x={300} y={846} w={108} />
        <Pedestal x={700} y={842} w={330} h={36} kind="disc" />
        <Product item={products.sandalBrown} x={630} y={852} w={140} />
        <Product item={products.flipflop} x={775} y={850} w={118} />
      </Layer>
    </div>
  );
}
