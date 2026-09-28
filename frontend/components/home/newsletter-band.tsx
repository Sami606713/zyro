import { NewsletterForm } from "@/components/newsletter-form";

export function NewsletterBand() {
  return (
    <section className="border-y border-line bg-surface px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div>
          <h2 className="font-display max-w-[12ch] text-4xl leading-[1.05] font-semibold tracking-[-0.04em] md:text-6xl">
            The next drop
          </h2>
          <p className="mt-4 max-w-[36ch] text-muted">Leave an email and the floor can tell you when new pieces land.</p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
