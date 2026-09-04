import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY as string;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API Key", data: null });
  }

  const { searchParams } = new URL(
    req.url,
    `http://${req.headers?.get("host")}`
  );
  const input = searchParams.get("input");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!input || input.trim().length < 2) {
    return NextResponse.json({ data: [], error: null });
  }

  const url = "https://places.googleapis.com/v1/places:autocomplete";

  // Build request body
  const body: any = {
    input: input
  };

  // Add location bias if coordinates are provided
  if (lat && lng) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      body.locationBias = {
        circle: {
          center: { latitude, longitude },
          radius: 10000.0 // 10km radius
        }
      };
    }
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({ data: data.suggestions ?? [], error: null });
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    return NextResponse.json({ error: String(error), data: [] });
  }
}
