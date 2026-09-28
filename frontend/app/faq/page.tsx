import { InfoPage } from "@/components/info-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQs | Zyro" };

const questions = [
  {
    q: "Where is the shop?",
    a: "Zyro is in Haripur, Khyber Pakhtunkhwa. A street address is not published. Ask @zyrostore1 for the current floor.",
  },
  {
    q: "What do you sell?",
    a: "Men's apparel, bottomwear, outerwear, and accessories.",
  },
  {
    q: "How do I order?",
    a: "Choose a piece on the site, then message @zyrostore1 with the name and your size. The shop confirms stock before you pay.",
  },
  {
    q: "Can I return a piece?",
    a: "Unworn items with tags can be exchanged within 7 days. See Returns & exchanges.",
  },
];

export default function FaqPage() {
  return (
    <InfoPage title="FAQs">
      {questions.map((item) => (
        <div key={item.q}>
          <h2 className="text-base text-fg">{item.q}</h2>
          <p className="mt-2">{item.a}</p>
        </div>
      ))}
    </InfoPage>
  );
}
