const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

export const nav = [
  { label: "New arrivals", href: "/new-arrivals" },
  { label: "Women", href: "/collections/women" },
  { label: "Men", href: "/collections/men" },
  { label: "Bags", href: "/collections/bags" },
  { label: "Atelier", href: "/#atelier" },
];

export const hero = {
  title: "The autumn collection",
  body: "Considered tailoring and soft structure, cut in small runs.",
  cta: { label: "Shop the collection", href: "/collections/autumn" },
  image: img("1490481651871-ab68de25d43d", 2000),
  alt: "Garments on wooden hangers along a rail",
};

export const editorial = {
  title: "Made by hand, in small runs",
  body: "Every piece begins at the cutting table. We work with a handful of mills and workshops, and make only what we can finish well.",
  cta: { label: "Read about the atelier", href: "/#atelier" },
  image: img("1445205170230-053b83016050", 1400),
  alt: "Clothing hanging on a rail in warm light",
};

export const services = [
  { title: "Complimentary shipping", body: "On every order over $250." },
  { title: "Thirty-day returns", body: "Unworn pieces, no questions." },
  { title: "Alterations", body: "Tailoring on request for most pieces." },
];

export const footerLinks = [
  { heading: "Shop", links: ["New arrivals", "Women", "Men", "Bags"] },
  { heading: "Help", links: ["Shipping", "Returns", "Care guide", "Contact"] },
  { heading: "Atelier", links: ["Our story", "Materials", "Stockists"] },
];
