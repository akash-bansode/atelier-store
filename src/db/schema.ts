// Single schema file: source of truth for drizzle-kit, the `db` client and the
// Better Auth adapter. Better Auth's tables (user, session, account,
// verification) and all further application tables belong here too.
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid().primaryKey().defaultRandom(),
  slug: text().notNull().unique(),
  name: text().notNull(),
  description: text().notNull().default(""),
  imageUrl: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable(
  "products",
  {
    id: uuid().primaryKey().defaultRandom(),
    slug: text().notNull().unique(),
    categoryId: uuid()
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: text().notNull(),
    description: text().notNull(),
    material: text().notNull(),
    colour: text().notNull(),
    // Money is integer cents; only mapProduct() in src/lib/products.ts divides by 100.
    priceCents: integer().notNull(),
    // Stock is a quantity plus a flag; the UI state is derived by stockState().
    stockQuantity: integer().notNull().default(0),
    madeToOrder: boolean().notNull().default(false),
    imageUrl: text().notNull(),
    imageAlt: text().notNull(),
    badge: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("products_price_cents_check", sql`${t.priceCents} >= 0`),
    check("products_stock_quantity_check", sql`${t.stockQuantity} >= 0`),
    index("products_category_id_idx").on(t.categoryId),
    index("products_created_at_idx").on(t.createdAt.desc()),
  ],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));
