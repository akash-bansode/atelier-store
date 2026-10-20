import "./load-env";
import { db } from "../src/db";
import { categories, products } from "../src/db/schema";
import { seedCategories, seedProducts } from "./seed-data";

// Fixed base so "newest" ordering is identical on every run.
const BASE = Date.UTC(2026, 8, 1);
const DAY = 24 * 60 * 60 * 1000;

async function main() {
  // Categories have no position column: getCategories() orders by createdAt asc.
  const categoryRows = seedCategories.map((c, i) => ({
    id: crypto.randomUUID(),
    ...c,
    createdAt: new Date(BASE + i * 1000),
  }));
  const idBySlug = new Map(categoryRows.map((c) => [c.slug, c.id]));

  const productRows = seedProducts.map(({ category, ...p }, i) => {
    const categoryId = idBySlug.get(category);
    if (!categoryId) throw new Error(`Unknown category slug: ${category}`);
    const createdAt = new Date(BASE - i * DAY);
    return { ...p, categoryId, createdAt, updatedAt: createdAt };
  });

  // One batch = one transaction on the HTTP driver. Children before parents.
  await db.batch([
    db.delete(products),
    db.delete(categories),
    db.insert(categories).values(categoryRows),
    db.insert(products).values(productRows),
  ]);

  console.log(`Seeded ${categoryRows.length} categories and ${productRows.length} products.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
