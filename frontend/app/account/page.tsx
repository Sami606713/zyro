import { InfoPage } from "@/components/info-page";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Account | Zyro" };

export default function AccountPage() {
  return (
    <InfoPage title="Account">
      <p>Sign-in is not open on this site yet. The shop keeps orders under your name on Instagram.</p>
      <p>
        <Link href="/contact" className="text-fg underline underline-offset-4 hover:text-accent">
          Get in touch
        </Link>{" "}
        or message @zyrostore1 with the piece you want held.
      </p>
    </InfoPage>
  );
}
