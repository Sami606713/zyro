import { CheckoutForm } from "@/components/checkout-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Zyro",
};

export default function CheckoutPage() {
  return (
    <main>
      <CheckoutForm />
    </main>
  );
}
