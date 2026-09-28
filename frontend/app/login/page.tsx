import { PageName } from "@/components/page-name";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Zyro",
};

export default function Page() {
  return <PageName title="Login" />;
}
