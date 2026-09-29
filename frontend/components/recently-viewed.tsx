"use client";

import { formatPrice } from "@/lib/format";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[];
};

const KEY = "zyro-recently-viewed";

function readRecent(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(product: Product) {
  if (typeof window === "undefined") return;
  const items = readRecent();
  const filtered = items.filter((p) => p.id !== product.id);
  filtered.unshift(product);
  window.localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, 8)));
}

export function RecentlyViewed() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    setItems(readRecent());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-line px-4 py-16 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="font-display flex items-center gap-2 text-3xl tracking-[-0.03em]">
          <Eye size={24} />
          Recently viewed
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.slice(0, 4).map((item) => {
            const image = item.images.find((img) => img.is_primary) || item.images[0];
            return (
              <Link key={item.id} href={`/products/${item.slug}`} className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.6rem] bg-surface ring-1 ring-white/10">
                  {image && (
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || item.name}
                      fill
                      sizes="(min-width: 768px) 22vw, 45vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  )}
                </div>
                <p className="mt-3 truncate text-lg">{item.name}</p>
                <p className="text-sm text-muted">{formatPrice(item.base_price)}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
