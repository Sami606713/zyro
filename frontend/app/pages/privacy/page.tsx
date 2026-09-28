import { InfoPage } from "@/components/info-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy policy | Zyro" };

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy policy">
      <p>
        If you write to the shop or join the newsletter, Zyro keeps your name and email so the
        floor can reply or tell you about a new drop.
      </p>
      <p>The site does not sell that information. It is not shared with an ad network from this page.</p>
      <p>To ask for a note to be deleted, message @zyrostore1.</p>
    </InfoPage>
  );
}
