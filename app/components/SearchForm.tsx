"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { getLocationSuggestions } from "../services/amadeus";
import { format } from "date-fns";

interface SearchFormProps {
  onSearch: (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    tripType: "one-way" | "round-trip";
  }) => void;
  isLoading: boolean;
}

interface LocationSuggestion {
  id: string;
  name: string;
  iataCode: string;
  address: {
    cityName: string;
    countryName: string;
  };
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [tripType, setTripType] = useState<"one-way" | "round-trip">(
    "round-trip"
  );
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  // Location suggestions state
  const [originSuggestions, setOriginSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);

  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  // Set default dates
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);

    setDepartureDate(format(tomorrow, "yyyy-MM-dd"));
    setReturnDate(format(nextWeek, "yyyy-MM-dd"));
  }, []);

  // Debounced location search
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (origin.length > 2) {
        try {
          const suggestions = await getLocationSuggestions(origin);
          setOriginSuggestions(suggestions.slice(0, 5));
        } catch (error) {
          console.error("Error fetching origin suggestions:", error);
        }
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [origin]);

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (destination.length > 2) {
        try {
          const suggestions = await getLocationSuggestions(destination);
          setDestinationSuggestions(suggestions.slice(0, 5));
        } catch (error) {
          console.error("Error fetching destination suggestions:", error);
        }
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [destination]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !destination || !departureDate) {
      alert("Please fill in all required fields");
      return;
    }

    // Extract IATA code if it's in the format "City (CODE)"
    const extractIataCode = (input: string) => {
      const match = input.match(/\(([A-Z]{3})\)$/);
      return match ? match[1] : input.toUpperCase();
    };

    onSearch({
      origin: extractIataCode(origin),
      destination: extractIataCode(destination),
      departureDate,
      returnDate: tripType === "round-trip" ? returnDate : undefined,
      passengers,
      tripType,
    });
  };

  const selectOrigin = (suggestion: LocationSuggestion) => {
    setOrigin(`${suggestion.address.cityName} (${suggestion.iataCode})`);
    setShowOriginSuggestions(false);
  };

  const selectDestination = (suggestion: LocationSuggestion) => {
    setDestination(`${suggestion.address.cityName} (${suggestion.iataCode})`);
    setShowDestinationSuggestions(false);
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type Toggle */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setTripType("round-trip")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              tripType === "round-trip"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Round Trip
          </button>
          <button
            type="button"
            onClick={() => setTripType("one-way")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              tripType === "one-way"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            One Way
          </button>
        </div>

        {/* Location and Date Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Origin */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              From
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={originRef}
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                onFocus={() => setShowOriginSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowOriginSuggestions(false), 200)
                }
                placeholder="City or airport"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {showOriginSuggestions && originSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                {originSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => selectOrigin(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 text-white text-sm border-b border-gray-700 last:border-b-0"
                  >
                    <div className="font-medium">
                      {suggestion.address.cityName} ({suggestion.iataCode})
                    </div>
                    <div className="text-gray-400 text-xs">
                      {suggestion.name}, {suggestion.address.countryName}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              To
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={destinationRef}
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setShowDestinationSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowDestinationSuggestions(false), 200)
                }
                placeholder="City or airport"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {showDestinationSuggestions &&
              destinationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                  {destinationSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => selectDestination(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-700 text-white text-sm border-b border-gray-700 last:border-b-0"
                    >
                      <div className="font-medium">
                        {suggestion.address.cityName} ({suggestion.iataCode})
                      </div>
                      <div className="text-gray-400 text-xs">
                        {suggestion.name}, {suggestion.address.countryName}
                      </div>
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Departure
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Return Date */}
          {tripType === "round-trip" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Return
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || format(new Date(), "yyyy-MM-dd")}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Passengers (only show if round-trip to fill the grid, otherwise on new row) */}
          {tripType === "round-trip" && (
            <div className="lg:col-start-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Passengers
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[...Array(9)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? "Adult" : "Adults"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Passengers for one-way */}
        {tripType === "one-way" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Passengers
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[...Array(9)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? "Adult" : "Adults"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Searching flights...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Search Flights</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
