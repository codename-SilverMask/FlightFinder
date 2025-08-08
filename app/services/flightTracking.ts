import axios from "axios";

export interface FlightStatus {
  type?: string; // Usually "DatedFlight"
  scheduledDepartureDate?: string;
  flightDesignator?: {
    carrierCode?: string;
    flightNumber?: number;
  };
  flightPoints?: FlightPoint[];
  segments?: FlightSegment[];
  legs?: FlightLeg[];
  flightStatusType?:
    | "SCHEDULED"
    | "ACTIVE"
    | "DIVERTED"
    | "LANDED"
    | "CANCELLED"
    | "DELAYED"
    | string;
}

export interface FlightLeg {
  boardPointIataCode?: string;
  offPointIataCode?: string;
  aircraftEquipment?: {
    aircraftType?: string;
  };
  scheduledLegDuration?: string;
}

export interface FlightPoint {
  iataCode?: string;
  departure?: FlightTiming;
  arrival?: FlightTiming;
}

export interface FlightTiming {
  timings: Array<{
    qualifier: "STD" | "ETD" | "ATD" | "STA" | "ETA" | "ATA";
    value: string;
    delays?: Array<{
      duration: string;
    }>;
  }>;
  terminal?: {
    code: string;
  };
  gate?: {
    mainGate: string;
  };
}

export interface FlightSegment {
  boardPointIataCode: string;
  offPointIataCode: string;
  scheduledSegmentDuration: string;
  partnership?: {
    operatingFlight: {
      carrierCode: string;
      flightNumber: number;
    };
  };
}

export interface FlightDelayPrediction {
  id: string;
  probability: number;
  result: {
    prediction: {
      delayLevel: "NO_DELAY" | "MINOR_DELAY" | "MODERATE_DELAY" | "MAJOR_DELAY";
      delayCategory: string;
    };
  };
  subType: string;
  type: string;
}

export interface FlightTrackingParams {
  carrierCode: string;
  flightNumber: string;
  scheduledDepartureDate: string;
}

export const trackFlight = async (
  params: FlightTrackingParams
): Promise<FlightStatus[]> => {
  try {
    const response = await axios.get("/api/flight-tracking/status", {
      params: {
        carrierCode: params.carrierCode,
        flightNumber: params.flightNumber,
        scheduledDepartureDate: params.scheduledDepartureDate,
      },
    });

    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Flight tracking failed");
    }
    throw new Error("Failed to track flight");
  }
};

export const getFlightDelayPrediction = async (
  originIataCode: string,
  destinationIataCode: string,
  scheduledDepartureDate: string,
  scheduledDepartureTime: string,
  carrierCode: string,
  flightNumber: string,
  aircraftCode?: string
): Promise<FlightDelayPrediction[]> => {
  try {
    const response = await axios.get("/api/flight-tracking/delay-prediction", {
      params: {
        originIataCode,
        destinationIataCode,
        scheduledDepartureDate,
        scheduledDepartureTime,
        carrierCode,
        flightNumber,
        aircraftCode,
      },
    });

    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Delay prediction failed");
    }
    throw new Error("Failed to get delay prediction");
  }
};

// Utility function to parse flight number from string like "AA123" or "American Airlines 123"
export const parseFlightNumber = (
  input: string
): { carrierCode: string; flightNumber: string } => {
  // Remove common airline names and extract code + number
  const cleaned = input.trim().toUpperCase();

  // Try to match pattern like "AA123" or "AA 123"
  const match = cleaned.match(/([A-Z]{2,3})\s*(\d+)/);

  if (match) {
    return {
      carrierCode: match[1],
      flightNumber: match[2],
    };
  }

  // If no match, try to split on space and take last part as number
  const parts = cleaned.split(/\s+/);
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    const secondLastPart = parts[parts.length - 2];

    if (/^\d+$/.test(lastPart) && /^[A-Z]{2,3}$/.test(secondLastPart)) {
      return {
        carrierCode: secondLastPart,
        flightNumber: lastPart,
      };
    }
  }

  throw new Error(
    'Invalid flight number format. Please use format like "AA123" or "American Airlines 123"'
  );
};

// Helper function to get flight status color
export const getFlightStatusColor = (status: string): string => {
  switch (status?.toUpperCase()) {
    case "SCHEDULED":
    case "DATEDFLIGHT":
      return "text-blue-400";
    case "ACTIVE":
    case "INFLIGHT":
      return "text-green-400";
    case "LANDED":
    case "ARRIVED":
      return "text-gray-400";
    case "DELAYED":
      return "text-yellow-400";
    case "CANCELLED":
      return "text-red-400";
    case "DIVERTED":
      return "text-orange-400";
    default:
      return "text-blue-400"; // Default to scheduled color
  }
};

// Helper function to format timing qualifier
export const formatTimingQualifier = (qualifier: string): string => {
  switch (qualifier) {
    case "STD":
      return "Scheduled Departure";
    case "ETD":
      return "Estimated Departure";
    case "ATD":
      return "Actual Departure";
    case "STA":
      return "Scheduled Arrival";
    case "ETA":
      return "Estimated Arrival";
    case "ATA":
      return "Actual Arrival";
    default:
      return qualifier;
  }
};
