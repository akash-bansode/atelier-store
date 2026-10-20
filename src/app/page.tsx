import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { imageAt } from "@/lib/format";
import { getCategories, listProducts } from "@/lib/products";
import { editorial, hero, services } from "@/lib/sample-data";

export default async function Home() {
  const [collections, newest] = await Promise.all([
    getCategories().then((cs) => cs.filter((c) => c.imageUrl)),
    listProducts({ limit: 8 }),
  ]);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-ink text-parchment lg:min-h-[88svh]">
          <Image
            src={hero.image}
            alt={hero.alt}
            fill
            priority
            sizes="100vw"
            className="img-cover -z-10 object-[center_25%]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-ink/40 to-ink/10" />
          <div className="container-site pb-12 lg:pb-20">
            <h1 className="max-w-[14ch] text-[clamp(2.75rem,8vw,6.5rem)] font-light">
              {hero.title}
            </h1>
            <p className="mt-5 max-w-md text-base text-parchment/90">
              {hero.body}
            </p>
            <Link
              href={hero.cta.href}
              className="btn mt-8 border-parchment bg-parchment text-ink hover:bg-transparent hover:text-parchment focus-ring"
            >
              {hero.cta.label}
            </Link>
          </div>
        </section>

        <section className="section-y">
          <div className="container-site">
            <div className="flex items-end justify-between gap-6">
              <h2>Collections</h2>
              <Link
                href="/collections"
                className="nav-link link-underline hidden sm:block"
              >
                View all
              </Link>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-3 lg:mt-14 lg:gap-6">
              {collections.map((c, i) => (
                <li key={c.slug}>
                  <Link
                    href={`/collections/${c.slug}`}
                    className="group block focus-ring"
                  >
                    <div className="aspect-editorial relative surface-vellum">
                      <Image
                        src={imageAt(c.imageUrl!, 900)}
                        alt=""
                        fill
                        priority={i === 0}
                        sizes="(min-width: 40rem) 33vw, 100vw"
                        className="img-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <h3 className="text-2xl">{c.name}</h3>
                      <p className="type-caption">{c.count} pieces</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pb-[var(--section-y)]">
          <div className="container-site">
            <div className="flex items-end justify-between gap-6 border-t border-ash pt-10 lg:pt-14">
              <h2>New this season</h2>
              <Link
                href="/new-arrivals"
                className="nav-link link-underline"
              >
                Shop all
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 lg:mt-14 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
              {newest.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="atelier" className="surface-vellum scroll-mt-16">
          <div className="grid lg:grid-cols-2">
            <div className="aspect-[4/3] relative lg:aspect-auto lg:min-h-[36rem]">
              <Image
                src={editorial.image}
                alt={editorial.alt}
                fill
                sizes="(min-width: 64rem) 50vw, 100vw"
                className="img-cover"
              />
            </div>
            <div className="flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-16 lg:py-24 xl:px-24">
              <h2 className="max-w-[16ch]">{editorial.title}</h2>
              <p className="mt-6 max-w-md text-graphite">{editorial.body}</p>
              <Link
                href={editorial.cta.href}
                className="btn btn-ghost mt-10 self-start focus-ring"
              >
                {editorial.cta.label}
              </Link>
            </div>
          </div>
        </section>

        <section className="section-y">
          <ul className="container-site grid gap-10 sm:grid-cols-3 sm:gap-6">
            {services.map((s) => (
              <li key={s.title} className="sm:border-l sm:border-ash sm:pl-6 first:sm:border-l-0 first:sm:pl-0">
                <h3 className="text-2xl">{s.title}</h3>
                <p className="type-caption mt-2">{s.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
