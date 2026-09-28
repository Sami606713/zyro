import { ContactForm } from "@/components/contact-form";
import { InfoPage } from "@/components/info-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact | Zyro" };

export default function ContactPage() {
  return (
    <InfoPage title="Get in touch">
      <p>Zyro is in Haripur. The public line for the shop is Instagram, @zyrostore1.</p>
      <p>A phone number and a shop email are not published yet.</p>
      <ContactForm />
    </InfoPage>
  );
}
