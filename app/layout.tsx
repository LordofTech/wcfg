import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WCFG Luxury Automobile Brokers",
    template: "%s | WCFG Luxury Automobile Brokers",
  },
  description:
    "Luxury vehicles. Personally sourced. Professionally delivered. Concierge-level automobile brokerage.",
  keywords: [
    "luxury cars",
    "automobile broker",
    "vehicle sourcing",
    "concierge car buying",
    "WCFG",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-pitch text-ivory font-sans font-light">
        {children}
      </body>
    </html>
  );
}
