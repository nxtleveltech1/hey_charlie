import { NextResponse } from "next/server";
import {
  getPublicCurrentConditions,
  getPublicForecast,
  getTideData,
  getActiveAlerts,
  calculateFishingRating,
  getSunTimes,
} from "@/lib/weather-service";

// NOTE: This route delegates to the public-facing getters in weather-service,
// which gate mock data behind NEXT_PUBLIC_WEATHER_MOCK_ENABLED and return a
// clearly-marked "unavailable" state when live data can't be obtained. Mock
// data is therefore never presented as live unless explicitly enabled.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "current";
  const days = parseInt(searchParams.get("days") || "7");

  try {
    switch (type) {
      case "current": {
        const result = await getPublicCurrentConditions();
        const alerts = await getActiveAlerts();
        const tides = await getTideData(new Date());
        const sunTimes = await getSunTimes(new Date());

        if (result.available) {
          return NextResponse.json({
            available: true,
            conditions: result.conditions,
            fishingRating: calculateFishingRating(result.conditions),
            alerts,
            sunTimes,
            tides,
          });
        }

        return NextResponse.json({
          available: false,
          reason: result.reason,
          conditions: null,
          fishingRating: null,
          alerts,
          sunTimes,
          tides,
        });
      }

      case "forecast": {
        const result = await getPublicForecast(days);
        if (result.available) {
          return NextResponse.json({ available: true, forecast: result.forecast });
        }
        return NextResponse.json({
          available: false,
          reason: result.reason,
          forecast: [],
        });
      }

      case "tides": {
        const date = searchParams.get("date")
          ? new Date(searchParams.get("date")!)
          : new Date();
        const tides = await getTideData(date);
        return NextResponse.json({ available: tides.length > 0, tides });
      }

      case "alerts": {
        const alerts = await getActiveAlerts();
        return NextResponse.json({ alerts });
      }

      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      {
        available: false,
        reason: "upstream-error",
        conditions: null,
        fishingRating: null,
        alerts: [],
        sunTimes: null,
        tides: [],
        error: "Weather data temporarily unavailable",
      },
      { status: 200 },
    );
  }
}
