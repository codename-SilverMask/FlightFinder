import axios from "axios";

export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  adults: number;
  returnDate?: string;
}

export interface FlightOffer {
  id: string;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface Itinerary {
  duration: string;
  segments: Segment[];
}

export interface Segment {
  departure: LocationInfo;
  arrival: LocationInfo;
  carrierCode: string;
  number: string;
  aircraft: Aircraft;
  operating?: Operating;
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface LocationInfo {
  iataCode: string;
  terminal?: string;
  at: string;
}

export interface Aircraft {
  code: string;
}

export interface Operating {
  carrierCode: string;
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  fees: Fee[];
  grandTotal: string;
}

export interface Fee {
  amount: string;
  type: string;
}

export interface PricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: Price;
  fareDetailsBySegment: FareDetailsBySegment[];
}

export interface FareDetailsBySegment {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  class: string;
  includedCheckedBags: IncludedCheckedBags;
}

export interface IncludedCheckedBags {
  quantity: number;
}

// Function to search flights using our API route
export async function searchFlights(
  params: FlightSearchParams
): Promise<FlightOffer[]> {
  try {
    const searchParams = new URLSearchParams({
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: params.adults.toString(),
    });

    if (params.returnDate) {
      searchParams.append("returnDate", params.returnDate);
    }

    const response = await axios.get(
      `/api/flights/search?${searchParams.toString()}`
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error searching flights:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Flight search failed");
    }
    throw new Error("Failed to search flights");
  }
}

// Function to get airport/city suggestions using our API route
export async function getLocationSuggestions(
  keyword: string
): Promise<LocationSuggestion[]> {
  try {
    if (keyword.length < 2) return [];

    const response = await axios.get(
      `/api/locations?keyword=${encodeURIComponent(keyword)}`
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error getting location suggestions:", error);
    return [];
  }
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

// Function to get airline name by code
export function getAirlineName(code: string): string {
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
    // Add more airline codes as needed
  };

  return airlines[code] || code;
}
