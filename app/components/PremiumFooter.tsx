"use client";

export default function PremiumFooter() {
  return (
    <footer className="relative border-t border-gray-800/80 bg-[radial-gradient(circle_at_top,rgba(30,30,40,0.6),rgba(10,10,15,0.95))] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center space-y-3">
          <p className="text-sm md:text-base font-medium bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent tracking-wide">
            © 2025 FlightFinder. All rights reserved. Powered by Amadeus API.
          </p>
          <p className="text-xs md:text-sm text-gray-400 font-medium tracking-wide">
            Made by Amaney Hussain
          </p>
        </div>
      </div>
      {/* subtle top glow */}
      <div className="pointer-events-none absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
    </footer>
  );
}
