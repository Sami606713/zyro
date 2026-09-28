import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/catalog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop | Zyro",
};

export default function ShopPage() {
  return (
    <main className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Shop</h1>
        <p className="mt-4 max-w-[42ch] text-muted">
          Apparel, bottomwear, outerwear, and accessories from the Haripur floor.
        </p>
        <nav className="mt-8 flex flex-wrap gap-3" aria-label="Shop categories">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className="rounded-full border border-line px-4 py-2 text-sm hover:border-accent hover:text-accent"
            >
              {category.title}
            </Link>
          ))}
        </nav>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
