import axios from "axios";

export interface HotelSearchParams {
  cityCode: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  radius?: number;
  radiusUnit?: "KM" | "MILE";
}

export interface HotelOffer {
  type: string;
  hotel: Hotel;
  available: boolean;
  offers: Offer[];
  self: string;
}

export interface Hotel {
  type: string;
  hotelId: string;
  chainCode?: string;
  dupeId: string;
  name: string;
  rating?: number;
  cityCode: string;
  latitude: number;
  longitude: number;
  hotelDistance?: HotelDistance;
  address: Address;
  contact?: Contact;
  description?: Description;
  amenities?: string[];
  media?: Media[];
}

export interface HotelDistance {
  distance: number;
  distanceUnit: string;
}

export interface Address {
  lines?: string[];
  postalCode?: string;
  cityName?: string;
  countryCode?: string;
}

export interface Contact {
  phone?: string;
  fax?: string;
  email?: string;
}

export interface Description {
  lang: string;
  text: string;
}

export interface Media {
  uri: string;
  category: string;
}

export interface Offer {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  rateCode?: string;
  rateFamilyEstimated?: RateFamilyEstimated;
  category?: string;
  description?: Description;
  commission?: Commission;
  boardType?: string;
  room: Room;
  guests: Guests;
  price: Price;
  policies?: Policies;
  self?: string;
}

export interface RateFamilyEstimated {
  code: string;
  type: string;
}

export interface Commission {
  percentage?: string;
  amount?: string;
}

export interface Room {
  type: string;
  typeEstimated?: RoomTypeEstimated;
  description?: Description;
}

export interface RoomTypeEstimated {
  category: string;
  beds?: number;
  bedType?: string;
}

export interface Guests {
  adults: number;
}

export interface Price {
  currency: string;
  base?: string;
  total: string;
  variations?: PriceVariation;
}

export interface PriceVariation {
  average?: DailyPrice;
  changes?: DailyPrice[];
}

export interface DailyPrice {
  base?: string;
  total?: string;
}

export interface Policies {
  holdTime?: HoldTime;
  paymentType?: string;
  cancellation?: Cancellation;
}

export interface HoldTime {
  deadline: string;
}

export interface Cancellation {
  type: string;
  amount?: string;
  numberOfNights?: number;
  percentage?: string;
  deadline?: string;
}

// Function to search hotels using our API route
export async function searchHotels(
  params: HotelSearchParams
): Promise<HotelOffer[]> {
  try {
    const searchParams = new URLSearchParams({
      cityCode: params.cityCode,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      adults: params.adults.toString(),
    });

    if (params.radius) {
      searchParams.append("radius", params.radius.toString());
    }
    if (params.radiusUnit) {
      searchParams.append("radiusUnit", params.radiusUnit);
    }

    const response = await axios.get(
      `/api/hotels/search?${searchParams.toString()}`
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error searching hotels:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Hotel search failed");
    }
    throw new Error("Failed to search hotels");
  }
}

// Function to get city code from location (for now, we'll use a simple mapping)
export function getCityCodeFromLocation(location: string): string {
  const cityMappings: { [key: string]: string } = {
    "new york": "NYC",
    "new york city": "NYC",
    london: "LON",
    paris: "PAR",
    tokyo: "TYO",
    dubai: "DXB",
    singapore: "SIN",
    "los angeles": "LAX",
    chicago: "CHI",
    miami: "MIA",
    bangkok: "BKK",
    istanbul: "IST",
    rome: "ROM",
    barcelona: "BCN",
    amsterdam: "AMS",
    berlin: "BER",
    sydney: "SYD",
    melbourne: "MEL",
    "hong kong": "HKG",
    seoul: "ICN", // Changed to airport code
    mumbai: "BOM",
    delhi: "DEL",
    dhaka: "DAC",
    madrid: "MAD",
    lisbon: "LIS",
    vienna: "VIE",
    zurich: "ZUR",
    milan: "MIL",
    prague: "PRG",
    budapest: "BUD",
    warsaw: "WAW",
    stockholm: "STO",
    helsinki: "HEL",
    oslo: "OSL",
    copenhagen: "CPH",
    brussels: "BRU",
    frankfurt: "FRA",
    munich: "MUC",
    hamburg: "HAM",
    // Test with a few common destinations
    "las vegas": "LAS",
    orlando: "MCO",
    "san francisco": "SFO",
    boston: "BOS",
    atlanta: "ATL",
  };

  const normalizedLocation = location.toLowerCase().trim();

  // First check exact matches
  if (cityMappings[normalizedLocation]) {
    return cityMappings[normalizedLocation];
  }

  // If no exact match, try to extract 3-letter code if it looks like an airport code
  if (location.length === 3 && location.match(/^[A-Z]{3}$/)) {
    return location;
  }

  // Fallback: use first 3 letters of input
  return location.toUpperCase().substring(0, 3);
}
