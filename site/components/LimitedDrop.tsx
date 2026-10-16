import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { limited } from "../content";

/** Next opening (weekday + hour, device time). Every device with a synced clock gets the same moment. */
function nextOpening(day: number, hour: number) {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  d.setDate(d.getDate() + ((day - d.getDay() + 7) % 7));
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 7);
  return d.getTime();
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Days : hours : min : sec until the draw opens. Ticks on the real second, so two synced devices tick together. */
function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = nextOpening(limited.opensDay, limited.opensHour);
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      setLeft(Math.max(0, target - Date.now()));
      t = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    tick();
    return () => clearTimeout(t);
  }, []);
  if (left === null) return ["--", "--", "--", "--"];
  const s = Math.floor(left / 1000);
  return [pad(Math.floor(s / 86400)), pad(Math.floor(s / 3600) % 24), pad(Math.floor(s / 60) % 60), pad(s % 60)];
}

/**
 * The colour flip: a black rounded panel in the light page, white type.
 * Cut-out racer, live countdown to the draw, 500 numbered pairs, ₹ price.
 */
export default function LimitedDrop() {
  const parts = useCountdown();
  const labels = ["Days", "Hrs", "Min", "Sec"];

  return (
    <section
      id="limited"
      className="relative z-[1] py-[clamp(24px,4vw,56px)]"
      data-record-label="Limited drop (hold)"
      data-record-time="1.5"
      data-record-hold="2"
      data-record-align="center"
    >
      <div className="container-x">
        <div className="on-dark relative overflow-hidden rounded-[var(--r)] bg-[#0f0f0f] px-6 py-14 text-white md:px-12 md:py-20 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            {/* the shoe */}
            <div data-reveal className="relative order-2 lg:order-1">
              <p aria-hidden className="tnum absolute top-0 left-0 text-[14px] font-medium text-white/70">
                No. 001 / 500
              </p>
              <img
                src={limited.image}
                alt={`${limited.name.join(" ")}, limited edition racing shoe`}
                className="relative mx-auto w-[92%] -rotate-[6deg] object-contain md:drop-shadow-[0_40px_40px_rgba(0,0,0,.5)]"
                data-parallax="0.06"
              />
            </div>

            {/* the drop */}
            <div className="relative z-[1] order-1 lg:order-2">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1.5 text-[13px] font-medium">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-white" />
                {limited.eyebrow} · {limited.pairs}
              </p>
              <h2 className="font-display mt-6 text-[clamp(48px,5.6vw,100px)]">
                {limited.name.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </h2>
              <p className="mt-5 max-w-[440px] text-[16px] leading-relaxed text-white/75 md:text-[17px]">{limited.text}</p>

              <p className="mt-9 text-[14px] text-white/70">Draw opens in</p>
              <div className="mt-3 flex gap-2" aria-live="off">
                {parts.map((p, k) => (
                  <div key={labels[k]} className="flex w-[clamp(66px,5.6vw,88px)] flex-col items-center rounded-[var(--r-sm)] bg-white/[0.08] py-3">
                    <span className="font-display tnum text-[clamp(30px,2.8vw,44px)] leading-none">{p}</span>
                    <span className="mt-1.5 text-[12px] text-white/70">{labels[k]}</span>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
                <Button href="#limited" label={`${limited.cta} · ${limited.price}`} />
                <div className="text-[14px]">
                  <p>{limited.numbered}</p>
                  <p className="text-white/70">
                    <span className="tnum" data-count={limited.entries}>
                      {limited.entries.toLocaleString("en-US")}
                    </span>{" "}
                    runners entered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
