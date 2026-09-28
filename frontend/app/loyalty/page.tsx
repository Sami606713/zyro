import { PageName } from "@/components/page-name";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loyalty program | Zyro",
};

export default function Page() {
  return <PageName title="Loyalty program" />;
}
