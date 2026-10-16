import { statement } from "../content";

/**
 * A quiet statement after the hero: three short words stepping from black to light grey,
 * one sentence, and the test cities as a plain line. No motion beyond the reveal.
 */
export default function Statement() {
  return (
    <section
      aria-label={statement.lines.join(" ")}
      data-record-label="Statement"
      data-record-time="1.5"
      data-record-align="center"
      className="section-y relative z-[1]"
    >
      <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
        <h2 data-reveal="stagger" className="font-display text-[clamp(56px,8.4vw,148px)]">
          {statement.lines.map((l, k) => (
            <span key={l} className="block" style={{ color: `color-mix(in srgb, var(--text) ${100 - k * 27}%, var(--bg))` }}>
              {l}
            </span>
          ))}
        </h2>
        <div data-reveal className="max-w-[420px] lg:pb-4">
          <p className="text-[18px] leading-relaxed text-fg md:text-[20px]">{statement.text}</p>
          <p className="mt-6 text-[14px] text-muted">{statement.cities.join("  ·  ")}</p>
        </div>
      </div>
    </section>
  );
}
