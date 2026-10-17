// All text and data for the Sri Hanuman Shoe Mart site. Facts (phones, address, brands, offer)
// come from the shop's business card; nothing else about the business is invented.

const IMG = "/images/sri-hanuman";

export const brand = {
  name: "Sri Hanuman",
  line2: "Shoe Mart",
  phones: [
    { label: "85199 88988", tel: "+918519988988" },
    { label: "62817 70554", tel: "+916281770554" },
  ],
  // Confirmed by the shop owner as the WhatsApp number.
  whatsapp: "https://wa.me/918519988988",
  address: ["15-3, Opp. Z.P.H. School, Dasari Complex,", "Main Road, Madhurawada,", "Visakhapatnam – 530048"],
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Sri Hanuman Shoe Mart, Dasari Complex, Main Road, Madhurawada, Visakhapatnam 530048"),
  // Printed on the card
  offer: "Show our visiting card at the counter and get an extra 5% to 10% off.",
  brands: ["Bata", "Paragon", "Lancer"],
};

/** Brands in the "Trusted brands" logo marquee (logos supplied by the shop/team).
 *  `r` = logo width / height after trimming; the marquee uses it to give every logo the same visual weight.
 *  `s` = optional size nudge for logos with empty space inside them (e.g. an oval badge). */
const BR = `${IMG}/brands`;
export const stockedBrands: { name: string; logo: string; r: number; s?: number }[] = [
  { name: "Bata", logo: `${BR}/bata.webp`, r: 4.0 },
  { name: "Paragon", logo: `${BR}/paragon.webp`, r: 2.4 },
  { name: "Lancer", logo: `${BR}/lancer.webp`, r: 6.78 },
  { name: "Walkaroo", logo: `${BR}/walkaroo.webp`, r: 1.0 },
  { name: "Woodland", logo: `${BR}/woodland.webp`, r: 2.45 },
  { name: "Nike", logo: `${BR}/nike.webp`, r: 1.89 },
  { name: "Adidas", logo: `${BR}/adidas.webp`, r: 1.48 },
  { name: "Puma", logo: `${BR}/puma.webp`, r: 1.06 },
  { name: "Wildcraft", logo: `${BR}/wildcraft.webp`, r: 1.84 },
  { name: "Skybags", logo: `${BR}/skybags.webp`, r: 2.02 },
  { name: "American Tourister", logo: `${BR}/american-tourister.webp`, r: 1.6, s: 1.3 },
];

export const nav = [
  { label: "Home", href: "#top" },
  { label: "Collections", href: "#collections" },
  { label: "Brands", href: "#brands" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Footwear for every generation",
  lines: ["Every Step.", "A Better Story."],
  body: "Discover school shoes, sports footwear, everyday styles, sandals and bags for the whole family.",
  primary: { label: "Explore Collection", href: "#collections" },
  secondary: { label: "Find Our Store", href: "#contact" },
  note: "School · Sports · Casual · Formal · Sandals · Slippers · Bags",
};

/** Supporting products in the showroom (cut-outs). `id` is used for placement in ShowroomStage. */
export const products = {
  schoolBlack: { src: `${IMG}/school-black.webp`, alt: "Black leather school shoes with a velcro strap", w: 528, h: 349 },
  schoolWhite: { src: `${IMG}/school-white.webp`, alt: "White school sneakers with two velcro straps", w: 514, h: 282 },
  athleticNavy: { src: `${IMG}/athletic-navy.webp`, alt: "Navy knit running shoe", w: 564, h: 307 },
  formalBrown: { src: `${IMG}/formal-brown.webp`, alt: "Brown leather oxford formal shoe", w: 575, h: 295 },
  sandalBrown: { src: `${IMG}/sandal-brown.webp`, alt: "Brown leather toe-ring sandals", w: 562, h: 356 },
  flipflop: { src: `${IMG}/flipflop.webp`, alt: "Coral and cream flip-flops", w: 574, h: 445 },
  bagPink: { src: `${IMG}/bag-pink.webp`, alt: "Pink school backpack", w: 360, h: 485 },
  bagNavy: { src: `${IMG}/bag-navy.webp`, alt: "Navy school backpack", w: 331, h: 492 },
  bagRed: { src: `${IMG}/bag-red.webp`, alt: "Red school backpack", w: 365, h: 498 },
  bagTote: { src: `${IMG}/bag-tote.webp`, alt: "Tan leather everyday tote bag", w: 386, h: 530 },
} as const;

export const plant = { src: `${IMG}/plant.webp`, w: 295, h: 533 };

export const heroSneaker = {
  model: "/models/hanuman-runner.glb",
  fallback: `${IMG}/hero-sneaker.webp`,
  alt: "White running sneaker with orange details",
};

export const categories = [
  { name: "School Shoes", note: "Black & white, velcro & lace", img: products.schoolBlack },
  { name: "Sports & Running", note: "Light, cushioned, everyday training", img: products.athleticNavy },
  { name: "Casual Sneakers", note: "Clean whites for every day", img: products.schoolWhite },
  { name: "Formal Leather", note: "Polished pairs for work & occasions", img: products.formalBrown },
  { name: "Sandals", note: "Leather comfort for warm days", img: products.sandalBrown },
  { name: "Slippers & Flip-flops", note: "Easy pairs for home & beach", img: products.flipflop },
  { name: "School Bags", note: "Roomy, padded, in bright colours", img: products.bagRed },
  { name: "Everyday Bags", note: "Totes & backpacks for college & work", img: products.bagTote },
];

export const about = {
  eyebrow: "About the store",
  title: ["One shop for", "the whole family."],
  // From the shop's card, the categories above and the brand logos the team supplied.
  facts: [
    { n: "8", label: "Categories under one roof" },
    { n: "11", label: "Trusted brands" },
    { n: "5–10%", label: "Extra off with our card" },
  ],
  body: "From a child's first school shoes to Dad's formal pair and Grandma's comfortable slippers, find shoes, sandals, slippers and school bags for every age under one roof on Madhurawada Main Road.",
};

/** Band under the hero: big category words with a product cut-out between each, plus a slim facts row. */
export const marquee = {
  words: [
    { word: "School Shoes", img: products.schoolBlack },
    { word: "Sports", img: products.athleticNavy },
    { word: "Casual", img: products.schoolWhite },
    { word: "Formal", img: products.formalBrown },
    { word: "Sandals", img: products.sandalBrown },
    { word: "Slippers", img: products.flipflop },
    { word: "School Bags", img: products.bagRed },
  ],
  facts: [
    "Bata · Paragon · Lancer",
    "Madhurawada Main Road",
    "Extra 5–10% off with our card",
    "Sizes for every age",
    "Ask stock on WhatsApp",
  ],
};

/** Shoe Lab (the shoe animation from the Volt site): one runner, five colourways, changed by scroll. Sample price. */
const VOLT = "/images/volt/web";
export const lab = {
  eyebrow: "Shoe Lab",
  heading: ["One runner.", "Five colours."],
  model: "Daily Runner",
  price: "₹1,299",
  specs: [
    { label: "Sizes", value: "UK 3 – 11" },
    { label: "Upper", value: "Breathable knit" },
    { label: "Sole", value: "Cushioned EVA" },
    { label: "For", value: "Kids to adults" },
  ],
  cta: { label: "Ask for your size", href: "https://wa.me/918519988988" },
  colourways: [
    { id: "ember", name: "Ember", color: "#ff5a1f", image: `${VOLT}/cw-ember.webp`, note: "Bright orange" },
    { id: "ice", name: "Ice", color: "#6ec4ff", image: `${VOLT}/cw-ice.webp`, note: "Cool blue" },
    { id: "pulse", name: "Pulse", color: "#ff2fa6", image: `${VOLT}/cw-pulse.webp`, note: "Magenta pink" },
    { id: "ghost", name: "Ghost", color: "#e6ebe4", image: `${VOLT}/cw-ghost.webp`, note: "Fog white" },
    { id: "lime", name: "Lime", color: "#c8ff1a", image: `${VOLT}/cw-lime.webp`, note: "Electric lime" },
  ],
};

/** Second Colour Lab, mirrored: the flip-flop in five colours. Colourways are recolours of the shop photo
 *  (straps only, sole untouched) made for the concept; swap in real photos when the shop has them. Sample price. */
const SLIP = "/images/sri-hanuman/slippers";
export const slipperLab = {
  eyebrow: "Slipper Lab",
  heading: ["One flip-flop.", "Five moods."],
  model: "Everyday Flip-flop",
  price: "₹249",
  specs: [
    { label: "Sizes", value: "UK 3 – 11" },
    { label: "Sole", value: "Soft textured EVA" },
    { label: "Strap", value: "Cushioned rubber" },
    { label: "For", value: "Home & beach" },
  ],
  cta: { label: "Ask for your size", href: "https://wa.me/918519988988" },
  colourways: [
    { id: "coral", name: "Coral", color: "#f2795b", image: `${SLIP}/flip-coral.webp`, note: "Warm coral" },
    { id: "ocean", name: "Ocean", color: "#3d8fe0", image: `${SLIP}/flip-ocean.webp`, note: "Sea blue" },
    { id: "mint", name: "Mint", color: "#3fd6a0", image: `${SLIP}/flip-mint.webp`, note: "Fresh green" },
    { id: "sunny", name: "Sunny", color: "#f5d020", image: `${SLIP}/flip-sunny.webp`, note: "Bright yellow" },
    { id: "berry", name: "Berry", color: "#c8338c", image: `${SLIP}/flip-berry.webp`, note: "Deep pink" },
  ],
};

/** Third lab: the shop's real bag photos. Three backpacks in one style, then the tote (own name + price). Sample prices. */
export const bagLab = {
  eyebrow: "Bag Lab",
  heading: ["A bag for", "every day."],
  model: "Classic School Backpack",
  price: "₹799",
  specs: [
    { label: "Styles", value: "Backpacks & totes" },
    { label: "For", value: "School, college & work" },
    { label: "Pockets", value: "Front & side" },
    { label: "Stock", value: "Ask on WhatsApp" },
  ],
  cta: { label: "Ask what's in stock", href: "https://wa.me/918519988988" },
  colourways: [
    { id: "red", name: "Red", color: "#e2231a", image: products.bagRed.src, note: "Bright school red" },
    { id: "navy", name: "Navy", color: "#1f2a5c", image: products.bagNavy.src, note: "Deep navy blue" },
    { id: "pink", name: "Pink", color: "#f4b6c2", image: products.bagPink.src, note: "Soft blush pink" },
    { id: "tan", name: "Tan", color: "#b5651d", image: products.bagTote.src, note: "Leather-look tote", model: "Everyday Tote", price: "₹1,199" },
  ],
};

export const footer = {
  credit: "Concept website by SHM Technologies",
  note: "Brand names belong to their owners. Product photos are illustrative.",
};
