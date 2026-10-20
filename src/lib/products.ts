import "server-only";

import { asc, count, desc, eq, ne, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { imageAt } from "@/lib/format";

export type Product = {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  colour: string;
  material: string;
  description: string;
  stock: number;
  madeToOrder: boolean;
  image: string;
  imageLarge: string;
  alt: string;
  badge?: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  imageUrl: string | null;
  count: number;
};

type Row = {
  product: typeof products.$inferSelect;
  category: { slug: string; name: string };
};

function mapProduct({ product: p, category }: Row): Product {
  return {
    slug: p.slug,
    name: p.name,
    category: category.name,
    categorySlug: category.slug,
    price: p.priceCents / 100,
    colour: p.colour,
    material: p.material,
    description: p.description,
    stock: p.stockQuantity,
    madeToOrder: p.madeToOrder,
    image: imageAt(p.imageUrl, 800),
    imageLarge: imageAt(p.imageUrl, 1400),
    alt: p.imageAlt,
    badge: p.badge ?? undefined,
  };
}

const productSelect = {
  product: products,
  category: { slug: categories.slug, name: categories.name },
};

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const rows = await db
    .select({
      slug: categories.slug,
      name: categories.name,
      description: categories.description,
      imageUrl: categories.imageUrl,
      count: count(products.id),
    })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.createdAt));
  return rows;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}

export async function listProducts(
  opts: { categorySlug?: string; limit?: number } = {},
): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const query = db
    .select(productSelect)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(opts.categorySlug ? eq(categories.slug, opts.categorySlug) : undefined)
    .orderBy(desc(products.createdAt))
    .$dynamic();
  const rows = await (opts.limit ? query.limit(opts.limit) : query);
  return rows.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const [row] = await db
    .select(productSelect)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);
  return row ? mapProduct(row) : null;
}

export async function getProductSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const rows = await db.select({ slug: products.slug }).from(products);
  return rows.map((r) => r.slug);
}

// Same-category pieces first, then the rest, newest first within each group.
export async function getRelatedProducts(
  slug: string,
  categorySlug: string,
  limit = 4,
): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const rows = await db
    .select(productSelect)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(ne(products.slug, slug))
    .orderBy(desc(sql`${categories.slug} = ${categorySlug}`), desc(products.createdAt))
    .limit(limit);
  return rows.map(mapProduct);
}
