"use client";

import { fetchProduct, fetchProducts } from "@/lib/storefront-api";
import { formatPrice } from "@/lib/format";
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

export function ShopTheLook() {
  const [pieces, setPieces] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ limit: 100 })
      .then((products) => setPieces(products.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-muted">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src="/looks/portrait.jpg"
            alt="Man in a charcoal overshirt and black trousers."
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover object-[center_20%]"
          />
        </div>
        <div>
          <h2 className="font-display max-w-[10ch] text-4xl leading-[1.05] font-semibold tracking-[-0.04em] md:text-6xl">
            Shop the look
          </h2>
          <p className="mt-4 max-w-[36ch] text-muted">Curated pieces from the collection.</p>
          <ol className="mt-8 divide-y divide-line">
            {pieces.map((piece, index) => {
              const pieceImage = piece.images.find((img) => img.is_primary) || piece.images[0];
              return (
                <li key={piece.slug}>
                  <Link href={`/products/${piece.slug}`} className="flex items-center gap-4 py-4">
                    <span className="w-6 text-sm text-muted">{index + 1}</span>
                    <span className="relative h-16 w-14 shrink-0 overflow-hidden bg-surface">
                      {pieceImage && (
                        <Image src={pieceImage.image_url} alt="" fill sizes="56px" className="object-cover" />
                      )}
                    </span>
                    <span className="flex-1">
                      <span className="block text-lg">{piece.name}</span>
                      <span className="text-sm text-muted">{formatPrice(piece.base_price)}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
