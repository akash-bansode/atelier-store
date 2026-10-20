import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ListingPage } from "@/components/listing-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCategories, getCategoryBySlug, listProducts } from "@/lib/products";

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCategoryBySlug(slug);
  return { title: c ? `${c.name} | Atelier` : "Atelier" };
}

export default function CollectionPage(props: PageProps<"/collections/[slug]">) {
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
      <Collection {...props} />
    </Suspense>
  );
}

async function Collection({
  params,
  searchParams,
}: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <ListingPage
      title={category.name}
      intro={category.description}
      basePath={`/collections/${category.slug}`}
      activeSlug={category.slug}
      items={await listProducts({ categorySlug: category.slug })}
      searchParams={searchParams}
    />
  );
}
