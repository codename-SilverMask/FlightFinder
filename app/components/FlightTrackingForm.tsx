"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Plane, Calendar } from "lucide-react";
import { parseFlightNumber } from "../services/flightTracking";
import { format } from "date-fns";

interface FlightTrackingFormProps {
  onTrack: (params: {
    carrierCode: string;
    flightNumber: string;
    scheduledDepartureDate: string;
  }) => void;
  isLoading: boolean;
}

export default function FlightTrackingForm({
  onTrack,
  isLoading,
}: FlightTrackingFormProps) {
  const [flightNumber, setFlightNumber] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const flightNumberRef = useRef<HTMLInputElement>(null);

  // Set default date to today
  useEffect(() => {
    const today = new Date();
    setDepartureDate(format(today, "yyyy-MM-dd"));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!flightNumber || !departureDate) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const { carrierCode, flightNumber: flightNum } =
        parseFlightNumber(flightNumber);

      onTrack({
        carrierCode,
        flightNumber: flightNum,
        scheduledDepartureDate: departureDate,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid flight number format"
      );
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800">
      <div className="flex items-center space-x-3 mb-6">
        <Plane className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Track Flight</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Flight Number and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Flight Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Flight Number
            </label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={flightNumberRef}
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="e.g., AA123, Delta 456"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Enter airline code + number (e.g., AA123, DL456)
            </p>
          </div>

          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Departure Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Search Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Tracking Flight...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Track Flight</span>
            </>
          )}
        </button>
      </form>

      {/* Help Section */}
      <div className="mt-6 bg-blue-900/20 rounded-lg p-4 border border-blue-800">
        <h3 className="text-blue-400 font-medium mb-2">
          How to track your flight:
        </h3>
        <ul className="text-sm text-blue-300 space-y-1">
          <li>• Enter your flight number (e.g., AA123, Delta 456)</li>
          <li>• Select the departure date</li>
          <li>• Get real-time status, delays, and gate information</li>
        </ul>
      </div>
    </div>
  );
}
