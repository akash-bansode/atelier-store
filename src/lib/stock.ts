export type StockState = "in-stock" | "low-stock" | "sold-out" | "made-to-order";

const LOW_STOCK_AT = 3;

export function stockState(p: { stock: number; madeToOrder?: boolean }): StockState {
  if (p.madeToOrder) return "made-to-order";
  if (p.stock <= 0) return "sold-out";
  if (p.stock <= LOW_STOCK_AT) return "low-stock";
  return "in-stock";
}

export function stockCopy(state: StockState, stock: number): string {
  switch (state) {
    case "in-stock":
      return "In stock";
    case "low-stock":
      return `Low stock, ${stock} left`;
    case "sold-out":
      return "Sold out";
    case "made-to-order":
      return "Made to order, ships in 3 to 4 weeks";
  }
}

export const stockTone: Record<StockState, string> = {
  "in-stock": "bg-forest",
  "low-stock": "bg-flax",
  "sold-out": "bg-smoke",
  "made-to-order": "bg-graphite",
};
