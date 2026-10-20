const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const currency = (dollars: number) => usd.format(dollars);

// Stored image URLs carry no width; each call site picks the size it needs.
export function imageAt(url: string, width: number) {
  const u = new URL(url);
  u.searchParams.set("w", String(width));
  return u.toString();
}
