"use client";

import Link from "next/link";
import { Menu, X, Plane, Building, MapPin, Car } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="md:hidden p-2 rounded-lg bg-gray-800/80 backdrop-blur-sm text-gray-300 hover:text-white hover:bg-gray-700/80 transition-all duration-200 border border-gray-700"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999999] md:hidden"
          style={{ zIndex: 999999 }}
        >
          {/* Multiple backdrop layers for complete coverage */}
          <div
            className="fixed inset-0 bg-black"
            onClick={onToggle}
            style={{ zIndex: 999990 }}
          />
          <div
            className="fixed inset-0 bg-gray-900"
            style={{ zIndex: 999991 }}
          />

          {/* Full Screen Menu */}
          <div
            className="fixed inset-0 flex flex-col bg-gray-900"
            style={{ zIndex: 999999 }}
          >
            {/* Header */}
            <div
              className="relative flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-900"
              style={{ zIndex: 1000000 }}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">FlightFinder</h3>
              </div>
              <button
                onClick={onToggle}
                className="p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation - Centered Content */}
            <div
              className="relative flex-1 flex flex-col justify-center px-6 bg-gray-900"
              style={{ zIndex: 1000000 }}
            >
              <nav className="space-y-1">
                <div className="mb-8 text-center">
                  <h4 className="text-lg font-semibold text-gray-400 uppercase tracking-wider">
                    Explore Services
                  </h4>
                </div>

                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/"
                      className="flex items-center justify-center space-x-4 py-6 px-6 text-gray-300 hover:text-white hover:bg-gray-800/30 rounded-2xl transition-all duration-300 group border border-gray-700/30 hover:border-blue-500/50"
                      onClick={onToggle}
                    >
                      <Plane className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors group-hover:scale-110 duration-300" />
                      <span className="text-2xl font-semibold">Flights</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/hotels"
                      className="flex items-center justify-center space-x-4 py-6 px-6 text-gray-300 hover:text-white hover:bg-gray-800/30 rounded-2xl transition-all duration-300 group border border-gray-700/30 hover:border-green-500/50"
                      onClick={onToggle}
                    >
                      <Building className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors group-hover:scale-110 duration-300" />
                      <span className="text-2xl font-semibold">Hotels</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/track"
                      className="flex items-center justify-center space-x-4 py-6 px-6 text-gray-300 hover:text-white hover:bg-gray-800/30 rounded-2xl transition-all duration-300 group border border-gray-700/30 hover:border-purple-500/50"
                      onClick={onToggle}
                    >
                      <MapPin className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors group-hover:scale-110 duration-300" />
                      <span className="text-2xl font-semibold">
                        Track Flight
                      </span>
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center justify-center space-x-4 py-6 px-6 text-gray-300 hover:text-white hover:bg-gray-800/30 rounded-2xl transition-all duration-300 group border border-gray-700/30 hover:border-orange-500/50"
                      onClick={onToggle}
                    >
                      <Car className="w-8 h-8 text-orange-400 group-hover:text-orange-300 transition-colors group-hover:scale-110 duration-300" />
                      <span className="text-2xl font-semibold">Car Rental</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Footer */}
            <div
              className="relative p-6 border-t border-gray-700/50 bg-gray-900"
              style={{ zIndex: 1000000 }}
            >
              <div className="flex justify-center space-x-8">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-lg"
                  onClick={onToggle}
                >
                  Help
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-lg"
                  onClick={onToggle}
                >
                  Contact
                </a>
              </div>
              <div className="text-center mt-4">
                <p className="text-gray-500 text-sm">© 2025 FlightFinder</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
