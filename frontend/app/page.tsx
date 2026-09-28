import { Announcement } from "@/components/home/announcement";
import { Benefits } from "@/components/home/benefits";
import { BestSellers } from "@/components/home/bestsellers";
import { BrandStory } from "@/components/home/brand-story";
import { Categories } from "@/components/home/categories";
import { FaqSection } from "@/components/home/faq-section";
import { FeatureBanner } from "@/components/home/feature-banner";
import { Instagram } from "@/components/home/instagram";
import { NewArrivals } from "@/components/home/new-arrivals";
import { NewsletterBand } from "@/components/home/newsletter-band";
import { Reviews } from "@/components/home/reviews";
import { ShopTheLook } from "@/components/home/shop-the-look";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main>
      <Announcement />
      <Hero />
      <Categories />
      <NewArrivals />
      <FeatureBanner />
      <BestSellers />
      <ShopTheLook />
      <BrandStory />
      <Benefits />
      <Reviews />
      <Instagram />
      <NewsletterBand />
      <FaqSection />
    </main>
  );
}
