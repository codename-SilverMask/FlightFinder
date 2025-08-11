"use client";

import { useState } from "react";
import Link from "next/link";
import { Plane, Activity, Clock, TrendingUp } from "lucide-react";
import LetterGlitch from "../components/LetterGlitch";
import TextType from "../components/TextType";
import GradientText from "../components/GradientText";
import GlitchText from "../components/GlitchText";
import FlightTrackingForm from "../components/FlightTrackingForm";
import FlightTrackingResults from "../components/FlightTrackingResults";
import MobileMenu from "../components/MobileMenu";
import { trackFlight, FlightStatus } from "../services/flightTracking";

export default function FlightTrackingPage() {
  const [flights, setFlights] = useState<FlightStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTrack = async (params: {
    carrierCode: string;
    flightNumber: string;
    scheduledDepartureDate: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await trackFlight(params);
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
      {/* Background Animation hidden when menu open */}
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

      {/* Header always present so menu toggle isn't removed */}
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
              {!isMobileMenuOpen && (
                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    href="/"
                    className="hover:scale-105 transition-transform"
                  >
                    <GradientText
                      text="Flights"
                      className="text-gray-300 hover:text-white transition-colors"
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
                    className="hover:scale-105 transition-transform border-b-2 border-blue-500"
                  >
                    <GradientText
                      text="Track Flight"
                      className="text-white"
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
      </div>

      {/* Main + footer hidden while menu open */}
      {!isMobileMenuOpen && (
        <div className="relative z-10 flex flex-col min-h-screen">
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {!hasSearched && (
              <div className="text-center mb-12">
                <TextType
                  text={[
                    "Track Your Flight",
                    "Get real-time updates",
                    "Stay informed every step",
                  ]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="|"
                  className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
                  as="h2"
                />
                <div className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto min-h-[4rem] flex items-center justify-center">
                  <p className="text-white font-medium">
                    Get real-time updates on flight status, delays, gate
                    changes, and more. Stay informed about your journey every
                    step of the way.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 mb-12">
                  <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:bg-gray-800/60 hover:border-blue-400/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-400/10 group cursor-pointer">
                    <Activity className="w-8 h-8 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      Real-time Status
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                      Get live updates on departures, arrivals, and delays
                    </p>
                  </div>
                  <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:bg-gray-800/60 hover:border-yellow-400/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/10 group cursor-pointer">
                    <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                      Gate Information
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                      Terminal and gate details updated in real-time
                    </p>
                  </div>
                  <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:bg-gray-800/60 hover:border-green-400/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-400/10 group cursor-pointer sm:col-span-2 lg:col-span-1">
                    <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">
                      Delay Predictions
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                      AI-powered predictions to help you plan ahead
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="mb-8">
              <FlightTrackingForm onTrack={handleTrack} isLoading={isLoading} />
            </div>
            {hasSearched && (
              <FlightTrackingResults
                flights={flights}
                isLoading={isLoading}
                error={error}
              />
            )}
          </main>
          {/* Global footer in layout */}
        </div>
      )}
    </div>
  );
}
