import { InfoPage } from "@/components/info-page";
import { TrackForm } from "@/components/track-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Track order | Zyro" };

export default function TrackOrderPage() {
  return (
    <InfoPage title="Track order">
      <p>Zyro does not hand orders to a public tracking page. The shop tells you when a piece is ready.</p>
      <TrackForm />
    </InfoPage>
  );
}
