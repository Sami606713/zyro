import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";
import Link from "next/link";

export function BestSellers() {
  const items = products.filter((product) => product.bestseller);
  const [lead, ...rest] = items;

  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display max-w-[10ch] text-4xl leading-[1.05] font-semibold tracking-[-0.04em] md:text-6xl">
            Best sellers
          </h2>
          <Link href="/edit" className="text-sm text-accent">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {lead ? (
            <div className="lg:col-span-7">
              <ProductCard product={lead} />
            </div>
          ) : null}
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
