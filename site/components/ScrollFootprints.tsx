import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

/**
 * Scroll-driven footprint trail from the top of #collections down to the footer.
 *
 * One winding path is laid out in page pixels (it swings between the left and right margins so it
 * rarely sits on text). A "walker" line sits at 72% of the viewport: every print above it is
 * stepped in, prints further up fade away, so scrolling down lays the trail step by step towards
 * the footer and scrolling up picks it back up. Drawn as one faint, multiply-blended layer over
 * the sections (so it shows on every background) with pointer-events off.
 * With ?static=1 / reduced motion the whole trail shows as still, faint prints.
 */

const STEP = 66; // px between prints along the path
const SIDE = 13; // px each foot sits off the walking line
const WALKER = 0.72; // walker line, as a fraction of the viewport height
const PRESS = 36; // px over which a print presses in once the walker passes it
const KEEP = 0.85; // viewport heights a print stays fully visible behind the walker
const FADE = 0.5; // viewport heights it then takes to fade

type Print = { x: number; y: number; ang: number; left: boolean };

/** Lay prints along a meandering path covering a w × h box. */
function layout(w: number, h: number, vh: number): Print[] {
  const amp = w * (w < 768 ? 0.4 : 0.44);
  const period = Math.max(1400, vh * 2.2);
  const xAt = (y: number) => w / 2 + amp * Math.sin((2 * Math.PI * y) / period - Math.PI / 2.4);

  const prints: Print[] = [];
  let prev = { x: xAt(0), y: 0 };
  let acc = 0;
  let i = 0;
  for (let y = 1; y <= h; y += 1) {
    const cur = { x: xAt(y), y };
    acc += Math.hypot(cur.x - prev.x, cur.y - prev.y);
    if (acc >= STEP) {
      acc = 0;
      const dx = cur.x - prev.x;
      const dy = cur.y - prev.y;
      const heading = Math.atan2(dy, dx); // direction of travel
      const left = i % 2 === 0;
      // left foot to the walker's left: for a downward walker that is +90° from the heading
      const side = (left ? 1 : -1) * SIDE;
      prints.push({
        x: cur.x + Math.cos(heading + Math.PI / 2) * side,
        y: cur.y + Math.sin(heading + Math.PI / 2) * side,
        ang: (heading * 180) / Math.PI + 90, // svg toe points up (-y)
        left,
      });
      i += 1;
    }
    prev = cur;
  }
  return prints;
}

function Sole() {
  return (
    <svg viewBox="0 0 24 56" aria-hidden="true">
      <path
        mask="url(#spt-tread)"
        d="M12 1c6.2 0 10 6.2 10 15 0 6-2 10-3 14-.9 3.8-.2 7.6-.2 11.6C18.8 49 16 55 12 55s-7-6-6.8-13.4c0-4 .7-7.8-.2-11.6C4 26 2 22 2 16 2 7.2 5.8 1 12 1z"
      />
    </svg>
  );
}

export default function ScrollFootprints() {
  const root = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLSpanElement | null)[]>([]);
  const [prints, setPrints] = useState<Print[]>([]);
  const [box, setBox] = useState({ top: 0, height: 0 });
  const [still, setStill] = useState(false);
  const boxRef = useRef(box);
  boxRef.current = box;
  const printsRef = useRef(prints);
  printsRef.current = prints;

  useEffect(() => setStill(prefersReducedMotion()), []);

  // Measure the span from #collections to the end of <main>, and lay the path out to fit it.
  const measure = useCallback(() => {
    const el = root.current;
    const main = el?.parentElement;
    const start = document.getElementById("collections");
    if (!el || !main || !start) return;
    const mainTop = main.getBoundingClientRect().top + window.scrollY;
    const top = start.getBoundingClientRect().top + window.scrollY - mainTop;
    const height = Math.max(0, main.scrollHeight - top);
    if (Math.abs(top - boxRef.current.top) < 2 && Math.abs(height - boxRef.current.height) < 2 && printsRef.current.length) return;
    setBox({ top, height });
    setPrints(layout(main.clientWidth, height, window.innerHeight));
  }, []);

  useEffect(() => {
    measure();
    const main = root.current?.parentElement;
    const ro = new ResizeObserver(() => measure());
    if (main) ro.observe(main);
    ScrollTrigger.addEventListener("refresh", measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      ScrollTrigger.removeEventListener("refresh", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Scroll → which prints are stepped in, and how faded the older ones are.
  useEffect(() => {
    if (still || !prints.length) return;
    let mainTop = 0;
    const update = () => {
      const el = root.current;
      if (!el) return;
      mainTop = el.getBoundingClientRect().top + window.scrollY; // layer's page top
      const vh = window.innerHeight;
      const walker = window.scrollY + vh * WALKER - mainTop; // walker line in layer px
      const keep = vh * KEEP;
      const fade = vh * FADE;
      for (let i = 0; i < prints.length; i++) {
        const node = els.current[i];
        if (!node) continue;
        const behind = walker - prints[i].y; // >0 once the walker has passed this print
        let o = 0;
        let s = 1.2;
        if (behind > 0) {
          const press = Math.min(1, behind / PRESS);
          const age = Math.max(0, behind - keep) / fade;
          o = press * Math.max(0, 1 - age);
          s = 1.2 - 0.2 * press;
        }
        const prevO = node.dataset.o;
        const next = o.toFixed(3);
        if (prevO === next) continue; // untouched prints cost nothing
        node.dataset.o = next;
        node.style.opacity = next;
        node.style.setProperty("--s", s.toFixed(3));
      }
    };
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update, onRefresh: update });
    update();
    return () => st.kill();
  }, [prints, still]);

  return (
    <div
      ref={root}
      className={`spt${still ? " spt--still" : ""}`}
      style={{ top: box.top, height: box.height }}
      aria-hidden="true"
    >
      {/* one shared tread mask: forefoot bars, heel bars */}
      <svg className="spt__defs" width="0" height="0" aria-hidden="true">
        <defs>
          <mask id="spt-tread" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="56">
            <rect width="24" height="56" fill="#fff" />
            <path
              d="M6 9h12M4.4 13.4h15.2M4 17.8h16M4.6 22.2h14.8M6 26.6h12M8.4 39h7.2M7.6 43.4h8.8M7.8 47.8h8.4"
              stroke="#000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </mask>
        </defs>
      </svg>
      {prints.map((p, i) => (
        <span
          key={i}
          ref={(n) => void (els.current[i] = n)}
          className={`spt__print${p.left ? " spt__print--l" : ""}`}
          style={{ left: p.x, top: p.y, transform: `translate(-50%, -50%) rotate(${p.ang}deg)` }}
        >
          <Sole />
        </span>
      ))}
    </div>
  );
}
