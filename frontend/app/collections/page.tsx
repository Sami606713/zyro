"use client";

import { fetchCategories, fetchProducts } from "@/lib/storefront-api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  category_id: number;
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[];
};

export default function CollectionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchProducts({ limit: 100 })])
      .then(([cats, prods]) => {
        setCategories(cats);
        setProducts(prods.items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-muted">Loading collections...</p>
      </main>
    );
  }

  const [lead, ...rest] = categories;

  return (
    <main className="px-4 pt-8 pb-16 md:px-8 md:pt-10 md:pb-24">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] font-medium tracking-[0.22em] text-accent uppercase">Haripur</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Collections</h1>
          <p className="max-w-sm text-sm leading-6 text-muted">
            Browse all categories from the shop.
          </p>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-2 lg:items-stretch">
          {lead && <CollectionPanel category={lead} products={products} featured />}
          <div className="flex flex-col gap-3">
            {rest.map((category) => (
              <CollectionPanel key={category.slug} category={category} products={products} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function CollectionPanel({
  category,
  products,
  featured = false,
}: {
  category: { id: number; name: string; slug: string; description: string | null };
  products: Product[];
  featured?: boolean;
}) {
  const categoryProducts = products.filter((p) => p.category_id === category.id);
  const count = categoryProducts.length;
  const pieces = count === 1 ? "1 piece" : `${count} pieces`;
  const coverImage = categoryProducts[0]?.images.find((img) => img.is_primary) || categoryProducts[0]?.images[0];

  return (
    <Link
      href={`/collections/${category.slug}`}
      className={`group relative block overflow-hidden rounded-[1.6rem] bg-surface ring-1 ring-white/10 ${
        featured ? "min-h-[42vh] lg:min-h-[48vh]" : "min-h-48 flex-1"
      }`}
    >
      {coverImage && (
        <Image
          src={coverImage.image_url}
          alt={coverImage.alt_text || category.name}
          fill
          priority={featured}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <p className="text-[11px] tracking-[0.18em] text-fg/70 uppercase">{pieces}</p>
        <h2 className={`font-display mt-1 font-semibold tracking-[-0.04em] ${featured ? "text-4xl md:text-6xl" : "text-3xl"}`}>
          {category.name}
        </h2>
        {category.description && (
          <p className="mt-2 max-w-[28ch] text-sm text-fg/80">{category.description}</p>
        )}
      </div>
    </Link>
  );
}
