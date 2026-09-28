"use client";

import { holdPiece } from "@/lib/cart-store";
import { type Product } from "@/lib/catalog";
import { useState } from "react";

const sizesFor: Record<Product["categorySlug"], string[]> = {
  apparel: ["S", "M", "L", "XL"],
  outerwear: ["S", "M", "L", "XL"],
  bottomwear: ["30", "32", "34", "36"],
  accessories: ["32", "34", "36", "38"],
};

export function ProductPurchase({ product }: { product: Product }) {
  const sizes = sizesFor[product.categorySlug];
  const [size, setSize] = useState(sizes[1] ?? sizes[0]);

  return (
    <div className="mt-8">
      <p className="text-sm text-muted">Size</p>
      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
        {sizes.map((option) => {
          const selected = option === size;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setSize(option)}
              className={`h-12 min-w-12 rounded-full border px-4 text-sm ${
                selected ? "border-accent bg-accent text-ink" : "border-white/20 text-fg hover:border-fg"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="btn btn-primary mt-6 w-full max-w-md"
        onClick={() => {
          holdPiece({
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
            size,
          });
        }}
      >
        Add to cart
      </button>
    </div>
  );
}
