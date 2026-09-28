"use client";

import { ProductCard } from "@/components/product-card";
import { fetchCategories, fetchProducts } from "@/lib/storefront-api";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

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

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchProducts({ limit: 100 })])
      .then(([cats, prods]) => {
        setCategories(cats);
        const cat = cats.find((c) => c.slug === slug);
        if (!cat) {
          setNotFound(true);
          return;
        }
        setCategory(cat);
        setProducts(prods.filter((p) => p.category_id === cat.id));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-muted">Loading collection...</p>
      </main>
    );
  }

  if (notFound || !category) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-muted">Collection not found.</p>
      </main>
    );
  }

  const coverImage = products[0]?.images.find((img) => img.is_primary) || products[0]?.images[0];
  const pieces = products.length === 1 ? "1 piece on the floor." : `${products.length} pieces on the floor.`;

  return (
    <main>
      <div className="relative min-h-[42vh] bg-[#121316]">
        {coverImage && (
          <Image
            src={coverImage.image_url}
            alt={coverImage.alt_text || category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-black/25" />
        <div className="relative z-10 flex min-h-[42vh] items-end px-4 pt-10 pb-8 md:px-8 md:pb-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Link href="/collections" className="text-sm text-fg/75 hover:text-fg">
              Collections
            </Link>
            <h1 className="font-display mt-3 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{category.name}</h1>
            <p className="mt-3 text-sm text-fg/80">{pieces}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
        <nav className="flex flex-wrap gap-2" aria-label="Collections">
          {categories.map((item) => {
            const current = item.slug === category.slug;
            return (
              <Link
                key={item.slug}
                href={`/collections/${item.slug}`}
                aria-current={current ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm ${
                  current ? "bg-accent text-ink" : "bg-white/5 text-muted hover:text-fg"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
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
