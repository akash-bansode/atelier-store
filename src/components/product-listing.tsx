import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import {
  applyFilters,
  colourSwatch,
  listingHref,
  parseFilters,
  priceBands,
  sorts,
} from "@/lib/listing";
import type { Product } from "@/lib/products";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function ProductListing({
  basePath,
  items,
  searchParams,
}: {
  basePath: string;
  items: Product[];
  searchParams: SearchParams;
}) {
  const allColours = [...new Set(items.map((p) => p.colour))].sort();
  const filters = parseFilters(await searchParams, allColours);
  const shown = applyFilters(items, filters);
  const band = priceBands.find((b) => b.value === filters.price);
  const active = filters.colours.length + (band ? 1 : 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-y border-ash py-3">
        <details className="group w-full">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between focus-ring [&::-webkit-details-marker]:hidden">
            <span className="nav-link">
              Filter and sort{active > 0 ? ` (${active})` : ""}
            </span>
            <span className="type-caption" aria-live="polite">
              {shown.length} {shown.length === 1 ? "piece" : "pieces"}
            </span>
          </summary>

          <form
            action={basePath}
            method="get"
            className="grid gap-10 border-t border-ash py-8 sm:grid-cols-3"
          >
            <fieldset>
              <legend className="type-label mb-4">Sort</legend>
              <div className="flex flex-col gap-3">
                {sorts.map((s) => (
                  <label key={s.value} className="flex items-center gap-3 text-sm">
                    <input
                      type="radio"
                      name="sort"
                      value={s.value}
                      defaultChecked={filters.sort === s.value}
                      className="size-4 accent-ink"
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="type-label mb-4">Colour</legend>
              <div className="grid grid-cols-2 gap-3">
                {allColours.map((c) => (
                  <label key={c} className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      name="colour"
                      value={c}
                      defaultChecked={filters.colours.includes(c)}
                      className="size-4 accent-ink"
                    />
                    <span
                      aria-hidden="true"
                      className="size-3 border border-ash"
                      style={{ backgroundColor: colourSwatch[c] }}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="type-label mb-4">Price</legend>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="radio"
                    name="price"
                    value=""
                    defaultChecked={!filters.price}
                    className="size-4 accent-ink"
                  />
                  Any price
                </label>
                {priceBands.map((b) => (
                  <label key={b.value} className="flex items-center gap-3 text-sm">
                    <input
                      type="radio"
                      name="price"
                      value={b.value}
                      defaultChecked={filters.price === b.value}
                      className="size-4 accent-ink"
                    />
                    {b.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex gap-3 sm:col-span-3">
              <button type="submit" className="btn btn-primary focus-ring">
                Show {items.length === shown.length ? "results" : `${shown.length} results`}
              </button>
              <Link href={basePath} className="btn btn-muted focus-ring">
                Clear all
              </Link>
            </div>
          </form>
        </details>
      </div>

      {active > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Active filters">
          {filters.colours.map((c) => (
            <li key={c}>
              <Link
                href={listingHref(basePath, filters, { colour: c })}
                aria-label={`Remove filter: ${c}`}
                className="btn btn-muted btn-sm focus-ring"
              >
                {c} &times;
              </Link>
            </li>
          ))}
          {band && (
            <li>
              <Link
                href={listingHref(basePath, filters, { price: true })}
                aria-label={`Remove filter: ${band.label}`}
                className="btn btn-muted btn-sm focus-ring"
              >
                {band.label} &times;
              </Link>
            </li>
          )}
        </ul>
      )}

      {shown.length === 0 ? (
        <div className="py-24 text-center">
          <h2 className="text-3xl">Nothing matches those filters</h2>
          <p className="type-caption mx-auto mt-3">
            Remove a filter to see more pieces.
          </p>
          <Link href={basePath} className="btn btn-ghost mt-8 focus-ring">
            Clear all filters
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
          {shown.map((p, i) => (
            <li key={p.slug}>
              <ProductCard product={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
