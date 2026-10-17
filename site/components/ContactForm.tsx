import { useState, type FormEvent } from "react";
import { brand, categories } from "@/site/content";
import { ChatIcon, PhoneIcon } from "./Icons";

/** wa.me wants the number without "+" or spaces */
const WA_NUMBER = brand.whatsapp.replace(/\D/g, "");

/** Only things that are true for the shop: WhatsApp number confirmed, offer printed on its card. */
const perks = ["Check size & colour before you come", "Message goes straight to our WhatsApp", "Show our card in store for 5–10% extra off"];

/**
 * Small enquiry form. There is no server: on submit it opens WhatsApp with the message already written,
 * so the customer just presses send. Nothing is stored by the site.
 */
const POPULAR_SIZES = ["6", "7", "8", "9", "10", "11"];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [looking, setLooking] = useState(categories[0].name);
  const [size, setSize] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name so we know who to reply to.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    const lines = [
      `Hi ${brand.name} ${brand.line2}, I'm ${name.trim()}.`,
      `Looking for: ${looking}${size.trim() ? ` (UK size ${size.trim()})` : ""}.`,
      msg.trim(),
    ].filter(Boolean);

    setTimeout(() => {
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
      setIsSubmitting(false);
    }, 250);
  };

  return (
    <section id="enquire" className="enq" aria-labelledby="enq-title">
      <div className="container-x">
        <div className="enq__panel" data-reveal>
          {/* Left panel: Store highlights, live response status, direct call option */}
          <div className="enq__intro">
            <div className="enq__intro-top">
              <div className="enq__intro-badge">
                <span className="enq__intro-dot" />
                <span>Live WhatsApp Counter · Online</span>
              </div>
              <span className="enq__intro-time">Open 9:30 AM – 9:30 PM</span>
            </div>

            <p className="eyebrow enq__eyebrow">
              <span className="eyebrow__dash" aria-hidden />
              Instant Footwear Enquiry
            </p>

            <h2 id="enq-title" className="enq__title">
              Check sizes & styles before you arrive.
            </h2>
            <p className="enq__lede">
              Save a trip by confirming required size & models in advance with live shelf checks and hold options.
            </p>

            {/* Feature cards for trust and quick perks */}
            <div className="enq__trust-cards">
              <div className="enq__trust-card">
                <div className="enq__trust-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="enq__trust-content">
                  <strong>Stock Hold Available</strong>
                  <span>Reserve your size while traveling to store</span>
                </div>
              </div>

              <div className="enq__trust-card">
                <div className="enq__trust-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <div className="enq__trust-content">
                  <strong>Cardholder Discount</strong>
                  <span>Show our visiting card for 5–10% off</span>
                </div>
              </div>

              <div className="enq__trust-card">
                <div className="enq__trust-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="enq__trust-content">
                  <strong>Fast Verification</strong>
                  <span>Replies under 15 mins during store hours</span>
                </div>
              </div>
            </div>

            {/* Direct voice calling block */}
            <div className="enq__alt-wrap">
              <span className="enq__alt-label">Or Call Store Directly:</span>
              <ul className="enq__alt">
                {brand.phones.map((p) => (
                  <li key={p.tel}>
                    <a href={`tel:${p.tel}`} aria-label={`Call store at ${p.label}`}>
                      <PhoneIcon width={15} height={15} />
                      <span className="enq__alt-num">{p.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right panel: Modernized interactive form with floating cards and chips */}
          <div className="enq__form-container">
            <header className="enq__form-header">
              <h3 className="enq__form-title">Send a Quick Message</h3>
              <p className="enq__form-subtitle">We will check live inventory immediately on WhatsApp.</p>
            </header>

            <form className="enq__form" onSubmit={submit} noValidate>
              <div className="enq__row">
                <label className="enq__field">
                  <span className="enq__field-label">
                    Your Full Name <span className="enq__required">*</span>
                  </span>
                  <div className="enq__input-wrap">
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="e.g. Ravi Kumar"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError("");
                      }}
                      aria-invalid={!!error}
                      aria-describedby={error ? "enq-error" : undefined}
                      required
                      className={error ? "is-invalid" : ""}
                    />
                  </div>
                </label>

                <div className="enq__field enq__field--sm">
                  <label htmlFor="custom-size-input" className="enq__field-label">
                    UK Size <em className="enq__optional">(optional)</em>
                  </label>
                  <div className="enq__input-wrap">
                    <input
                      id="custom-size-input"
                      type="text"
                      name="size"
                      inputMode="numeric"
                      placeholder="e.g. 8"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Quick size selection chips */}
              <div className="enq__quick-sizes">
                <span className="enq__quick-label">Popular UK Sizes:</span>
                <div className="enq__quick-pills">
                  {POPULAR_SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`enq__quick-btn${size === s ? " is-active" : ""}`}
                      onClick={() => setSize((prev) => (prev === s ? "" : s))}
                      aria-label={`Select UK size ${s}`}
                    >
                      UK {s}
                    </button>
                  ))}
                  {size && (
                    <button
                      type="button"
                      className="enq__quick-clear"
                      onClick={() => setSize("")}
                      title="Clear size"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Category radio chips with visual feedback */}
              <fieldset className="enq__field">
                <legend className="enq__field-label">
                  Category Interested In <span className="enq__required">*</span>
                </legend>
                <div className="enq__chips">
                  {categories.map((c) => (
                    <label key={c.name} className="enq__chip">
                      <input
                        type="radio"
                        name="looking"
                        value={c.name}
                        checked={looking === c.name}
                        onChange={() => setLooking(c.name)}
                      />
                      <span className="enq__chip-inner">
                        <span className="enq__chip-dot" />
                        {c.name}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="enq__field">
                <span className="enq__field-label">
                  Additional Details or Questions <em className="enq__optional">(optional)</em>
                </span>
                <textarea
                  name="message"
                  rows={2}
                  placeholder="Ask about specific colors, brand preference, stock, or school shoes..."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
              </label>

              {error && (
                <div id="enq-error" className="enq__error-banner" role="alert">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="enq__foot">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-cta btn-cta--primary enq__send"
                  aria-label="Send inquiry on WhatsApp"
                >
                  <ChatIcon width={18} height={18} />
                  <span>{isSubmitting ? "Opening WhatsApp..." : "Send via WhatsApp"}</span>
                </button>
                <div className="enq__security-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>100% Free · No spam · Instant direct chat</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
