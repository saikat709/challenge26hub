import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessesClientShell from "@/components/businesses/BusinessesClientShell";

export const metadata: Metadata = {
  title: "Businesses · C26Hub",
  description: "Discover, search, and share businesses with logos, covers, and QR links.",
};

export default function BusinessesPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 88 }}>
        <BusinessesClientShell />
      </main>
      <Footer />
    </>
  );
}
