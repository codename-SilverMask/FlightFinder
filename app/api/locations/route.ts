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
    const keyword = searchParams.get("keyword");

    if (!keyword || keyword.length < 2) {
      return NextResponse.json({ data: [] });
    }

    const token = await getAccessToken();

    const response = await axios.get(
      `${AMADEUS_BASE_URL}/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(
        keyword
      )}&page%5Blimit%5D=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json({ data: response.data.data || [] });
  } catch (error) {
    console.error("Error getting location suggestions:", error);
    return NextResponse.json({ data: [] });
  }
}
