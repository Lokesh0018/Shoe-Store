# Sri Hanuman Shoe Mart — design direction

Local footwear + school-bag shop, Madhurawada, Visakhapatnam (facts from the shop's business card: two phones, address, Bata / Paragon / Lancer, card discount). Audience: families shopping for school, sports, everyday and formal shoes, sandals, slippers and bags.

## Choices

| Menu | Pick | Why |
|---|---|---|
| Look | L2/L5 mix: **cool daylight showroom** (snow-white walls, pale slate-stone plinths, polished pale-grey marble floor) | Feels like an expensive campaign without being dark or "tech" |
| Palette | Snow `#F8FAFC`, frost `#EEF2F7`, orange `#F47735` / deep `#D9541E` (button fill `#CF4D17` for 4.5:1), navy `#192338`, slate grey `#525D6E` | From the brief; orange used only for orbit, LED lines, active nav, CTA |
| Type | Bricolage Grotesque (750, tight) + DM Sans | Bold editorial sans the brief asked for; new pair for the log |
| Nav | Transparent → frosted bar: logo · centred links (orange underline) · phones + WhatsApp + Visit store | Header stays secondary to the hero |
| Hero | H8-style: copy left (39%), showroom right (61%): arches, shelves, tiered pedestals, real 3D sneaker | Shows the full product range at a glance |
| Shape | Straight sections, soft 28–32 px cards | Calm retail rhythm |
| Cards | White card + cream stage + product cut-out, lift on hover | Matches the plinths in the hero |
| Signature moment | **Floating WebGL sneaker wrapped by an orange light orbit** (back half behind the canvas, front half in front) | Product focus, restrained motion |
| Loader | None; the hero's own entrance timeline is the intro | Brief: polished visual on the first frame |

## Hero build

- 1000 × 900 grid scene inside a CSS size container (1 unit = 0.1cqw), so every arch/pedestal/product scales together at every width.
- 3D: `public/models/hanuman-runner.glb` = Khronos "Materials Variants Shoe" (Shopify, CC BY 4.0), texture re-coloured to white knit + orange tabs + black laces, WebP textures, ~1 MB. Procedural Lightformer environment (no HDR download).
- Still fallback `hero-sneaker.webp` is a capture of the same model at the resting pose → shows first, plays the intro, then the canvas cross-fades in (2.3 s, idle) so shader compile never stalls the entrance. Also used for no-WebGL, low-power phones, context loss and model errors (`?no3d=1` to test).
- Timeline (GSAP): room + header + plinths 0–1.2 s · eyebrow, masked headline lines, body, CTAs 0.8–1.8 s · sneaker rise, orbit draw, pedestal LED 0.8–2.4 s · then float/sway + orbit light loop (paused off-screen).
- Pointer parallax by layer depth + sneaker tilt (fine pointers only). Scroll: copy lifts away, room eases back, sneaker turns (`motion.scroll`) — no pinning.

## Sections

1. Hero (above) · 2. Collections — 8 category cards (#collections, primary CTA) · 3. Brands strip (#brands) · 4. About + Visit card with address, phones, directions, WhatsApp (#about, #contact = "Find Our Store") · Footer with concept credit + model licence.

## Assets

Product cut-outs in `public/images/sri-hanuman/` were generated with Canva AI (studio look, same light), backgrounds removed locally. Replace with real shop photos any time (same file names; keep transparent backgrounds).

## Different from the last sites

| | Volt minimal (day 2) | Sri Hanuman |
|---|---|---|
| Look | Swiss white store | Cool daylight showroom |
| Palette | Paper + black | Snow white + slate stone + orange |
| Type | Inter only | Bricolage + DM Sans |
| Hero | Full-bleed photo | Split copy + 3D showroom scene |
| Moment | Colour Lab | WebGL sneaker + wrapping orbit |
| Loader | Hairline sheet | None (hero intro) |
