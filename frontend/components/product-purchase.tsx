"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { addToCart } from "@/lib/store/cart-slice";
import { useState } from "react";

type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[];
  variants: { id: number; size: string; color: string; sku: string; stock_quantity: number; price_override: number | null }[];
  category?: { id: number; name: string; slug: string };
};

export function ProductPurchase({ product }: { product: ApiProduct }) {
  const dispatch = useAppDispatch();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.map((v) => v.color))];

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const outOfStock = selectedVariant && selectedVariant.stock_quantity < quantity;

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setError("Please select a size and color");
      return;
    }
    if (outOfStock) {
      setError("Not enough stock");
      return;
    }

    setAdding(true);
    setError("");

    try {
      await dispatch(
        addToCart({ variant_id: selectedVariant.id, quantity })
      ).unwrap();
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div>
        <p className="text-sm text-muted">Size</p>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={selectedSize === size}
              onClick={() => setSelectedSize(size)}
              className={`h-12 min-w-12 rounded-full border px-4 text-sm transition-colors ${
                selectedSize === size
                  ? "border-accent bg-accent text-ink"
                  : "border-white/20 text-fg hover:border-fg"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-muted">Color</p>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Color">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={selectedColor === color}
              onClick={() => setSelectedColor(color)}
              className={`h-12 min-w-12 rounded-full border px-4 text-sm transition-colors ${
                selectedColor === color
                  ? "border-accent bg-accent text-ink"
                  : "border-white/20 text-fg hover:border-fg"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-muted">Quantity</p>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-12 text-center text-lg" aria-live="polite">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {selectedVariant && (
        <p className="text-sm text-muted">
          {selectedVariant.stock_quantity > 0 ? (
            <span className="text-green-400">{selectedVariant.stock_quantity} in stock</span>
          ) : (
            <span className="text-red-400">Out of stock</span>
          )}
        </p>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="button"
        className="btn btn-primary mt-6 w-full max-w-md disabled:opacity-50"
        onClick={handleAddToCart}
        disabled={adding || added || !selectedVariant || outOfStock}
      >
        {adding ? "Adding..." : added ? "Added to cart!" : outOfStock ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
}
