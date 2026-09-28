import { DeskHeading } from "@/components/admin/desk-heading";
import { OrdersBoard } from "@/components/admin/orders-board";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | Zyro desk",
};

export default function AdminOrdersPage() {
  return (
    <div>
      <DeskHeading
        kicker="Orders"
        title="The order book."
        detail="Five sample tickets. Filter by state. These names are not customers of a live register."
      />
      <OrdersBoard />
    </div>
  );
}
