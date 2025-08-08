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

    const originLocationCode = searchParams.get("originLocationCode");
    const destinationLocationCode = searchParams.get("destinationLocationCode");
    const departureDate = searchParams.get("departureDate");
    const adults = searchParams.get("adults") || "1";
    const returnDate = searchParams.get("returnDate");

    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const token = await getAccessToken();

    const apiSearchParams = new URLSearchParams({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      max: "10",
    });

    if (returnDate) {
      apiSearchParams.append("returnDate", returnDate);
    }

    const response = await axios.get(
      `${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${apiSearchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json({ data: response.data.data || [] });
  } catch (error) {
    console.error("Error searching flights:", error);

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        {
          error: `Flight search failed: ${
            error.response.data.error_description || error.response.statusText
          }`,
          details: error.response.data,
        },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to search flights" },
      { status: 500 }
    );
  }
}
