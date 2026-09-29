"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateCartItem, removeFromCart, clearCart, fetchCart } from "@/lib/store/cart-slice";
import { formatPrice } from "@/lib/format";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const auth = useAppSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const sync = () => {
      if (auth.token) {
        dispatch(fetchCart());
      }
    };
    sync();
    window.addEventListener("zyro-cart", sync);
    return () => window.removeEventListener("zyro-cart", sync);
  }, [auth.token, dispatch]);

  useEffect(() => {
    if (open && auth.token) {
      dispatch(fetchCart());
    }
  }, [open, auth.token, dispatch]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleUpdateQty = async (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    await dispatch(updateCartItem({ item_id: itemId, quantity: newQty }));
  };

  const handleRemove = async (itemId: number) => {
    await dispatch(removeFromCart(itemId));
  };

  const handleClear = async () => {
    await dispatch(clearCart());
  };

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close cart" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside
        className={`absolute flex flex-col border-line bg-bg ${
          isMobile
            ? "bottom-0 left-0 right-0 max-h-[85dvh] rounded-t-3xl"
            : "top-0 right-0 h-full w-full max-w-md border-l"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-2xl tracking-[-0.03em]">Cart</h2>
          <div className="flex items-center gap-2">
            {cart.items.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-red-400"
              >
                <Trash2 size={14} />
                Clear
              </button>
            )}
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {cart.loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-5">
            <p className="text-muted">
              Your cart is empty.{" "}
              <Link href="/shop" className="text-accent" onClick={onClose}>
                Shop the floor
              </Link>
            </p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  <Link
                    href={`/products/${item.product_slug}`}
                    onClick={onClose}
                    className="relative h-24 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface"
                  >
                    <Image
                      src={item.image_url || ""}
                      alt={item.product_name}
                      fill
                      sizes="72px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.product_slug}`}
                      onClick={onClose}
                      className="block truncate"
                    >
                      {item.product_name}
                    </Link>
                    <p className="text-sm text-muted">
                      Size {item.size}, Color {item.color}
                    </p>
                    <p className="mt-1">{formatPrice(item.unit_price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-medium">{formatPrice(item.total_price)}</p>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="text-sm text-muted hover:text-red-400"
                      aria-label={`Remove ${item.product_name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-muted">Total</span>
                <span className="text-2xl">{formatPrice(cart.total_amount)}</span>
              </div>
              <Link href="/checkout" onClick={onClose} className="btn btn-primary mt-4 w-full">
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
