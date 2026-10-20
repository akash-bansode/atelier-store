import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { currency } from "@/lib/format";
import { colourSwatch } from "@/lib/listing";
import { getProductBySlug, getProductSlugs, getRelatedProducts } from "@/lib/products";
import { services } from "@/lib/sample-data";
import { stockCopy, stockState, stockTone } from "@/lib/stock";

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  return { title: p ? `${p.name} | Atelier` : "Atelier", description: p?.description };
}

export default function ProductPage(props: PageProps<"/products/[slug]">) {
  return (
    <Suspense
      fallback={
        <>
          <SiteHeader />
          <main id="main" className="flex-1" />
          <SiteFooter />
        </>
      }
    >
      <Product {...props} />
    </Suspense>
  );
}

async function Product({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const state = stockState(product);
  const soldOut = state === "sold-out";

  const related = await getRelatedProducts(product.slug, product.categorySlug);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <div className="container-site pt-6 lg:pt-8">
          <nav aria-label="Breadcrumb">
            <ol className="type-caption flex flex-wrap gap-x-2">
              <li>
                <Link href="/collections" className="link-underline">
                  Collections
                </Link>
                <span aria-hidden="true"> /</span>
              </li>
              <li>
                <Link href={`/collections/${product.categorySlug}`} className="link-underline">
                  {product.category}
                </Link>
                <span aria-hidden="true"> /</span>
              </li>
              <li aria-current="page" className="text-ink">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>

        <section className="container-site grid gap-8 pb-[var(--section-y)] pt-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:pt-8">
          <div className="aspect-portrait relative surface-vellum lg:aspect-[4/5]">
            <Image
              src={product.imageLarge}
              alt={product.alt}
              fill
              priority
              sizes="(min-width: 64rem) 58vw, 100vw"
              className="img-cover object-[center_20%]"
            />
            {product.badge && (
              <span className="type-label absolute left-4 top-4 bg-parchment px-2.5 py-2">
                {product.badge}
              </span>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="type-caption">
              <Link href={`/collections/${product.categorySlug}`} className="link-underline">
                {product.category}
              </Link>
            </p>
            <h1 className="mt-2 text-[clamp(2rem,4.5vw,3.25rem)] font-light">
              {product.name}
            </h1>
            <p className="type-price mt-4 text-base">{currency(product.price)}</p>

            <p
              className="mt-6 flex items-center gap-3 text-sm"
              aria-live="polite"
            >
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${stockTone[state]}`}
              />
              {stockCopy(state, product.stock)}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                disabled={soldOut}
                className="btn btn-primary btn-wide focus-ring"
              >
                {soldOut ? "Sold out" : state === "made-to-order" ? "Order now" : "Add to bag"}
              </button>
            </div>

            <p className="mt-10 max-w-prose text-graphite">{product.description}</p>

            <dl className="mt-8 border-t border-ash text-sm">
              <div className="flex justify-between gap-6 border-b border-ash py-4">
                <dt className="text-smoke">Colour</dt>
                <dd className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-3 border border-ash"
                    style={{ backgroundColor: colourSwatch[product.colour] }}
                  />
                  {product.colour}
                </dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-ash py-4">
                <dt className="text-smoke">Material</dt>
                <dd>{product.material}</dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-ash py-4">
                <dt className="text-smoke">Category</dt>
                <dd>{product.category}</dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-ash py-4">
                <dt className="text-smoke">Delivery</dt>
                <dd>{services[0].title}</dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-ash py-4">
                <dt className="text-smoke">Returns</dt>
                <dd>{services[1].title}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="border-t border-ash pb-[var(--section-y)] pt-10 lg:pt-14">
          <div className="container-site">
            <div className="flex items-end justify-between gap-6">
              <h2>You may also like</h2>
              <Link href="/collections" className="nav-link link-underline">
                Shop all
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 lg:mt-14 lg:grid-cols-4 lg:gap-x-6">
              {related.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
