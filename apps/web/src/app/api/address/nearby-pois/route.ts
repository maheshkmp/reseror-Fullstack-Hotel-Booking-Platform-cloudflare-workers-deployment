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
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing coordinates", data: null });
  }

  const url = "https://places.googleapis.com/v1/places:searchNearby";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.primaryType,places.types,places.location,places.id"
      },
      body: JSON.stringify({
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: parseFloat(lat),
              longitude: parseFloat(lng)
            },
            radius: 5000.0 // 5km radius
          }
        },
        includedTypes: [
          "tourist_attraction",
          "museum",
          "park",
          "landmark",
          "historical_landmark",
          "train_station",
          "bus_station",
          "airport",
          "restaurant",
          "cafe",
          "shopping_mall"
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google Places API error:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({ data: data.places ?? [], error: null });
  } catch (error) {
    console.error("Error fetching nearby POIs:", error);
    return NextResponse.json({ error: String(error), data: [] });
  }
}
