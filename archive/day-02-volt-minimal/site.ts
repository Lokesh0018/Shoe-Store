import type { SiteMeta, Theme } from "@/lib/site";

// Settings for THIS site: Volt Runners, a (concept) performance sneaker brand from India.
// Theme: official minimal (light, black type, one family). Direction: site/DESIGN.md.

export const meta: SiteMeta = {
  name: "Volt Runners",
  title: "Volt Runners — Run loud.",
  description: "Performance running shoes built for Indian roads: carbon-plated racers, daily trainers and trail shoes. Drop 07 is live.",
  loaderText: "Volt Runners",
  loader: false, // site/components/RaceLoader.tsx replaces the engine loader
  // ?record=1 uses the section timeline (data-record-* attributes on the sections, docs/RECORDING.md)
};

export const theme: Theme = {
  bg: "#fafaf8",
  surface: "#f0f0ed",
  text: "#111111",
  muted: "#5d605c",
  accent: "#111111",
  accentText: "#ffffff",
  line: "#e2e2de",
  fontDisplay: "'Inter Variable', 'Helvetica Neue', Arial, sans-serif",
  fontBody: "'Inter Variable', 'Helvetica Neue', Arial, sans-serif",
  radius: 16,
  uppercaseHeadings: false,
  heroText: "#ffffff",
};
