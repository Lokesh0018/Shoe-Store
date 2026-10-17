// Line icons, one weight (1.6) on a 24 grid, drawn to match each other.
import type { SVGProps } from "react";

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  ...p,
});

export const PhoneIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 3.5h3l1.6 4-2 1.3a11 11 0 0 0 5.6 5.6l1.3-2 4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.7a2 2 0 0 1 2-2.2Z" />
  </svg>
);

export const ChatIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2.5 21.5Z" />
    <path d="M9.2 9.3c.3 1.9 1.6 3.3 3.6 4l1.1-.9 1.8.8-.4 1.4c-3.4.2-6.6-2.9-6.7-6.3l1.4-.4.8 1.8Z" strokeWidth={1.3} />
  </svg>
);

export const PinIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

export const ArrowIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
  </svg>
);

export const MenuIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);

export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ChevronDownIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/** Brand mark: Modern sleek sneaker silhouette + dynamic motion sweep for Sri Hanuman Shoe Mart. */
export const StepsMark = ({ width = 40, height = 40, className = "", ...p }: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    focusable={false}
    className={className}
    {...p}
  >
    <defs>
      <linearGradient id="shm-logo-bg" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EA580C" />
        <stop offset="55%" stopColor="#D9541E" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
      <linearGradient id="shm-logo-glow" x1="0" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="shm-shoe-accent" x1="8" y1="14" x2="32" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#FFEAD5" />
      </linearGradient>
    </defs>

    {/* Rounded Squircle Badge */}
    <rect width="40" height="40" rx="12" fill="url(#shm-logo-bg)" />
    <rect width="38" height="38" x="1" y="1" rx="11" stroke="url(#shm-logo-glow)" strokeWidth="1" />

    {/* Modern Athletic Shoe / Sneaker Silhouette & Speed Stripe */}
    <g transform="translate(0, 0.5)">
      {/* Sole / Cushion outline with sculpted curve */}
      <path
        d="M8.5 27.5C11.2 27.5 13.8 26.9 17 26.1C21.2 25.1 24.5 25.8 28.2 26.5C30.2 26.9 31.8 26.2 32.5 24.6C32.9 23.6 32.4 22.4 31 22.2C28.8 21.9 26.5 21 24.5 19.8C22.2 18.5 20.2 16.5 18.6 14.8C17.5 13.7 16.1 13.5 15.2 14.5C14.1 15.7 13.2 17.5 12.8 19.3L9.6 20.8C8.5 21.3 7.8 22.4 8 23.6C8.2 25.1 8.2 27.5 8.5 27.5Z"
        fill="url(#shm-shoe-accent)"
      />

      {/* Aerodynamic carve / mid-sole contrast stripe */}
      <path
        d="M8.8 25.2C12.5 25.2 16.2 24.4 20 23.4C24.4 22.3 27.8 23.2 31.5 24.5"
        stroke="#D9541E"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Dynamic speed lace / notch accents */}
      <path
        d="M17.5 16.8L19.8 19.4M20.2 18L22.5 20.6"
        stroke="#EA580C"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Forward momentum dots / steps in pace */}
      <circle cx="28.8" cy="14.2" r="1.5" fill="#FFF9F2" opacity="0.95" />
      <circle cx="32.5" cy="17.2" r="1.1" fill="#FFF9F2" opacity="0.75" />
    </g>
  </svg>
);
