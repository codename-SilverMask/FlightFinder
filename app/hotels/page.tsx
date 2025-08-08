"use client";

import { useState } from "react";
import { Building, Star, Shield, Clock } from "lucide-react";
import LetterGlitch from "../components/LetterGlitch";
import TextType from "../components/TextType";
import GradientText from "../components/GradientText";
import GlitchText from "../components/GlitchText";
import HotelSearchForm from "../components/HotelSearchForm";
import HotelResults from "../components/HotelResults";
import MobileMenu from "../components/MobileMenu";
import { searchHotels, HotelOffer } from "../services/hotels";
import Link from "next/link";

export default function HotelsPage() {
  const [hotels, setHotels] = useState<HotelOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = async (params: {
    cityCode: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    radius: number;
  }) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const searchParams = {
        cityCode: params.cityCode,
        checkInDate: params.checkInDate,
        checkOutDate: params.checkOutDate,
        adults: params.adults,
        radius: params.radius,
        radiusUnit: "KM" as const,
      };

      const results = await searchHotels(searchParams);
      setHotels(results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Animation */}
      <div className="fixed inset-0 z-0">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <GlitchText
                  speed={1}
                  enableShadows={true}
                  enableOnHover={true}
                  className="text-2xl font-bold"
                >
                  FlightFinder
                </GlitchText>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="hover:scale-105 transition-transform">
                  <GradientText
                    text="Flights"
                    className="text-gray-300 hover:text-white transition-colors"
                    as="span"
                  />
                </Link>
                <Link
                  href="/hotels"
                  className="hover:scale-105 transition-transform border-b-2 border-green-500"
                >
                  <GradientText
                    text="Hotels"
                    className="text-white"
                    as="span"
                  />
                </Link>
                <Link
                  href="/track"
                  className="hover:scale-105 transition-transform"
                >
                  <GradientText
                    text="Track Flight"
                    className="text-gray-300 hover:text-white transition-colors"
                    as="span"
                  />
                </Link>
              </nav>

              {/* Mobile Menu */}
              <MobileMenu
                isOpen={isMobileMenuOpen}
                onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          {!hasSearched && (
            <div className="text-center mb-12">
              <TextType
                text={[
                  "Find Perfect Hotels",
                  "Discover amazing hotels worldwide",
                  "Book your perfect stay",
                ]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
                as="h2"
              />
              <p className="text-lg sm:text-xl text-white font-medium mb-8 max-w-2xl mx-auto">
                Discover amazing hotels worldwide with the best prices and
                amenities. Book your perfect stay with confidence.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 mb-12">
                <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:bg-gray-800/60 hover:border-yellow-400/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/10 group cursor-pointer">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                    Best Rates
                  </h3>
                  <p className="text-white font-medium group-hover:text-gray-200 transition-colors">
                    Compare prices from top booking sites to find the best hotel
                    deals
                  </p>
                </div>
                <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:bg-gray-800/60 hover:border-green-400/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-400/10 group cursor-pointer">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">
                    Secure Booking
                  </h3>
                  <p className="text-white font-medium group-hover:text-gray-200 transition-colors">
                    Your reservations and payments are always protected and
                    secure
                  </p>
                </div>
                <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:bg-gray-800/60 hover:border-blue-400/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-400/10 group cursor-pointer sm:col-span-2 lg:col-span-1">
                  <Clock className="w-8 h-8 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    Instant Confirmation
                  </h3>
                  <p className="text-white font-medium group-hover:text-gray-200 transition-colors">
                    Get immediate booking confirmation and 24/7 customer support
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search Form */}
          <div className="mb-8">
            <HotelSearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Results */}
          {hasSearched && (
            <HotelResults hotels={hotels} isLoading={isLoading} error={error} />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-black/30 backdrop-blur-sm border-t border-gray-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <GlitchText
                    speed={1}
                    enableShadows={true}
                    enableOnHover={true}
                    className="text-lg font-bold"
                  >
                    FlightFinder
                  </GlitchText>
                </div>
                <p className="text-gray-400 text-sm">
                  Your trusted partner for finding the best travel deals
                  worldwide.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Press
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">Services</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Flight Search
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/hotels"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Hotel Booking
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Car Rental
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Travel Insurance
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2025 FlightFinder. All rights reserved. Powered by Amadeus
                API.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Made by Amaney Hussain
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
