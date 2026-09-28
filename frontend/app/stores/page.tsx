import { InfoPage } from "@/components/info-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Store locator | Zyro" };

export default function StoresPage() {
  return (
    <InfoPage title="Store locator">
      <p>Zyro has one floor.</p>
      <p>Haripur, Khyber Pakhtunkhwa, Pakistan.</p>
      <p>
        The shop has not published a street number or opening hours. Message @zyrostore1 and
        they will point you to the door.
      </p>
    </InfoPage>
  );
}
