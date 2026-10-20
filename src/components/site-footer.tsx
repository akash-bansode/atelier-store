import Link from "next/link";
import { footerLinks } from "@/lib/sample-data";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ash bg-vellum">
      <div className="container-site grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="type-display text-3xl">Atelier</p>
          <p className="type-caption mt-3 max-w-xs">
            Considered clothing and accessories, made in small runs.
          </p>
        </div>
        {footerLinks.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="type-label">{col.heading}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {col.links.map((label) => (
                <li key={label}>
                  <Link href="#" className="text-sm link-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-ash">
        <p className="container-site type-caption max-w-none py-6">
          &copy; 2026 Atelier. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
