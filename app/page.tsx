"use client";

import { useState } from "react";
import Link from "next/link";
import { Plane, Star, Shield, Clock } from "lucide-react";
import LetterGlitch from "./components/LetterGlitch";
import TextType from "./components/TextType";
import GradientText from "./components/GradientText";
import GlitchText from "./components/GlitchText";
import SearchForm from "./components/SearchForm";
import FlightResults from "./components/FlightResults";
import MobileMenu from "./components/MobileMenu";
import { searchFlights, FlightOffer } from "./services/amadeus";

export default function Home() {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = async (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    tripType: "one-way" | "round-trip";
  }) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const searchParams = {
        originLocationCode: params.origin,
        destinationLocationCode: params.destination,
        departureDate: params.departureDate,
        adults: params.passengers,
        ...(params.returnDate && { returnDate: params.returnDate }),
      };

      const results = await searchFlights(searchParams);
      setFlights(results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background animation hidden while menu open */}
      {!isMobileMenuOpen && (
        <div className="fixed inset-0 z-0">
          <LetterGlitch
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
          />
        </div>
      )}

      {/* Always render header so menu button always available; hide rest below when menu open */}
      <div className="relative z-10">
        <header className="bg-black/30 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Plane className="w-6 h-6 text-white" />
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

              {/* Desktop Navigation (hidden while menu open to avoid duplicate focus) */}
              {!isMobileMenuOpen && (
                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    href="/"
                    className="hover:scale-105 transition-transform border-b-2 border-blue-500"
                  >
                    <GradientText
                      text="Flights"
                      className="text-white"
                      as="span"
                    />
                  </Link>
                  <Link
                    href="/hotels"
                    className="hover:scale-105 transition-transform"
                  >
                    <GradientText
                      text="Hotels"
                      className="text-gray-300 hover:text-white transition-colors"
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
              )}

              <MobileMenu
                isOpen={isMobileMenuOpen}
                onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </div>
        </header>

        {/* Rest of page content hidden when menu open */}
        {!isMobileMenuOpen && (
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
              {/* Hero Section */}
              {!hasSearched && (
                <div className="text-center mb-12">
                  <TextType
                    text={[
                      "Find Your Perfect Flight",
                      "Search the world's airlines",
                      "Book with confidence",
                    ]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
                    as="h2"
                  />
                  <p className="text-white font-medium text-lg mb-8">
                    Discover the best flight deals with our advanced search
                    engine.
                    <br />
                    Compare prices from hundreds of airlines and find your
                    perfect journey.
                  </p>{" "}
                  {/* Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 mb-12">
                    <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:bg-gray-800/60 hover:border-yellow-400/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/10 group cursor-pointer">
                      <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                        Best Prices
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        Compare prices from hundreds of airlines to find the
                        best deals
                      </p>
                    </div>
                    <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:bg-gray-800/60 hover:border-green-400/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-400/10 group cursor-pointer">
                      <Shield className="w-8 h-8 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">
                        Secure Booking
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        Your personal information and payments are always
                        protected
                      </p>
                    </div>
                    <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:bg-gray-800/60 hover:border-blue-400/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-400/10 group cursor-pointer sm:col-span-2 lg:col-span-1">
                      <Clock className="w-8 h-8 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        24/7 Support
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        Get help anytime with our round-the-clock customer
                        support
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Form */}
              <div className="mb-8">
                <SearchForm onSearch={handleSearch} isLoading={isLoading} />
              </div>

              {/* Results */}
              {hasSearched && (
                <FlightResults
                  flights={flights}
                  isLoading={isLoading}
                  error={error}
                />
              )}
            </main>

            {/* Footer provided globally in layout */}
          </div>
        )}
      </div>
    </div>
  );
}
