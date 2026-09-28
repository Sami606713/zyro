import { PageName } from "@/components/page-name";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offers | Zyro",
};

export default function Page() {
  return <PageName title="Offers" />;
}
