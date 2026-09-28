import { brandLinks, customerLinks, legalLinks } from "@/lib/store-nav";
import Link from "next/link";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-medium tracking-[0.18em] uppercase">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8 md:py-16">
        <div className="flex justify-center">
          <Link href="/" aria-label="Zyro home">
            <Logo />
          </Link>
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <Column title="Contact us">
            <ul className="space-y-3 text-sm text-muted">
              <li>Haripur, Khyber Pakhtunkhwa</li>
              <li>
                <a
                  href="https://www.instagram.com/zyrostore1/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-fg"
                >
                  @zyrostore1
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-fg">
                  Write to the shop
                </Link>
              </li>
            </ul>

          </Column>
          <Column title="About the brand">
            <ul className="space-y-3 text-sm text-muted">
              {brandLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="tracking-wide uppercase hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>
          <Column title="Customer care">
            <ul className="space-y-3 text-sm text-muted">
              {customerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="tracking-wide uppercase hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="tracking-wide uppercase hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>
          <Column title="Newsletter subscription">
            <p className="max-w-[28ch] text-sm leading-6 text-muted">
              Subscribe for new arrivals and the next drop from the Haripur floor.
            </p>
            <NewsletterForm />
          </Column>
        </div>
        <p className="mt-12 text-center text-xs tracking-[0.14em] text-muted uppercase">
          Zyro. Designed to define you.
        </p>
      </div>
    </footer>
  );
}
