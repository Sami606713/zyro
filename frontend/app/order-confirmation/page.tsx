import { OrderSummary } from "@/components/order-summary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order confirmation | Zyro",
};

export default function OrderConfirmationPage() {
  return (
    <main>
      <OrderSummary />
    </main>
  );
}
