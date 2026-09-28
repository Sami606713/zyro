import { Collection } from "@/components/collection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The edit | Zyro",
  description: "Overshirts, trousers, and belts from the Zyro floor in Haripur.",
};

export default function EditPage() {
  return (
    <main>
      <Collection />
    </main>
  );
}
