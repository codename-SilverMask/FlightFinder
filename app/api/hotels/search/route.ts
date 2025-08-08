import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const AMADEUS_API_KEY =
  process.env.AMADEUS_API_KEY || "Gw0LbAG8CMMxtbcJ9w96YWAKmNsTB0PQ";
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET || "PWe1Mq16ANwy4JSb";
const AMADEUS_BASE_URL = "https://test.api.amadeus.com";

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken(): Promise<string> {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      `${AMADEUS_BASE_URL}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: AMADEUS_API_KEY,
        client_secret: AMADEUS_API_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60000;

    return accessToken as string;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error("Failed to authenticate with Amadeus API");
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const cityCode = searchParams.get("cityCode");
    const checkInDate = searchParams.get("checkInDate");
    const checkOutDate = searchParams.get("checkOutDate");
    const adults = searchParams.get("adults") || "1";

    console.log("Hotel search params:", {
      cityCode,
      checkInDate,
      checkOutDate,
      adults,
    });

    if (!cityCode || !checkInDate || !checkOutDate) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: cityCode, checkInDate, checkOutDate",
        },
        { status: 400 }
      );
    }

    const token = await getAccessToken();

    // Try using the hotel list API first to get available hotels, then get offers
    // This is a two-step process that might work better
    try {
      // Step 1: Get hotels by city
      const hotelListParams = new URLSearchParams();
      hotelListParams.append("cityCode", cityCode);

      const hotelListUrl = `${AMADEUS_BASE_URL}/v1/reference-data/locations/hotels/by-city?${hotelListParams.toString()}`;
      console.log("Getting hotel list from:", hotelListUrl);

      const hotelListResponse = await axios.get(hotelListUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      console.log("Hotel list response status:", hotelListResponse.status);
      console.log("Found hotels:", hotelListResponse.data?.data?.length || 0);

      // Log the structure of the first hotel from the list
      if (hotelListResponse.data?.data?.length > 0) {
        console.log(
          "First hotel structure from list API:",
          JSON.stringify(hotelListResponse.data.data[0], null, 2)
        );
      }

      // If we got hotels, try to get offers for the first few
      if (hotelListResponse.data?.data?.length > 0) {
        const hotels = hotelListResponse.data.data.slice(0, 10); // Get first 10 hotels
        const hotelIds = hotels.map((hotel: { hotelId: string }) => hotel.hotelId).join(",");

        // Step 2: Get offers for these hotels
        const offersParams = new URLSearchParams();
        offersParams.append("hotelIds", hotelIds);
        offersParams.append("checkInDate", checkInDate);
        offersParams.append("checkOutDate", checkOutDate);
        offersParams.append("adults", adults);
        offersParams.append("roomQuantity", "1");
        offersParams.append("currency", "USD");

        const offersUrl = `${AMADEUS_BASE_URL}/v3/shopping/hotel-offers?${offersParams.toString()}`;
        console.log("Getting hotel offers from:", offersUrl);

        const offersResponse = await axios.get(offersUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        });

        console.log("Hotel offers response status:", offersResponse.status);
        console.log(
          "Hotel offers data length:",
          offersResponse.data?.data?.length || 0
        );

        // Log the structure of the first hotel offer
        if (offersResponse.data?.data?.length > 0) {
          console.log(
            "First hotel offer structure:",
            JSON.stringify(offersResponse.data.data[0], null, 2)
          );
        }

        return NextResponse.json({
          data: offersResponse.data.data || [],
          meta: offersResponse.data.meta || {},
        });
      } else {
        return NextResponse.json({
          data: [],
          message: `No hotels found for city code: ${cityCode}`,
        });
      }
    } catch (listError) {
      console.log("Hotel list API failed, trying direct hotel offers...");
      console.error("List error:", listError);

      // Fallback: try direct hotel offers by city
      const apiSearchParams = new URLSearchParams();
      apiSearchParams.append("cityCode", cityCode);
      apiSearchParams.append("checkInDate", checkInDate);
      apiSearchParams.append("checkOutDate", checkOutDate);
      apiSearchParams.append("adults", adults);
      apiSearchParams.append("roomQuantity", "1");
      apiSearchParams.append("currency", "USD");

      const apiUrl = `${AMADEUS_BASE_URL}/v2/shopping/hotel-offers?${apiSearchParams.toString()}`;
      console.log("Fallback API request to:", apiUrl);

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      console.log("API response status:", response.status);
      console.log(
        "API response data length:",
        response.data?.data?.length || 0
      );

      // Log the structure of the first hotel from fallback API
      if (response.data?.data?.length > 0) {
        console.log(
          "First hotel from fallback API:",
          JSON.stringify(response.data.data[0], null, 2)
        );
      }

      return NextResponse.json({
        data: response.data.data || [],
        meta: response.data.meta || {},
      });
    }
  } catch (error) {
    console.error("Error searching hotels:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error("API Error status:", error.response.status);
      console.error("API Error data:", error.response.data);

      // Return more detailed error information
      return NextResponse.json(
        {
          error: `Hotel search failed: ${
            error.response.data?.error_description ||
            error.response.data?.detail?.message ||
            error.response.data?.detail ||
            error.response.statusText
          }`,
          details: error.response.data,
          status: error.response.status,
        },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to search hotels" },
      { status: 500 }
    );
  }
}
