# Design direction: Volt Runners, official minimal (Day 2, redesign)

**Brief (redesign):** same brand, products, sections and record timeline as Day 2, re-themed to look like an **official brand store, minimal**. The loud neon version ("a night race in the city": lime on black, slanted Anton, rain and streaks) is saved in `archive/day-02-volt-neon` (and the older copy in `archive/day-02-volt`).

**The idea in one line:** *the brand's own flagship store.* Near-white paper, black type, one family, hairlines and soft corners. The product photos and the colourways bring the colour; the UI never does.

## Choices

| | Choice | Why |
|---|---|---|
| Look | **Official minimal** (Swiss / flagship store) | The ask: official, minimal. Lots of whitespace, nothing decorative |
| Palette | bg `#fafaf8` · surface `#f0f0ed` · text `#111111` · muted `#5d605c` (≈6:1 on bg) · line `#e2e2de` · accent = black, text on accent white | Black is the only UI accent; colour comes from the shoes |
| Type | **Inter Variable only**: headings 600, −0.04em tracking, sentence case; body 400/500; tabular numbers for prices/sizes/countdown | One Swiss family reads "official". Already installed |
| Shape | Straight sections, 16 px corners on cards/images (12 on phones), 10 px on size buttons, pill buttons | Soft and calm instead of slanted and cut |
| Nav | Announcement line (one offer at a time, rotating every 3.5 s) + white bar: wordmark left · links centred · search + bag right | Standard flagship-store nav |
| Hero | Full-bleed photo with a very slow zoom, bottom shade, "Run loud." bottom-left, white pill buttons, product + price bottom-right | No rain/streaks/glow: one photo, one line |
| Cards | Product on a soft grey tile, details below on the page (name, kind, price, specs, colour dots). Hot card: shoe lifts + "Quick add" slides up | Official-store product grid |
| Signature | **Colour Lab** (unchanged mechanics): scroll-pinned, 5 colourways; the rounded stage takes a soft tint of each colour, the name sits behind the shoe in 6% black | The colour moment, done quietly |
| Colour flip | Limited drop is a **black rounded panel** with white type and countdown | The one dark band on purpose |
| Loader | White sheet, wordmark + hairline that fills while a counter runs 000 → 100, then the sheet lifts (still exactly 2.5 s, `&at=` sync kept) | Quiet brand reveal |

**Motion:** calm. `power3.out` eases, 150–300 ms on hovers, no bounce. All auto-play behaviour for filming is unchanged (drop rail, size-picker demo, collections, countdown).

## Sections (11, same order and record stops as before)

1. Nav (`DropNav`) · 2. Hero (`StoreHero`) · 3. Statement "Faster. Lighter. Louder." (`Statement`, replaces the tilted speed tapes) · 4. Colour Lab (`ColourLab`) · 5. New drop (`DropRail`) · 6. Size picker (`SizeLab`) · 7. Tech stack (`TechStack`, stacking cards without the tilt) · 8. Collections (`CollectionStrips`, rounded panels) · 9. Limited drop (`LimitedDrop`) · 10. Run club (`RunClub`) · 11. Footer (`VoltFooter`, full-width "Volt" that darkens from grey to black on scroll). Loader: `IntroLoader`.

The record timeline (`data-record-*`) is unchanged: ~38.5 s after the 2.5 s loader (see `archive/day-02-volt-neon/DESIGN.md` for the table).

## Assets

**Have (checked 28 Sep)**
- `hero-run.jpg`: 2752×1536 ✅ (hero, replaces the video)
- `cw-lime.png`, `cw-ember.png`, `cw-ice.png`, `cw-pulse.png`, `cw-ghost.png`: ~1678×937. ⚠️ **Below the 1500 px-tall target.** For a side-profile shoe the width is what matters, and 1678 px wide is sharp enough on a 1440 laptop, but may look slightly soft on a 1920 screen. Re-export bigger (or upscale before removing the background) if you can; otherwise I'll use them as they are.

**Still needed: 14 images** (prompts below): 4 new-drop cut-outs, 1 limited cut-out, 3 tech macros, 4 collection photos, 2 run-club photos.

Tool: **Google Flow**. Make images with **Nano Banana Pro**.

**Style words for every photo** (so they share one mood): `night, wet asphalt, deep black shadows, neon lime rim light, cool teal-black colour grade, cinematic, photorealistic, film grain, no text, no logos`

**No video needed.** The hero is `hero-run.jpg` animated in code (see "Hero animation"). The earlier `night-run.mp4` plan (Veo video, watermark crop, loop cross-fade) is dropped.

### Cut-out shoes (transparent PNG, background removed with Photoroom / Adobe Express, full size)

**Size: every cut-out at least 1500 px tall** (ideally 2K+ / the biggest Nano Banana Pro gives you; ask for `4K resolution` in the prompt, or upscale before removing the background). Side-profile shoes are wide and short, so for those ask for a **3:4 or square** image with the shoe filling most of the width. After removing the background, download the **full-size** PNG from Photoroom / Adobe Express (not a smaller preview or social size). I'll convert them to WebP in Round 1.

**Colour Lab: the same shoe in 5 colourways** (same angle in all 5!) → `public/images/volt/cw-lime.png`, `cw-ember.png`, `cw-ice.png`, `cw-pulse.png`, `cw-ghost.png`
- First image:
  `Modern performance running shoe product photo, pure side profile facing right, whole shoe in frame with space around it, thick sculpted foam midsole, engineered knit upper, visible carbon plate edge, volt lime upper with black details and a white midsole, centred, plain pure white background, soft studio light, sharp, no shadow, no text, no logo, 4K resolution`
- Then, in the same chat, `same shoe, same angle, same lighting, only the colours change:`
  - `ember orange upper, black details, off-white midsole`
  - `ice blue upper, white details, light grey midsole`
  - `hot magenta upper, black details, white midsole`
  - `ghost white upper, light grey details, white midsole with a thin lime stripe`
- (No black colourway: it would disappear on the black page.)

**New drop: 4 different models**, three-quarter front view, same angle → `public/images/volt/sprint.png`, `tempo.png`, `trail.png`, `glide.png`
- `[MODEL] product photo, three-quarter front view facing right, whole shoe in frame, centred, plain pure white background, soft studio light, sharp, no shadow, no text, no logo, 4K resolution` with [MODEL] =
  - `Carbon-plated racing running shoe, very thick light foam midsole, thin mesh upper, volt lime and black`
  - `Everyday cushioned running trainer, knit upper, white with ice blue accents`
  - `Rugged trail running shoe, deep lug grip outsole, ember orange and charcoal`
  - `Soft recovery running shoe, chunky rocker midsole, all grey with a magenta heel tab`

**Limited drop** → `public/images/volt/monsoon.png`
- `Limited edition carbon-plated racing running shoe, three-quarter side view facing left, whole shoe in frame, translucent smoky upper showing a rain-drop pattern, glossy black midsole with a thin volt lime stripe, centred, plain pure white background, soft studio light, sharp, no shadow, no text, no logo, 4K resolution`

### Photos (16:9, 2K+, all with the style words above)

**Tech stack macros** → `public/images/volt/tech-foam.jpg`, `tech-plate.jpg`, `tech-grip.jpg`
- `Extreme macro close-up of a running shoe's thick foam midsole being compressed, fine foam texture, [style words]`
- `Extreme macro of a thin carbon fibre plate inside a cut-away running shoe midsole, woven carbon texture catching the light, [style words]`
- `Extreme macro of a running shoe's rubber outsole grip pattern on wet asphalt, water droplets, [style words]`

**Collections (tall crops work best, so leave the subject in the centre)** → `public/images/volt/col-road.jpg`, `col-trail.jpg`, `col-track.jpg`, `col-street.jpg`
- `Runner sprinting on an empty city road at night, full body, side view, [style words]`
- `Trail runner on a misty Western Ghats mountain path at blue hour, full body, [style words]` (use `rocky trail` instead of `wet asphalt`)
- `Sprinter in starting blocks on a red running track under stadium floodlights at night, full body, [style words]`
- `Young Indian sneaker fan standing under a flyover in the city at night, streetwear, close crop on the shoes and legs, [style words]`

**Run club** → `public/images/volt/club-1.jpg`, `club-2.jpg`
- `Group of young Indian runners running together along a seafront promenade at dawn, city skyline behind, joyful, candid, [style words]` (swap `night` for `blue dawn light`)
- `Close-up of runners high-fiving after a run at dawn, sweat, candid, [style words]` (same swap)

**Total:** 0 videos · 1 hero photo ✅ · 10 cut-outs (5 colourways ✅ + 4 models + 1 limited) · 9 photos = **20 images**, 6 in so far.
Drop them in `public/images/volt/`.
