// Weather API Service for Hey Charlie Charters
// Integrates StormGlass.io (marine data) and OpenWeatherMap (fallback)

// Durban coordinates (update as needed for Hey Charlie's location)
export const CHARTER_COORDS = {
  lat: -29.8587,
  lng: 31.0218,
};

// Types
export interface MarineConditions {
  timestamp: Date;
  airTemperature: number; // Celsius
  waterTemperature: number; // Celsius
  windSpeed: number; // knots
  windDirection: number; // degrees
  windGust: number; // knots
  waveHeight: number; // meters
  wavePeriod: number; // seconds
  waveDirection: number; // degrees
  swellHeight: number; // meters
  swellPeriod: number; // seconds
  swellDirection: number; // degrees
  visibility: number; // km
  cloudCover: number; // percentage
  precipitation: number; // mm/h
  pressure: number; // hPa
  humidity: number; // percentage
  uvIndex: number;
}

export interface TideData {
  time: Date;
  height: number; // meters
  type: "high" | "low";
}

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  firstLight: Date;
  lastLight: Date;
}

export interface DailyForecast {
  date: Date;
  conditions: MarineConditions;
  tides: TideData[];
  sunTimes: SunTimes;
  fishingRating: FishingRating;
}

export interface FishingRating {
  score: number; // 1-5
  label: string;
  reasons: string[];
  bestTimes: string[];
}

export interface WeatherAlert {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  source: "api" | "admin";
  activeFrom: Date;
  activeTo: Date;
}

// In-memory cache
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T, ttl = CACHE_TTL): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
  });
}

// StormGlass API
async function fetchStormGlass(endpoint: string, params: Record<string, string>): Promise<unknown> {
  const apiKey = process.env.STORMGLASS_API_KEY;
  if (!apiKey) {
    console.warn("StormGlass API key not configured");
    return null;
  }

  const url = new URL(`https://api.stormglass.io/v2/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    console.error(`StormGlass API error: ${response.status}`);
    return null;
  }

  return response.json();
}

// OpenWeatherMap API (fallback)
async function fetchOpenWeather(endpoint: string, params: Record<string, string>): Promise<unknown> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    console.warn("OpenWeatherMap API key not configured");
    return null;
  }

  const url = new URL(`https://api.openweathermap.org/data/2.5/${endpoint}`);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url.toString());

  if (!response.ok) {
    console.error(`OpenWeatherMap API error: ${response.status}`);
    return null;
  }

  return response.json();
}

// Convert wind speed from m/s to knots
function msToKnots(ms: number): number {
  return ms * 1.94384;
}

// Get compass direction from degrees
export function getWindDirectionLabel(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Parse StormGlass response to our format
function parseStormGlassConditions(data: Record<string, unknown>): MarineConditions | null {
  try {
    const hours = (data.hours as Array<Record<string, unknown>>) || [];
    if (hours.length === 0) return null;

    const current = hours[0];
    const getValue = (obj: unknown): number => {
      if (typeof obj === "number") return obj;
      if (typeof obj === "object" && obj !== null && "sg" in obj) {
        return (obj as { sg: number }).sg;
      }
      return 0;
    };

    return {
      timestamp: new Date(current.time as string),
      airTemperature: getValue(current.airTemperature),
      waterTemperature: getValue(current.waterTemperature),
      windSpeed: getValue(current.windSpeed),
      windDirection: getValue(current.windDirection),
      windGust: getValue(current.gust),
      waveHeight: getValue(current.waveHeight),
      wavePeriod: getValue(current.wavePeriod),
      waveDirection: getValue(current.waveDirection),
      swellHeight: getValue(current.swellHeight),
      swellPeriod: getValue(current.swellPeriod),
      swellDirection: getValue(current.swellDirection),
      visibility: getValue(current.visibility),
      cloudCover: getValue(current.cloudCover),
      precipitation: getValue(current.precipitation),
      pressure: getValue(current.pressure),
      humidity: getValue(current.humidity),
      uvIndex: getValue(current.uvIndex),
    };
  } catch (error) {
    console.error("Error parsing StormGlass data:", error);
    return null;
  }
}

// Parse OpenWeatherMap response (fallback)
function parseOpenWeatherConditions(data: Record<string, unknown>): MarineConditions | null {
  try {
    const main = data.main as Record<string, number>;
    const wind = data.wind as Record<string, number>;
    const clouds = data.clouds as Record<string, number>;

    return {
      timestamp: new Date(),
      airTemperature: main?.temp || 0,
      waterTemperature: main?.temp || 0,
      windSpeed: msToKnots(wind?.speed || 0),
      windDirection: wind?.deg || 0,
      windGust: msToKnots(wind?.gust || wind?.speed || 0),
      waveHeight: 0,
      wavePeriod: 0,
      waveDirection: 0,
      swellHeight: 0,
      swellPeriod: 0,
      swellDirection: 0,
      visibility: ((data.visibility as number) || 10000) / 1000,
      cloudCover: clouds?.all || 0,
      precipitation: 0,
      pressure: main?.pressure || 1013,
      humidity: main?.humidity || 0,
      uvIndex: 0,
    };
  } catch (error) {
    console.error("Error parsing OpenWeather data:", error);
    return null;
  }
}

// Get current marine conditions
export async function getCurrentConditions(): Promise<MarineConditions | null> {
  const cacheKey = "current-conditions";
  const cached = getCached<MarineConditions>(cacheKey);
  if (cached) return cached;

  const stormGlassData = await fetchStormGlass("weather/point", {
    lat: CHARTER_COORDS.lat.toString(),
    lng: CHARTER_COORDS.lng.toString(),
    params: "airTemperature,waterTemperature,windSpeed,windDirection,gust,waveHeight,wavePeriod,waveDirection,swellHeight,swellPeriod,swellDirection,visibility,cloudCover,precipitation,pressure,humidity,uvIndex",
  });

  if (stormGlassData) {
    const conditions = parseStormGlassConditions(stormGlassData as Record<string, unknown>);
    if (conditions) {
      setCache(cacheKey, conditions);
      return conditions;
    }
  }

  const owmData = await fetchOpenWeather("weather", {
    lat: CHARTER_COORDS.lat.toString(),
    lon: CHARTER_COORDS.lng.toString(),
  });

  if (owmData) {
    const conditions = parseOpenWeatherConditions(owmData as Record<string, unknown>);
    if (conditions) {
      setCache(cacheKey, conditions);
      return conditions;
    }
  }

  return null;
}

// Get 7-day marine forecast
export async function getMarineForecast(days = 7): Promise<DailyForecast[]> {
  const cacheKey = `forecast-${days}`;
  const cached = getCached<DailyForecast[]>(cacheKey);
  if (cached) return cached;

  const forecasts: DailyForecast[] = [];
  const now = new Date();

  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + days);

  const stormGlassData = await fetchStormGlass("weather/point", {
    lat: CHARTER_COORDS.lat.toString(),
    lng: CHARTER_COORDS.lng.toString(),
    start: now.toISOString(),
    end: endDate.toISOString(),
    params: "airTemperature,waterTemperature,windSpeed,windDirection,gust,waveHeight,wavePeriod,waveDirection,swellHeight,swellPeriod,swellDirection,visibility,cloudCover,precipitation,pressure,humidity,uvIndex",
  });

  if (stormGlassData) {
    const hours = ((stormGlassData as Record<string, unknown>).hours as Array<Record<string, unknown>>) || [];
    const dailyData = new Map<string, Record<string, unknown>>();

    for (const hour of hours) {
      const date = new Date(hour.time as string);
      const dateKey = date.toISOString().split("T")[0];
      if (!dailyData.has(dateKey) || date.getHours() === 12) {
        dailyData.set(dateKey, hour);
      }
    }

    for (const [dateStr, hourData] of dailyData) {
      const conditions = parseStormGlassConditions({ hours: [hourData] });
      if (conditions) {
        const date = new Date(dateStr);
        const tides = await getTideData(date);
        const sunTimes = await getSunTimes(date);
        const fishingRating = calculateFishingRating(conditions);

        forecasts.push({ date, conditions, tides, sunTimes, fishingRating });
      }
    }
  } else {
    const current = await getCurrentConditions();
    if (current) {
      for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);

        const variation = (Math.random() - 0.5) * 0.4;
        const mockConditions: MarineConditions = {
          ...current,
          timestamp: date,
          airTemperature: current.airTemperature + variation * 5,
          windSpeed: Math.max(5, current.windSpeed + variation * 10),
          waveHeight: Math.max(0.5, current.waveHeight + variation * 1.5),
          swellHeight: Math.max(0.3, current.swellHeight + variation * 1),
        };

        const tides = await getTideData(date);
        const sunTimes = await getSunTimes(date);
        const fishingRating = calculateFishingRating(mockConditions);

        forecasts.push({ date, conditions: mockConditions, tides, sunTimes, fishingRating });
      }
    }
  }

  if (forecasts.length > 0) {
    setCache(cacheKey, forecasts);
  }

  return forecasts;
}

// Get tide data for a specific date
export async function getTideData(date: Date): Promise<TideData[]> {
  const dateStr = date.toISOString().split("T")[0];
  const cacheKey = `tides-${dateStr}`;
  const cached = getCached<TideData[]>(cacheKey);
  if (cached) return cached;

  const stormGlassData = await fetchStormGlass("tide/extremes/point", {
    lat: CHARTER_COORDS.lat.toString(),
    lng: CHARTER_COORDS.lng.toString(),
    start: date.toISOString(),
    end: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
  });

  if (stormGlassData) {
    const extremes = (stormGlassData as { data: Array<{ time: string; height: number; type: string }> }).data || [];
    const tides: TideData[] = extremes.map((e) => ({
      time: new Date(e.time),
      height: e.height,
      type: e.type === "high" ? "high" : "low",
    }));
    setCache(cacheKey, tides);
    return tides;
  }

  // Fallback: Generate approximate tides
  const baseTides: TideData[] = [
    { time: new Date(date.setHours(6, 30)), height: 0.4, type: "low" },
    { time: new Date(date.setHours(12, 45)), height: 1.8, type: "high" },
    { time: new Date(date.setHours(18, 30)), height: 0.5, type: "low" },
    { time: new Date(date.setHours(0, 15)), height: 1.6, type: "high" },
  ];

  setCache(cacheKey, baseTides);
  return baseTides;
}

// Get sunrise/sunset times
export async function getSunTimes(date: Date): Promise<SunTimes> {
  const dateStr = date.toISOString().split("T")[0];
  const cacheKey = `sun-${dateStr}`;
  const cached = getCached<SunTimes>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${CHARTER_COORDS.lat}&lng=${CHARTER_COORDS.lng}&date=${dateStr}&formatted=0`
    );

    if (response.ok) {
      const data = await response.json();
      if (data.status === "OK") {
        const sunTimes: SunTimes = {
          sunrise: new Date(data.results.sunrise),
          sunset: new Date(data.results.sunset),
          firstLight: new Date(data.results.civil_twilight_begin),
          lastLight: new Date(data.results.civil_twilight_end),
        };
        setCache(cacheKey, sunTimes);
        return sunTimes;
      }
    }
  } catch (error) {
    console.error("Error fetching sun times:", error);
  }

  const fallback: SunTimes = {
    sunrise: new Date(date.setHours(6, 30)),
    sunset: new Date(date.setHours(18, 30)),
    firstLight: new Date(date.setHours(6, 0)),
    lastLight: new Date(date.setHours(19, 0)),
  };

  setCache(cacheKey, fallback);
  return fallback;
}

// Calculate fishing rating based on conditions
export function calculateFishingRating(conditions: MarineConditions): FishingRating {
  let score = 5;
  const reasons: string[] = [];
  const negatives: string[] = [];
  const bestTimes: string[] = [];

  if (conditions.windSpeed < 5) {
    score -= 0.5;
    negatives.push("Very light wind may reduce bait activity");
  } else if (conditions.windSpeed <= 15) {
    reasons.push("Ideal wind conditions");
  } else if (conditions.windSpeed <= 20) {
    score -= 0.5;
    negatives.push("Moderate wind may affect comfort");
  } else if (conditions.windSpeed <= 25) {
    score -= 1;
    negatives.push("Strong wind expected");
  } else {
    score -= 2;
    negatives.push("Very strong wind - rough conditions");
  }

  if (conditions.swellHeight <= 1.5) {
    reasons.push("Comfortable swell conditions");
  } else if (conditions.swellHeight <= 2.5) {
    score -= 0.5;
    negatives.push("Moderate swell");
  } else if (conditions.swellHeight <= 3.5) {
    score -= 1;
    negatives.push("Large swell expected");
  } else {
    score -= 2;
    negatives.push("Very large swell - offshore trips may be affected");
  }

  if (conditions.waveHeight > 2) {
    score -= 0.5;
    negatives.push("Choppy wave conditions");
  }

  if (conditions.visibility >= 10) {
    reasons.push("Excellent visibility");
  } else if (conditions.visibility < 5) {
    score -= 0.5;
    negatives.push("Reduced visibility");
  }

  if (conditions.pressure >= 1015) {
    reasons.push("Stable high pressure");
    bestTimes.push("Fish often feed actively in stable conditions");
  } else if (conditions.pressure < 1005) {
    score -= 0.5;
    negatives.push("Low pressure system - fish may be less active");
  }

  if (conditions.waterTemperature >= 18 && conditions.waterTemperature <= 24) {
    reasons.push("Ideal water temperature for game fish");
  } else if (conditions.waterTemperature < 16) {
    negatives.push("Cool water - pelagics may be deeper");
  }

  if (conditions.cloudCover >= 20 && conditions.cloudCover <= 70) {
    reasons.push("Good cloud cover for surface activity");
    bestTimes.push("Fish often more active with partial cloud cover");
  }

  bestTimes.push("Early morning (sunrise to 9am)");
  bestTimes.push("Late afternoon (4pm to sunset)");

  score = Math.max(1, Math.min(5, Math.round(score * 2) / 2));

  let label: string;
  if (score >= 4.5) label = "Excellent";
  else if (score >= 4) label = "Very Good";
  else if (score >= 3) label = "Good";
  else if (score >= 2) label = "Fair";
  else label = "Poor";

  return { score, label, reasons: [...reasons, ...negatives], bestTimes };
}

// Get active weather alerts (from API and admin)
export async function getActiveAlerts(): Promise<WeatherAlert[]> {
  const cacheKey = "active-alerts";
  const cached = getCached<WeatherAlert[]>(cacheKey);
  if (cached) return cached;

  const alerts: WeatherAlert[] = [];

  const conditions = await getCurrentConditions();
  if (conditions) {
    if (conditions.windSpeed > 25) {
      alerts.push({
        id: "wind-warning",
        title: "Strong Wind Warning",
        message: `Wind speeds of ${Math.round(conditions.windSpeed)} knots expected. Offshore trips may be affected.`,
        severity: conditions.windSpeed > 35 ? "critical" : "warning",
        source: "api",
        activeFrom: new Date(),
        activeTo: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    }

    if (conditions.swellHeight > 3) {
      alerts.push({
        id: "swell-warning",
        title: "Large Swell Warning",
        message: `Swell heights of ${conditions.swellHeight.toFixed(1)}m expected. Rough conditions offshore.`,
        severity: conditions.swellHeight > 4 ? "critical" : "warning",
        source: "api",
        activeFrom: new Date(),
        activeTo: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    }

    if (conditions.visibility < 3) {
      alerts.push({
        id: "visibility-warning",
        title: "Low Visibility",
        message: `Visibility reduced to ${conditions.visibility.toFixed(1)}km. Navigate with caution.`,
        severity: "warning",
        source: "api",
        activeFrom: new Date(),
        activeTo: new Date(Date.now() + 12 * 60 * 60 * 1000),
      });
    }
  }

  if (alerts.length > 0) {
    setCache(cacheKey, alerts, 30 * 60 * 1000);
  }

  return alerts;
}

// Format temperature with unit
export function formatTemperature(celsius: number): string {
  return `${Math.round(celsius)}°C`;
}

// Format wind speed
export function formatWindSpeed(knots: number): string {
  return `${Math.round(knots)} kts`;
}

// Format wave/swell height
export function formatHeight(meters: number): string {
  return `${meters.toFixed(1)}m`;
}

// Format time for display
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// Generate mock data for development
export function getMockConditions(): MarineConditions {
  return {
    timestamp: new Date(),
    airTemperature: 24,
    waterTemperature: 21,
    windSpeed: 12,
    windDirection: 180,
    windGust: 18,
    waveHeight: 1.2,
    wavePeriod: 8,
    waveDirection: 210,
    swellHeight: 1.5,
    swellPeriod: 12,
    swellDirection: 225,
    visibility: 15,
    cloudCover: 30,
    precipitation: 0,
    pressure: 1018,
    humidity: 65,
    uvIndex: 6,
  };
}

