import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IdeasClientShell from "@/components/ideas/IdeasClientShell";

export const metadata: Metadata = {
  title: "Ideas · C26Hub",
  description:
    "Browse, search, and vote on thousands of ideas across 26 challenge categories.",
};

export default function IdeasPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 88 }}>
        <IdeasClientShell />
      </main>
      <Footer />
    </>
  );
}
