import type { SiteMeta, Theme } from "@/lib/site";

// Settings for THIS site: Sri Hanuman Shoe Mart, Madhurawada, Visakhapatnam (concept).
// Look: cool daylight showroom (snow white + pale slate stone, one orange accent). Direction: site/DESIGN.md.

export const meta: SiteMeta = {
  name: "Sri Hanuman Shoe Mart",
  title: "Sri Hanuman Shoe Mart — Every Step. A Better Story.",
  description:
    "School shoes, sports footwear, everyday styles, sandals, slippers and school bags for the whole family. Madhurawada, Visakhapatnam.",
  loaderText: "Sri Hanuman",
  // No full-screen loader: the hero must look finished on the first frame, then plays its own intro.
  loader: false,
  record: { duration: 30 },
};

export const theme: Theme = {
  bg: "#F8FAFC",
  surface: "#EEF2F7",
  text: "#192338",
  muted: "#525D6E", // cool slate grey; passes 4.5:1 on the snow and frost backgrounds
  accent: "#F47735",
  accentText: "#FFFFFF",
  line: "rgba(100, 116, 139, 0.2)",
  fontDisplay: "'Bricolage Grotesque Variable', 'Helvetica Neue', Arial, sans-serif",
  fontBody: "'DM Sans Variable', 'Helvetica Neue', Arial, sans-serif",
  radius: 999,
  uppercaseHeadings: false,
  heroText: "#192338",
};
