import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onSiteReady } from "@/lib/loading";
import { Bolt } from "./DropNav";
import { footer } from "../content";

/** WordmarkFooter, official minimal: newsletter + link columns, then a full-width "Volt" that darkens from grey to black as the footer scrolls in. */
export default function VoltFooter() {
  const root = useRef<HTMLElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const word = footer.word.charAt(0) + footer.word.slice(1).toLowerCase();
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let tween: gsap.core.Tween | undefined;
    const off = onSiteReady(() => {
      tween = gsap.fromTo(
        fill.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", ease: "none", scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom bottom", scrub: true } },
      );
    });
    return () => {
      off();
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <footer
      ref={root}
      className="relative z-[1] overflow-hidden border-t border-line pt-[clamp(48px,6vw,88px)]"
      data-record-label="Footer"
      data-record-time="1"
      data-record-hold="1"
      data-record-align="bottom"
    >
      <div className="container-x grid gap-10 lg:grid-cols-[1.2fr_2fr] lg:gap-12">
        <div>
          <p className="font-display text-[clamp(28px,2.4vw,40px)]">{footer.newsletter.title}</p>
          <p className="mt-3 max-w-[360px] text-[15px] text-muted">{footer.newsletter.text}</p>
          <form
            noValidate
            className="mt-7 flex max-w-[420px] items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem("mail") as HTMLInputElement;
              if (!input.value.trim() || !input.validity.valid) {
                setError("Enter a valid email, like name@example.com");
                input.focus();
                return;
              }
              setError("");
              setJoined(true);
            }}
          >
            <label className="sr-only" htmlFor="mail">
              Email
            </label>
            <input
              id="mail"
              name="mail"
              type="email"
              autoComplete="email"
              disabled={joined}
              aria-invalid={!!error}
              aria-describedby="mail-msg"
              onInput={() => error && setError("")}
              placeholder={footer.newsletter.placeholder}
              className={`letter-input flex-1 py-3 text-[16px] disabled:opacity-60 ${error ? "!border-[#c92a2a]" : ""}`}
            />
            <button type="submit" disabled={joined} className="btn btn-solid cursor-pointer !px-5 !py-3 disabled:cursor-default">
              {joined ? "Subscribed" : "Subscribe"}
            </button>
          </form>
          <p id="mail-msg" aria-live="polite" className={`mt-3 min-h-5 text-[14px] ${error ? "text-[#c92a2a]" : "text-muted"}`}>
            {error || (joined ? "Thanks. See you at 5 AM on Sunday." : "")}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {footer.columns.map((c) => (
            <div key={c.title}>
              <p className="text-[14px] font-medium">{c.title}</p>
              <ul className="mt-3 space-y-2 md:mt-4 md:space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[14px] text-muted transition-colors duration-200 hover:text-fg md:text-[15px]">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* the wordmark */}
      <div aria-hidden className="container-x relative mt-12 select-none lg:mt-16">
        <p className="font-display relative text-[clamp(120px,48vw,720px)] leading-[0.78] tracking-[-0.06em]">
          <span className="text-fg/[0.07]">{word}</span>
          <span ref={fill} className="absolute inset-0 text-fg">
            {word}
          </span>
        </p>
      </div>

      <div className="container-x mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line py-5 text-[13px] text-muted">
        <p className="flex items-center gap-2">
          <Bolt className="h-3.5 w-auto text-fg" />© 2026 Volt Runners (concept)
        </p>
        <p>{footer.note}</p>
      </div>
    </footer>
  );
}
