"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatHeight,
  formatTemperature,
  formatWindSpeed,
  getWindDirectionLabel,
  type DailyForecast,
  type FishingRating,
} from "@/lib/weather-service";
import { cn } from "@/lib/utils";

interface ForecastWeatherResponse {
  available: boolean;
  reason?: string;
  forecast: DailyForecast[];
}

function parseForecastDay(day: DailyForecast): DailyForecast {
  return {
    ...day,
    date: new Date(day.date),
    conditions: {
      ...day.conditions,
      timestamp: new Date(day.conditions.timestamp),
    },
    tides: day.tides.map((t) => ({ ...t, time: new Date(t.time) })),
    sunTimes: day.sunTimes
      ? {
          sunrise: new Date(day.sunTimes.sunrise),
          sunset: new Date(day.sunTimes.sunset),
          firstLight: new Date(day.sunTimes.firstLight),
          lastLight: new Date(day.sunTimes.lastLight),
        }
      : null,
  };
}

function toLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getCharterSuitability(
  windKts: number,
  waveM: number,
): { label: string; tone: "good" | "caution" | "poor" } {
  if (windKts > 25 || waveM > 3.5) {
    return { label: "Rough conditions — contact us to confirm", tone: "poor" };
  }
  if (windKts > 20 || waveM > 2.5) {
    return { label: "Moderate conditions — worth checking closer to date", tone: "caution" };
  }
  return { label: "Looking good for a charter", tone: "good" };
}

interface BookingDateWeatherProps {
  selectedDate: string;
}

export function BookingDateWeather({ selectedDate }: BookingDateWeatherProps) {
  const [forecastDays, setForecastDays] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/weather?type=forecast&days=14");
        if (!res.ok) throw new Error("Failed to fetch forecast");
        const data = (await res.json()) as ForecastWeatherResponse;
        if (cancelled) return;

        if (data.available && data.forecast.length > 0) {
          setForecastDays(data.forecast.map(parseForecastDay));
        } else {
          setForecastDays([]);
          setError(
            data.reason === "configuration"
              ? "Weather forecast is not configured."
              : "Forecast temporarily unavailable.",
          );
        }
      } catch {
        if (!cancelled) {
          setForecastDays([]);
          setError("Could not load weather forecast.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const dayForecast = useMemo(() => {
    if (!selectedDate || forecastDays.length === 0) return null;
    return (
      forecastDays.find((d) => toLocalDateKey(d.date) === selectedDate) ?? null
    );
  }, [selectedDate, forecastDays]);

  if (!selectedDate) {
    return (
      <p className="text-sm text-[var(--theme-text-muted)]">
        Select a date to see the marine forecast for your charter.
      </p>
    );
  }

  if (loading) {
    return (
      <div
        className="animate-pulse rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4"
        aria-busy="true"
      >
        <div className="mb-3 h-4 w-40 rounded bg-[var(--theme-border)]" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-[var(--theme-border)]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 text-sm text-[var(--theme-text-muted)]">
        {error}{" "}
        <Link href="/weather" className="text-amber underline-offset-2 hover:underline">
          View weather page
        </Link>
      </div>
    );
  }

  if (!dayForecast) {
    return (
      <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 text-sm text-[var(--theme-text-muted)]">
        Forecast is not available for this date yet (up to 14 days ahead).{" "}
        <Link href="/weather" className="text-amber underline-offset-2 hover:underline">
          Check the full forecast
        </Link>
      </div>
    );
  }

  const { conditions, fishingRating } = dayForecast;
  const suitability = getCharterSuitability(
    conditions.windSpeed,
    conditions.waveHeight,
  );

  return (
    <div className="rounded-xl border border-sky-500/25 bg-gradient-to-br from-sky-500/10 to-[var(--theme-surface)] p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">Marine forecast</p>
          <p className="text-xs text-[var(--theme-text-muted)]">
            V&amp;A Waterfront departure
          </p>
        </div>
        {fishingRating && (
          <FishingBadge rating={fishingRating} />
        )}
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Air" value={formatTemperature(conditions.airTemperature)} />
        <Stat
          label="Wind"
          value={`${formatWindSpeed(conditions.windSpeed)} ${getWindDirectionLabel(conditions.windDirection)}`}
        />
        <Stat label="Waves" value={formatHeight(conditions.waveHeight)} />
        <Stat label="Swell" value={formatHeight(conditions.swellHeight)} />
      </div>

      <p
        className={cn(
          "text-sm font-medium",
          suitability.tone === "good" && "text-green-600",
          suitability.tone === "caution" && "text-amber",
          suitability.tone === "poor" && "text-red-500",
        )}
      >
        {suitability.label}
      </p>

      <p className="mt-2 text-xs text-[var(--theme-text-muted)]">
        Forecasts are indicative — final go/no-go is confirmed before departure.{" "}
        <Link href="/weather" className="text-amber underline-offset-2 hover:underline">
          Full 7-day forecast
        </Link>
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--theme-bg)]/60 px-3 py-2">
      <p className="text-xs text-[var(--theme-text-muted)]">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function FishingBadge({ rating }: { rating: FishingRating }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-600">
      🎣 {rating.label}
    </span>
  );
}
