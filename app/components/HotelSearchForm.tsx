"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, Users, Building } from "lucide-react";
import { getLocationSuggestions } from "../services/amadeus";
import { getCityCodeFromLocation } from "../services/hotels";
import { format } from "date-fns";

interface LocationSuggestion {
  id: string;
  name: string;
  iataCode: string;
  address: {
    cityName: string;
    countryName: string;
  };
}

interface HotelSearchFormProps {
  onSearch: (params: {
    cityCode: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    radius: number;
  }) => void;
  isLoading: boolean;
}

export default function HotelSearchForm({
  onSearch,
  isLoading,
}: HotelSearchFormProps) {
  const [location, setLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [radius, setRadius] = useState(5);

  // Location suggestions state
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const locationRef = useRef<HTMLInputElement>(null);

  // Set default dates
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3);

    setCheckInDate(format(tomorrow, "yyyy-MM-dd"));
    setCheckOutDate(format(dayAfter, "yyyy-MM-dd"));
  }, []);

  // Debounced location search
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (location.length > 2) {
        try {
          const suggestions = await getLocationSuggestions(location);
          setLocationSuggestions(suggestions.slice(0, 5));
        } catch (error) {
          console.error("Error fetching location suggestions:", error);
        }
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!location || !checkInDate || !checkOutDate) {
      alert("Please fill in all required fields");
      return;
    }

    // Extract city code
    const extractCityCode = (input: string) => {
      const match = input.match(/\(([A-Z]{3})\)$/);
      if (match) {
        return match[1];
      }
      return getCityCodeFromLocation(input);
    };

    const cityCode = extractCityCode(location);
    console.log(
      "Hotel search - extracted city code:",
      cityCode,
      "from location:",
      location
    );

    onSearch({
      cityCode,
      checkInDate,
      checkOutDate,
      adults,
      radius,
    });
  };

  const selectLocation = (suggestion: LocationSuggestion) => {
    setLocation(`${suggestion.address.cityName} (${suggestion.iataCode})`);
    setShowLocationSuggestions(false);
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800">
      <div className="flex items-center space-x-3 mb-6">
        <Building className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Find Hotels</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location and Date Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <div className="relative lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={locationRef}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowLocationSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowLocationSuggestions(false), 200)
                }
                placeholder="City or destination"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                {locationSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => selectLocation(suggestion)}
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
            {location && !location.includes("(") && (
              <p className="text-xs text-yellow-400 mt-1">
                💡 Select from suggestions for better results
              </p>
            )}
          </div>

          {/* Check-in Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Check In
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Check-out Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Check Out
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate || format(new Date(), "yyyy-MM-dd")}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Adults */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Adults
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[...Array(8)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? "Adult" : "Adults"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Radius (km)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 km</option>
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
                <option value={50}>50 km</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Searching hotels...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Search Hotels</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
