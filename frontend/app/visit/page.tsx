import { Visit } from "@/components/visit";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visit | Zyro",
  description: "Zyro is a men's clothing floor in Haripur.",
};

export default function VisitPage() {
  return (
    <main>
      <Visit />
    </main>
  );
}
