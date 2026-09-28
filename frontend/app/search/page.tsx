import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Search | Zyro" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
  const found = query
    ? products.filter((product) =>
        `${product.name} ${product.fabric} ${product.category}`.toLowerCase().includes(query),
      )
    : products;

  return (
    <main className="px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="font-display text-4xl tracking-[-0.04em] md:text-6xl">Search</h1>
        <p className="mt-3 text-muted">
          {query ? `${found.length} matches for “${q}”.` : "Every piece currently on the floor."}
        </p>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {found.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
