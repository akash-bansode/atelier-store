import type { Metadata } from "next";
import { ListingPage } from "@/components/listing-page";
import { listProducts } from "@/lib/products";

export const metadata: Metadata = { title: "All pieces | Atelier" };

export default async function CollectionsPage({ searchParams }: PageProps<"/collections">) {
  return (
    <ListingPage
      title="All pieces"
      intro="Clothing and accessories for the season, made in small runs."
      basePath="/collections"
      items={await listProducts()}
      searchParams={searchParams}
    />
  );
}
