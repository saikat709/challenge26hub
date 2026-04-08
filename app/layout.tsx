import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import Providers from "@/components/providers";
import { BottomNav } from "@/components/shared/BottomNav";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ch26hub | বাংলা আইডিয়া প্ল্যাটফর্ম",
  description: "বাঙালিদের জন্য একটি ক্লিন, স্কেলেবল সোশ্যাল প্রোডাক্ট বোর্ড।",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // console.log("PRISMA MODELS: ", Object.keys(prisma) || "No models found");
  await prisma.$connect()
  
  return (
    <html lang="bn">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 min-h-screen pb-20 md:pb-0`}
      >
        <Providers>
          <Navbar />
          
          <main className="container mx-auto px-4 max-w-4xl lg:max-w-6xl pt-8 pb-12">
            {children}
          </main>

          <div className="mb-20 md:mb-0">
            <Footer />
          </div>
          
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
