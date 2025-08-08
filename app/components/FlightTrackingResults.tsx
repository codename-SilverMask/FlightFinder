"use client";

import {
  Plane,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Navigation,
} from "lucide-react";
import {
  FlightStatus,
  getFlightStatusColor,
  formatTimingQualifier,
} from "../services/flightTracking";
import { format } from "date-fns";

interface FlightTrackingResultsProps {
  flights: FlightStatus[];
  isLoading: boolean;
  error: string | null;
}

const formatTime = (timestamp: string) => {
  try {
    return format(new Date(timestamp), "HH:mm");
  } catch {
    return timestamp;
  }
};

const formatDate = (timestamp: string) => {
  try {
    return format(new Date(timestamp), "MMM dd, yyyy");
  } catch {
    return timestamp;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "SCHEDULED":
      return <Clock className="w-5 h-5" />;
    case "ACTIVE":
      return <Plane className="w-5 h-5" />;
    case "LANDED":
      return <CheckCircle className="w-5 h-5" />;
    case "DELAYED":
      return <AlertTriangle className="w-5 h-5" />;
    case "CANCELLED":
      return <XCircle className="w-5 h-5" />;
    case "DIVERTED":
      return <Navigation className="w-5 h-5" />;
    default:
      return <Plane className="w-5 h-5" />;
  }
};

export default function FlightTrackingResults({
  flights,
  isLoading,
  error,
}: FlightTrackingResultsProps) {
  console.log("FlightTrackingResults received:", { flights, isLoading, error });
  if (flights.length > 0) {
    console.log("First flight structure:", flights[0]);
    console.log("Flight status type:", flights[0]?.flightStatusType);
    console.log("Flight designator:", flights[0]?.flightDesignator);
  }

  if (isLoading) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-800">
        <div className="flex items-center justify-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-300">Tracking your flight...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-red-800">
        <div className="text-center">
          <div className="bg-red-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">
            Tracking Error
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
            No flight found
          </h3>
          <p className="text-gray-400">
            Please check your flight number and departure date.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Flight Status</h2>
        <p className="text-gray-400">Real-time tracking information</p>
      </div>

      {flights.map((flight, index) => {
        // Defensive check to ensure we have valid flight data
        if (!flight || !flight.flightDesignator) {
          console.warn("Invalid flight data:", flight);
          return null;
        }

        return (
          <div
            key={index}
            className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800"
          >
            {/* Flight Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {flight.flightDesignator?.carrierCode || "N/A"}
                    {flight.flightDesignator?.flightNumber || "N/A"}
                  </h3>
                  <p className="text-gray-400">
                    {flight.scheduledDepartureDate
                      ? formatDate(flight.scheduledDepartureDate)
                      : "Date N/A"}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center space-x-2 ${getFlightStatusColor(
                  flight.flightStatusType || flight.type || "SCHEDULED"
                )}`}
              >
                {getStatusIcon(
                  flight.flightStatusType || flight.type || "SCHEDULED"
                )}
                <span className="font-semibold">
                  {flight.flightStatusType
                    ? flight.flightStatusType.replace("_", " ")
                    : flight.type
                    ? flight.type.replace(/([A-Z])/g, " $1").trim()
                    : "Scheduled"}
                </span>
              </div>
            </div>

            {/* Flight Points */}
            {flight.flightPoints && flight.flightPoints.length >= 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Departure */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span>Departure: {flight.flightPoints[0].iataCode}</span>
                  </h4>

                  {flight.flightPoints[0].departure?.timings && (
                    <div className="space-y-2">
                      {flight.flightPoints[0].departure.timings.map(
                        (timing, timingIndex) => (
                          <div
                            key={timingIndex}
                            className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg"
                          >
                            <span className="text-gray-300 text-sm">
                              {formatTimingQualifier(timing.qualifier)}
                            </span>
                            <span className="text-white font-medium">
                              {formatTime(timing.value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {flight.flightPoints[0].departure?.terminal && (
                    <p className="text-gray-400 text-sm">
                      Terminal: {flight.flightPoints[0].departure.terminal.code}
                    </p>
                  )}

                  {flight.flightPoints[0].departure?.gate && (
                    <p className="text-gray-400 text-sm">
                      Gate: {flight.flightPoints[0].departure.gate.mainGate}
                    </p>
                  )}
                </div>

                {/* Arrival */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-green-400" />
                    <span>Arrival: {flight.flightPoints[1].iataCode}</span>
                  </h4>

                  {flight.flightPoints[1].arrival?.timings && (
                    <div className="space-y-2">
                      {flight.flightPoints[1].arrival.timings.map(
                        (timing, timingIndex) => (
                          <div
                            key={timingIndex}
                            className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg"
                          >
                            <span className="text-gray-300 text-sm">
                              {formatTimingQualifier(timing.qualifier)}
                            </span>
                            <span className="text-white font-medium">
                              {formatTime(timing.value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {flight.flightPoints[1].arrival?.terminal && (
                    <p className="text-gray-400 text-sm">
                      Terminal: {flight.flightPoints[1].arrival.terminal.code}
                    </p>
                  )}

                  {flight.flightPoints[1].arrival?.gate && (
                    <p className="text-gray-400 text-sm">
                      Gate: {flight.flightPoints[1].arrival.gate.mainGate}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Aircraft Information */}
            {flight.legs &&
              flight.legs.length > 0 &&
              flight.legs[0].aircraftEquipment && (
                <div className="bg-gray-800/30 rounded-lg p-4 mb-4">
                  <h4 className="text-white font-medium mb-2">
                    Aircraft Information
                  </h4>
                  <p className="text-gray-300">
                    Aircraft Type:{" "}
                    {flight.legs[0].aircraftEquipment.aircraftType}
                  </p>
                </div>
              )}

            {/* Segments */}
            {flight.segments && flight.segments.length > 0 && (
              <div className="bg-gray-800/30 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Flight Segments</h4>
                <div className="space-y-2">
                  {flight.segments.map((segment, segmentIndex) => (
                    <div
                      key={segmentIndex}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-300">
                        {segment.boardPointIataCode} →{" "}
                        {segment.offPointIataCode}
                      </span>
                      <span className="text-gray-400">
                        Duration: {segment.scheduledSegmentDuration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
