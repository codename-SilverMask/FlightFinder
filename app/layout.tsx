import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PremiumFooter from "./components/PremiumFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlightFinder - Search & Book Flights",
  description:
    "Find and compare flights from airlines worldwide. Search for the best deals on flights and book your next trip with ease.",
  keywords:
    "flights, airline tickets, flight search, travel, booking, cheap flights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="flex-1 flex flex-col">{children}</div>
        <PremiumFooter />
      </body>
    </html>
  );
}
