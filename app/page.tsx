import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedBusinesses from "@/components/home/FeaturedBusinesses";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedBusinesses />
      </main>
      <Footer />
    </>
  );
}
