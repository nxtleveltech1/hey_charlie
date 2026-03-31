import { NextResponse } from "next/server";
import {
  getCurrentConditions,
  getMarineForecast,
  getTideData,
  getActiveAlerts,
  getMockConditions,
  calculateFishingRating,
  getSunTimes,
} from "@/lib/weather-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "current";
  const days = parseInt(searchParams.get("days") || "7");

  try {
    switch (type) {
      case "current": {
        let conditions = await getCurrentConditions();
        
        // Use mock data if API fails
        if (!conditions) {
          conditions = getMockConditions();
        }
        
        const fishingRating = calculateFishingRating(conditions);
        const alerts = await getActiveAlerts();
        const sunTimes = await getSunTimes(new Date());
        const tides = await getTideData(new Date());
        
        return NextResponse.json({
          conditions,
          fishingRating,
          alerts,
          sunTimes,
          tides,
        });
      }
      
      case "forecast": {
        const forecast = await getMarineForecast(days);
        return NextResponse.json({ forecast });
      }
      
      case "tides": {
        const date = searchParams.get("date")
          ? new Date(searchParams.get("date")!)
          : new Date();
        const tides = await getTideData(date);
        return NextResponse.json({ tides });
      }
      
      case "alerts": {
        const alerts = await getActiveAlerts();
        return NextResponse.json({ alerts });
      }
      
      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Weather API error:", error);
    
    // Return mock data on error to prevent UI breakage
    const mockConditions = getMockConditions();
    return NextResponse.json({
      conditions: mockConditions,
      fishingRating: calculateFishingRating(mockConditions),
      alerts: [],
      sunTimes: {
        sunrise: new Date(new Date().setHours(6, 30)),
        sunset: new Date(new Date().setHours(18, 30)),
        firstLight: new Date(new Date().setHours(6, 0)),
        lastLight: new Date(new Date().setHours(19, 0)),
      },
      tides: [],
      error: "Weather data temporarily unavailable",
    });
  }
}

