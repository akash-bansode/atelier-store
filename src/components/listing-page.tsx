import Link from "next/link";
import { Suspense } from "react";
import { ProductListing } from "@/components/product-listing";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCategories, type Product } from "@/lib/products";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function ListingPage({
  title,
  intro,
  basePath,
  activeSlug,
  items,
  searchParams,
}: {
  title: string;
  intro: string;
  basePath: string;
  activeSlug?: string;
  items: Product[];
  searchParams: SearchParams;
}) {
  const categories = await getCategories();
  const tabs = [{ slug: "", label: "All", href: "/collections" }].concat(
    categories.map((c) => ({
      slug: c.slug,
      label: c.name,
      href: `/collections/${c.slug}`,
    })),
  );

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <div className="container-site pb-[var(--section-y)] pt-12 lg:pt-20">
          <header className="max-w-2xl">
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-light">{title}</h1>
            <p className="mt-4 text-graphite">{intro}</p>
          </header>

          <nav aria-label="Categories" className="mb-10 mt-10 lg:mt-14">
            <ul className="flex gap-7 overflow-x-auto">
              {tabs.map((t) => (
                <li key={t.label}>
                  <Link
                    href={t.href}
                    aria-current={(activeSlug ?? "") === t.slug ? "page" : undefined}
                    className="nav-link link-underline inline-block py-2 aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:underline-offset-8"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Suspense
            fallback={
              <p className="type-caption py-24 text-center">Loading pieces…</p>
            }
          >
            <ProductListing
              basePath={basePath}
              items={items}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
