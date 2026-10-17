// The orange light trail around the hero sneaker. Drawn twice with the same geometry:
// the back half sits behind the WebGL canvas and the front half in front of it, so the
// line truly wraps around the shoe. Coordinates use the scene's 1000 × 900 grid.

export const ORBIT = { cx: 545, cy: 372, rx: 300, ry: 76, tilt: -7 };

const { cx, cy, rx, ry, tilt } = ORBIT;
const d = `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`;

export default function OrangeOrbit({ part }: { part: "back" | "front" }) {
  const id = `orbit-${part}`;
  return (
    <svg className={`hs-orbit hs-orbit--${part}`} viewBox="0 0 1000 900" preserveAspectRatio="none" aria-hidden focusable="false">
      <defs>
        <clipPath id={`${id}-clip`} clipPathUnits="userSpaceOnUse">
          {part === "back" ? <rect x="0" y="0" width="1000" height={cy} /> : <rect x="0" y={cy} width="1000" height={900 - cy} />}
        </clipPath>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F47735" stopOpacity="0.15" />
          <stop offset="0.45" stopColor="#F47735" stopOpacity={part === "front" ? 1 : 0.6} />
          <stop offset="1" stopColor="#D9541E" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <g transform={`rotate(${tilt} ${cx} ${cy})`} clipPath={`url(#${id}-clip)`}>
        {/* soft luminous edge */}
        <path className="orbit-line orbit-glow" d={d} pathLength={1000} fill="none" stroke="#F47735" strokeWidth="7" strokeLinecap="round" />
        {/* the hairline itself */}
        <path className="orbit-line" d={d} pathLength={1000} fill="none" stroke={`url(#${id}-fade)`} strokeWidth="1.6" strokeLinecap="round" />
        {/* a short brighter segment that travels slowly around the loop */}
        <path className="orbit-comet" d={d} pathLength={1000} fill="none" stroke="#FFB48A" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="70 930" />
      </g>
    </svg>
  );
}
