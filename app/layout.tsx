import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import { Providers } from "@/app/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Challenge26 Business Hub",
  description:
    "A collaborative hub for creating, sharing, and showcasing businesses across every category.",
  keywords: ["business", "startup", "collaboration", "innovation", "community"],
  authors: [{ name: "Challenge26 Team" }],
  openGraph: {
    title: "Challenge26 Business Hub",
    description: "Launch and discover bold brands in minutes.",
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
