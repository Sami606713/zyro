import { DeskHeading } from "@/components/admin/desk-heading";
import { ProductBoard } from "@/components/admin/product-board";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Zyro desk",
};

export default function AdminProductsPage() {
  return (
    <div>
      <DeskHeading
        kicker="Products"
        title="What is on the floor."
        detail="The same pieces the shop already lists. Marked down means the catalog has a compare-at price."
      />
      <ProductBoard />
    </div>
  );
}
