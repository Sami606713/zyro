import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";
import Link from "next/link";

export function Spotted() {
  const spotted = products.filter((product) => product.spotted);

  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-center text-sm font-medium tracking-[0.28em] uppercase">Zyro spotted</h2>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
          {spotted.map((product) => (
            <div key={product.slug} className="w-[72%] shrink-0 sm:w-[46%] lg:w-[23%]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/edit"
            className="inline-flex h-11 items-center border border-fg/30 px-6 text-sm tracking-wide hover:border-accent hover:text-accent"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}
