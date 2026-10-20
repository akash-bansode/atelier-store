import Image from "next/image";
import Link from "next/link";
import { currency } from "@/lib/format";
import type { Product } from "@/lib/products";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="group">
      <Link
        href={`/products/${product.slug}`}
        className="block focus-ring"
      >
        <div className="aspect-portrait relative surface-vellum">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            priority={priority}
            sizes="(min-width: 64rem) 25vw, 50vw"
            className="img-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          {product.badge && (
            <span className="type-label absolute left-3 top-3 bg-parchment px-2 py-1.5">
              {product.badge}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-body text-sm font-normal tracking-normal">
              {product.name}
            </h3>
            <p className="type-caption mt-1">{product.category}</p>
          </div>
          <p className="type-price shrink-0">{currency(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
