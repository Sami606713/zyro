import { CartView } from "@/components/cart-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart | Zyro",
};

export default function CartPage() {
  return (
    <main className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[900px]">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Cart</h1>
        <CartView />
      </div>
    </main>
  );
}
