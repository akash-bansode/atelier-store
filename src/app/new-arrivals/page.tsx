import type { Metadata } from "next";
import { ListingPage } from "@/components/listing-page";
import { listProducts } from "@/lib/products";

export const metadata: Metadata = { title: "New arrivals | Atelier" };

export default async function NewArrivalsPage({ searchParams }: PageProps<"/new-arrivals">) {
  return (
    <ListingPage
      title="New arrivals"
      intro="The newest pieces, added this season."
      basePath="/new-arrivals"
      items={await listProducts({ limit: 8 })}
      searchParams={searchParams}
    />
  );
}
