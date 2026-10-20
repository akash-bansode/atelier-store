import Link from "next/link";
import { nav } from "@/lib/sample-data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ash bg-parchment/95 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <details className="group relative lg:hidden">
          <summary className="nav-link flex h-11 cursor-pointer list-none items-center focus-ring [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav
            aria-label="Primary"
            className="absolute left-0 top-full mt-px w-[min(20rem,90vw)] border border-ash bg-parchment p-6 shadow-soft"
          >
            <ul className="flex flex-col gap-5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link link-underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/"
          aria-label="Atelier home"
          className="type-display text-3xl tracking-[0.04em] focus-ring"
        >
          Atelier
        </Link>

        <ul className="flex items-center justify-end gap-6">
          <li className="hidden sm:block">
            <Link href="/search" className="nav-link link-underline">
              Search
            </Link>
          </li>
          <li>
            <Link href="/account" className="nav-link link-underline">
              Account
            </Link>
          </li>
          <li>
            <Link href="/bag" className="nav-link link-underline">
              Bag
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
