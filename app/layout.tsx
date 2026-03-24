import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Challenge26 Ideas Hub",
  description:
    "A collaborative hub for exploring, sharing, and voting on challenge ideas across 26 categories.",
  keywords: ["challenge", "ideas", "collaboration", "innovation", "community"],
  authors: [{ name: "Challenge26 Team" }],
  openGraph: {
    title: "Challenge26 Ideas Hub",
    description: "Shape tomorrow, one idea at a time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
