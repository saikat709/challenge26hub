import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandImagesClient from "@/components/businesses/BrandImagesClient";

export const metadata: Metadata = {
  title: "Brand Images · C26Hub",
  description: "View business logos and cover photos shared by the community.",
};

export default function BrandImagesPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 88 }}>
        <BrandImagesClient />
      </main>
      <Footer />
    </>
  );
}
