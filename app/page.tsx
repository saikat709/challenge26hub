import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedBusinesses from "@/components/home/FeaturedBusinesses";
import WhySection from "@/components/home/WhySection";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedBusinesses />
        <WhySection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
