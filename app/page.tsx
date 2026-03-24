import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedIdeas from "@/components/home/FeaturedIdeas";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedIdeas />
      </main>
      <Footer />
    </>
  );
}
