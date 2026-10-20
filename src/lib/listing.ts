import type { Product } from "@/lib/products";

export const colourSwatch: Record<string, string> = {
  Black: "#1a1a19", White: "#f4f2ee", Navy: "#1f2c4a", Brown: "#7a5538",
  Pink: "#e7b9bd", Red: "#b3262d", Orange: "#d9772c", Yellow: "#e8c33a",
};

export const sorts = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
] as const;

export const priceBands = [
  { value: "under-500", label: "Under $500", test: (p: number) => p < 500 },
  { value: "500-1000", label: "$500 to $1,000", test: (p: number) => p >= 500 && p <= 1000 },
  { value: "over-1000", label: "Over $1,000", test: (p: number) => p > 1000 },
] as const;

export type Filters = {
  sort: (typeof sorts)[number]["value"];
  colours: string[];
  price?: (typeof priceBands)[number]["value"];
};

type RawParams = { [key: string]: string | string[] | undefined };

const list = (v: string | string[] | undefined) =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];

export function parseFilters(params: RawParams, validColours: string[]): Filters {
  const sort = sorts.find((s) => s.value === list(params.sort)[0])?.value ?? "newest";
  const colours = list(params.colour).filter((c) => validColours.includes(c));
  const price = priceBands.find((b) => b.value === list(params.price)[0])?.value;
  return { sort, colours, price };
}

export function applyFilters(items: Product[], f: Filters): Product[] {
  const band = priceBands.find((b) => b.value === f.price);
  const out = items.filter(
    (p) =>
      (f.colours.length === 0 || f.colours.includes(p.colour)) &&
      (!band || band.test(p.price)),
  );
  if (f.sort === "price-asc") out.sort((a, b) => a.price - b.price);
  if (f.sort === "price-desc") out.sort((a, b) => b.price - a.price);
  return out;
}

export function listingHref(basePath: string, f: Filters, drop?: { colour?: string; price?: boolean }) {
  const q = new URLSearchParams();
  if (f.sort !== "newest") q.set("sort", f.sort);
  for (const c of f.colours) if (c !== drop?.colour) q.append("colour", c);
  if (f.price && !drop?.price) q.set("price", f.price);
  const s = q.toString();
  return s ? `${basePath}?${s}` : basePath;
}
