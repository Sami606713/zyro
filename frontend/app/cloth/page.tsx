import { Cloth } from "@/components/cloth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cloth | Zyro",
  description: "Plain weaves and cuts from Zyro in Haripur.",
};

export default function ClothPage() {
  return (
    <main>
      <Cloth />
    </main>
  );
}
