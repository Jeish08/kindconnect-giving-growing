import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturedCausesSection from "@/components/home/FeaturedCausesSection";
import ImpactStatsSection from "@/components/home/ImpactStatsSection";
import VolunteerSection from "@/components/home/VolunteerSection";
import NGOSection from "@/components/home/NGOSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturedCausesSection />
        <ImpactStatsSection />
        <VolunteerSection />
        <NGOSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
