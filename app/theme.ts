import { meta, theme } from "@/site/site";

// Reads site/site.ts and puts the colours/fonts on <html> as CSS variables (globals.css maps them to Tailwind).
export function applySite() {
  const t = theme;
  const isDark = (hex: string) => {
    const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
    return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 < 140;
  };
  const vars: Record<string, string> = {
    "--bg": t.bg,
    "--surface": t.surface,
    "--text": t.text,
    "--muted": t.muted,
    "--accent": t.accent,
    "--accent-text": t.accentText,
    "--line": t.line,
    "--hero-text": t.heroText ?? (isDark(t.bg) ? t.text : "#fbf8f3"),
    "--radius": `${t.radius ?? 0}px`,
    "--font-display-family": t.fontDisplay,
    "--font-body-family": t.fontBody,
    "--heading-case": t.uppercaseHeadings ? "uppercase" : "none",
    "--heading-tracking": t.uppercaseHeadings ? "0.04em" : "0.005em",
  };
  const root = document.documentElement;
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);

  document.title = meta.title;
  let desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!desc) {
    desc = document.createElement("meta");
    desc.name = "description";
    document.head.appendChild(desc);
  }
  desc.content = meta.description;

  // Set & force update favicon link
  let iconLink = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
  if (!iconLink) {
    iconLink = document.createElement("link");
    iconLink.rel = "icon";
    document.head.appendChild(iconLink);
  }
  iconLink.type = "image/svg+xml";
  iconLink.href = "/favicon.svg?v=" + Date.now();
}
