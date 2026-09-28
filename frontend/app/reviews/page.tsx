import { PageName } from "@/components/page-name";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews | Zyro",
};

export default function Page() {
  return <PageName title="Reviews" />;
}
