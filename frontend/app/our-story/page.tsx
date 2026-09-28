import { PageName } from "@/components/page-name";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our story | Zyro",
};

export default function Page() {
  return <PageName title="Our story" />;
}
