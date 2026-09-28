import { InfoPage } from "@/components/info-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of service | Zyro" };

export default function TermsPage() {
  return (
    <InfoPage title="Terms of service">
      <p>Prices on the site are display prices for the Haripur floor. A piece is yours after the shop confirms it is in stock.</p>
      <p>Colour on a screen can shift from the cloth in hand. The shop will say if a size is gone.</p>
      <p>Returns follow the returns page: 7 days, unworn, tags on.</p>
    </InfoPage>
  );
}
