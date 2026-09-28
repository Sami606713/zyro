import { PageName } from "@/components/page-name";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New arrivals | Zyro",
};

export default function Page() {
  return <PageName title="New arrivals" />;
}
