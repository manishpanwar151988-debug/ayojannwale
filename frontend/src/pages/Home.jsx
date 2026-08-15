import Hero from "@/components/home/Hero";
import EditorialMarquee from "@/components/home/EditorialMarquee";
import CategoryGrid from "@/components/home/CategoryGrid";
import EventTypes from "@/components/home/EventTypes";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import PlanJourney from "@/components/home/PlanJourney";
import YourChoice from "@/components/home/YourChoice";
import TrustPillars from "@/components/home/TrustPillars";
import Ideas from "@/components/home/Ideas";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <main data-testid="home-page">
      <Hero />
      <EditorialMarquee />
      <CategoryGrid />
      <EventTypes />
      <HowItWorks />
      <FeaturedVendors />
      <PlanJourney />
      <YourChoice />
      <TrustPillars />
      <Ideas />
      <FinalCTA />
    </main>
  );
}
