import { PageName } from "@/components/page-name";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best sellers | Zyro",
};

export default function Page() {
  return <PageName title="Best sellers" />;
}
