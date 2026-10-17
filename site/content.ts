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

export const footer = {
  credit: "Concept website by SHM Technologies",
  note: "Brand names belong to their owners. Product photos are illustrative.",
};
