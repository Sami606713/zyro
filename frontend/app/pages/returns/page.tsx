import { InfoPage } from "@/components/info-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns & exchanges | Zyro" };

export default function ReturnsPage() {
  return (
    <InfoPage title="Returns & exchanges">
      <p>Unworn pieces with tags can be exchanged within 7 days of pickup.</p>
      <p>Washed, altered, or damaged pieces stay with you.</p>
      <p>Bring the piece back to the Haripur floor, or message @zyrostore1 with your order name and photos.</p>
    </InfoPage>
  );
}
