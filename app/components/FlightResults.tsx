"use client";

import { Plane } from "lucide-react";
import { FlightOffer } from "../services/amadeus";
import { format } from "date-fns";

interface FlightResultsProps {
  flights: FlightOffer[];
  isLoading: boolean;
  error: string | null;
}

const getAirlineName = (code: string): string => {
  const airlines: { [key: string]: string } = {
    AA: "American Airlines",
    AC: "Air Canada",
    AF: "Air France",
    BA: "British Airways",
    DL: "Delta Air Lines",
    EK: "Emirates",
    KL: "KLM",
    LH: "Lufthansa",
    QR: "Qatar Airways",
    TK: "Turkish Airlines",
    UA: "United Airlines",
    VS: "Virgin Atlantic",
    WN: "Southwest Airlines",
    B6: "JetBlue Airways",
    AS: "Alaska Airlines",
    F9: "Frontier Airlines",
    NK: "Spirit Airlines",
    G4: "Allegiant Air",
    SY: "Sun Country Airlines",
    HA: "Hawaiian Airlines",
  };

  return airlines[code] || code;
};

const formatTime = (dateTimeString: string): string => {
  try {
    const date = new Date(dateTimeString);
    return format(date, "HH:mm");
  } catch {
    return dateTimeString;
  }
};

const formatDuration = (duration: string): string => {
  // Duration format: PT4H30M
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;

  if (hours && minutes) {
    return `${hours}h ${minutes}m`;
  } else if (hours) {
    return `${hours}h`;
  } else if (minutes) {
    return `${minutes}m`;
  }
  return duration;
};

const getStopsText = (numberOfStops: number): string => {
  if (numberOfStops === 0) return "Nonstop";
  if (numberOfStops === 1) return "1 stop";
  return `${numberOfStops} stops`;
};

export default function FlightResults({
  flights,
  isLoading,
  error,
}: FlightResultsProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-800">
        <div className="flex items-center justify-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-300">Searching for the best flights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-red-800">
        <div className="text-center">
          <div className="bg-red-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Plane className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">
            Search Error
          </h3>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-800">
        <div className="text-center">
          <div className="bg-gray-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Plane className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No flights found
          </h3>
          <p className="text-gray-400">
            Try adjusting your search criteria or dates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {flights.length} flight{flights.length !== 1 ? "s" : ""} found
        </h2>
        <p className="text-gray-400">Prices shown are per person</p>
      </div>

      {flights.map((flight) => (
        <div
          key={flight.id}
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800 hover:border-gray-700 transition-all duration-200"
        >
          {flight.itineraries.map((itinerary, itineraryIndex) => (
            <div
              key={itineraryIndex}
              className={
                itineraryIndex > 0 ? "mt-6 pt-6 border-t border-gray-700" : ""
              }
            >
              {/* Itinerary Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Plane className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 font-medium">
                    {itineraryIndex === 0 ? "Outbound" : "Return"}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-300">
                    {formatDuration(itinerary.duration)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {getStopsText(
                      itinerary.segments.reduce(
                        (total, segment) => total + segment.numberOfStops,
                        0
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Flight Segments */}
              <div className="space-y-4">
                {itinerary.segments.map((segment, segmentIndex) => (
                  <div key={segment.id} className="relative">
                    {/* Segment Details */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        {/* Departure */}
                        <div className="text-center md:text-left">
                          <div className="text-2xl font-bold text-white">
                            {formatTime(segment.departure.at)}
                          </div>
                          <div className="text-gray-300 font-medium">
                            {segment.departure.iataCode}
                          </div>
                          <div className="text-sm text-gray-400">
                            {segment.departure.terminal &&
                              `Terminal ${segment.departure.terminal}`}
                          </div>
                        </div>

                        {/* Flight Info */}
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div className="flex-1 h-px bg-gray-600"></div>
                            <Plane className="w-4 h-4 text-blue-400" />
                            <div className="flex-1 h-px bg-gray-600"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          </div>
                          <div className="text-sm font-medium text-gray-300">
                            {getAirlineName(segment.carrierCode)}{" "}
                            {segment.number}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDuration(segment.duration)}
                          </div>
                          {segment.numberOfStops > 0 && (
                            <div className="text-xs text-yellow-400 mt-1">
                              {getStopsText(segment.numberOfStops)}
                            </div>
                          )}
                        </div>

                        {/* Arrival */}
                        <div className="text-center md:text-right">
                          <div className="text-2xl font-bold text-white">
                            {formatTime(segment.arrival.at)}
                          </div>
                          <div className="text-gray-300 font-medium">
                            {segment.arrival.iataCode}
                          </div>
                          <div className="text-sm text-gray-400">
                            {segment.arrival.terminal &&
                              `Terminal ${segment.arrival.terminal}`}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Layover indicator */}
                    {segmentIndex < itinerary.segments.length - 1 && (
                      <div className="flex items-center justify-center my-2">
                        <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
                          Layover
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Price and Book Section */}
          <div className="mt-6 pt-6 border-t border-gray-700 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-gray-400">
                {flight.travelerPricings[0]?.fareOption} •{" "}
                {flight.travelerPricings.length} passenger
                {flight.travelerPricings.length !== 1 ? "s" : ""}
              </div>
              <div className="text-xs text-gray-500">
                Validating airline:{" "}
                {getAirlineName(flight.validatingAirlineCodes[0])}
              </div>
              {flight.numberOfBookableSeats <= 5 && (
                <div className="text-xs text-orange-400">
                  Only {flight.numberOfBookableSeats} seats left at this price
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">
                {flight.price.currency} {flight.price.total}
              </div>
              <div className="text-sm text-gray-400 mb-3">
                Total price for all passengers
              </div>
              <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02]">
                Select Flight
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
