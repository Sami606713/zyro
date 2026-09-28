import { PageName } from "@/components/page-name";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping policy | Zyro",
};

export default function Page() {
  return <PageName title="Shipping policy" />;
}
