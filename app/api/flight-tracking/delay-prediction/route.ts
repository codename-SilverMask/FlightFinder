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

    const originIataCode = searchParams.get("originIataCode");
    const destinationIataCode = searchParams.get("destinationIataCode");
    const scheduledDepartureDate = searchParams.get("scheduledDepartureDate");
    const scheduledDepartureTime = searchParams.get("scheduledDepartureTime");
    const carrierCode = searchParams.get("carrierCode");
    const flightNumber = searchParams.get("flightNumber");
    const aircraftCode = searchParams.get("aircraftCode");

    console.log("Flight delay prediction params:", {
      originIataCode,
      destinationIataCode,
      scheduledDepartureDate,
      scheduledDepartureTime,
      carrierCode,
      flightNumber,
      aircraftCode,
    });

    if (
      !originIataCode ||
      !destinationIataCode ||
      !scheduledDepartureDate ||
      !scheduledDepartureTime
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: originIataCode, destinationIataCode, scheduledDepartureDate, scheduledDepartureTime",
        },
        { status: 400 }
      );
    }

    const token = await getAccessToken();

    // Use Flight Delay Prediction API
    const predictionParams = new URLSearchParams();
    predictionParams.append("originIataCode", originIataCode);
    predictionParams.append("destinationIataCode", destinationIataCode);
    predictionParams.append("scheduledDepartureDate", scheduledDepartureDate);
    predictionParams.append("scheduledDepartureTime", scheduledDepartureTime);

    if (carrierCode) predictionParams.append("carrierCode", carrierCode);
    if (flightNumber) predictionParams.append("flightNumber", flightNumber);
    if (aircraftCode) predictionParams.append("aircraftCode", aircraftCode);

    const apiUrl = `${AMADEUS_BASE_URL}/v1/travel/predictions/flight-delay?${predictionParams.toString()}`;
    console.log("Flight delay prediction API URL:", apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 30000,
    });

    console.log("Flight delay prediction response:", response.status);
    console.log(
      "Flight delay prediction data:",
      JSON.stringify(response.data, null, 2)
    );

    return NextResponse.json({
      data: response.data.data || [],
      meta: response.data.meta || {},
    });
  } catch (error) {
    console.error("Error predicting flight delay:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error("API Error status:", error.response.status);
      console.error("API Error data:", error.response.data);

      return NextResponse.json(
        {
          error: `Flight delay prediction failed: ${
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
      { error: "Failed to predict flight delay" },
      { status: 500 }
    );
  }
}
