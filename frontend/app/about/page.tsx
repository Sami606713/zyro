import { InfoPage } from "@/components/info-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About us | Zyro" };

export default function AboutPage() {
  return (
    <InfoPage title="About us">
      <p>
        Zyro is a men&apos;s clothing floor in Haripur. The line is apparel, bottomwear, and
        accessories, cut to be worn on an ordinary day.
      </p>
      <p>The name on the door is the line on the clothes: designed to define you.</p>
      <p>
        New pieces are shown first on Instagram at @zyrostore1, then put out on the floor.
      </p>
    </InfoPage>
  );
}
