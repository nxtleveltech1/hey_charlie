"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { cn } from "@/lib/utils";
import {
  getWindDirectionLabel,
  formatTemperature,
  formatWindSpeed,
  formatHeight,
  formatTime,
  formatDate,
  type MarineConditions,
  type FishingRating,
  type TideData,
  type SunTimes,
  type WeatherAlert,
  type DailyForecast,
} from "@/lib/weather-service";

interface CurrentWeatherResponse {
  available: boolean;
  reason?: string;
  conditions: MarineConditions | null;
  fishingRating: FishingRating | null;
  alerts: WeatherAlert[];
  sunTimes: SunTimes | null;
  tides: TideData[];
}

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

export default function WeatherPage() {
  const [current, setCurrent] = useState<CurrentWeatherResponse | null>(null);
  const [forecastDays, setForecastDays] = useState<DailyForecast[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const [currentRes, forecastRes] = await Promise.all([
          fetch("/api/weather?type=current"),
          fetch("/api/weather?type=forecast&days=14"),
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
          throw new Error("Failed to fetch weather");
        }

        const currentData = (await currentRes.json()) as CurrentWeatherResponse;
        const forecastData =
          (await forecastRes.json()) as ForecastWeatherResponse;

        setCurrent(currentData);

        if (forecastData.available && forecastData.forecast.length > 0) {
          setForecastDays(forecastData.forecast.map(parseForecastDay));
          setError(null);
        } else if (currentData.available && currentData.conditions) {
          setError(null);
        } else {
          setError(
            forecastData.reason === "configuration" ||
              currentData.reason === "configuration"
              ? "Weather service is not configured."
              : "Weather data is temporarily unavailable.",
          );
        }
      } catch (fetchError) {
        console.error("Error fetching weather:", fetchError);
        setError("Unable to load weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedDay = forecastDays[selectedDayIndex] ?? null;
  const isToday = selectedDayIndex === 0;

  const display = useMemo(() => {
    if (isToday && current?.available && current.conditions) {
      return {
        conditions: current.conditions,
        fishingRating:
          current.fishingRating ??
          selectedDay?.fishingRating ??
          null,
        tides: current.tides.length > 0 ? current.tides : selectedDay?.tides ?? [],
        sunTimes: current.sunTimes ?? selectedDay?.sunTimes ?? null,
        label: "Current Conditions",
      };
    }

    if (selectedDay) {
      return {
        conditions: selectedDay.conditions,
        fishingRating: selectedDay.fishingRating,
        tides: selectedDay.tides,
        sunTimes: selectedDay.sunTimes,
        label: isToday ? "Today's Forecast" : "Forecast",
      };
    }

    if (current?.available && current.conditions) {
      return {
        conditions: current.conditions,
        fishingRating: current.fishingRating,
        tides: current.tides,
        sunTimes: current.sunTimes,
        label: "Current Conditions",
      };
    }

    return null;
  }, [current, selectedDay, isToday]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (!display) {
    return (
      <div className="wide-shell py-24 text-center">
        <p className="mb-4 text-[var(--theme-text-muted)]">
          {error ?? "Unable to load weather data"}
        </p>
        <Button type="button" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const alerts = current?.alerts ?? [];
  const { conditions, fishingRating, sunTimes, tides, label } = display;

  if (!fishingRating) {
    return (
      <div className="wide-shell py-24 text-center">
        <p className="mb-4 text-[var(--theme-text-muted)]">
          Forecast details are unavailable for this day.
        </p>
        <Button type="button" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const ratingStars =
    "★".repeat(Math.floor(fishingRating.score)) +
    "☆".repeat(5 - Math.floor(fishingRating.score));

  return (
    <>
      <section className="relative bg-gradient-to-b from-[var(--theme-surface)] to-[var(--theme-bg)] pb-8 pt-28 lg:pt-32">
        <div className="wide-shell">
          <h1 className="mb-2 text-center text-4xl font-bold md:text-6xl lg:text-7xl">
            Marine <span className="text-orange-500">Weather</span>
          </h1>
          <p className="text-center text-[var(--theme-text-muted)]">
            14-day marine forecast for Cape Town — select a date to plan your trip
          </p>
        </div>
      </section>

      {forecastDays.length > 0 && (
        <section className="wide-shell mb-8">
          <p className="mb-3 text-sm font-medium text-[var(--theme-text-muted)]">
            Select date
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {forecastDays.map((day, index) => {
              const isActive = index === selectedDayIndex;
              const chipLabel =
                index === 0 ? "Today" : formatDate(day.date);
              return (
                <button
                  key={day.date.toISOString()}
                  type="button"
                  onClick={() => setSelectedDayIndex(index)}
                  className={cn(
                    "min-h-11 shrink-0 rounded-xl px-4 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-amber font-medium text-ink"
                      : "bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)]",
                  )}
                  aria-pressed={isActive}
                >
                  {chipLabel}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {alerts.length > 0 && (
        <section className="wide-shell -mt-4 mb-8">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`mb-2 rounded-xl p-4 ${alert.severity === "critical" ? "border border-red-500/50 bg-red-500/20" : alert.severity === "warning" ? "border border-yellow-500/50 bg-yellow-500/20" : "border border-blue-500/50 bg-blue-500/20"}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {alert.severity === "critical"
                    ? "🚨"
                    : alert.severity === "warning"
                      ? "⚠️"
                      : "ℹ️"}
                </span>
                <div>
                  <h3 className="font-semibold">{alert.title}</h3>
                  <p className="text-sm opacity-80">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="wide-shell pb-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-[var(--theme-surface)] p-6 lg:col-span-1">
            <h2 className="mb-4 text-lg font-semibold">🎣 Fishing Rating</h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400">
                {fishingRating.label}
              </div>
              <div className="mt-2 text-2xl text-orange-400">{ratingStars}</div>
              <div className="mt-4 text-sm text-[var(--theme-text-muted)]">
                {fishingRating.reasons.slice(0, 3).map((reason, i) => (
                  <p key={i}>{reason}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 lg:col-span-2 2xl:col-span-3">
            <h2 className="mb-4 text-lg font-semibold">🌊 {label}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 2xl:grid-cols-6">
              <div className="rounded-xl bg-[var(--theme-bg)] p-4 text-center">
                <div className="mb-1 text-3xl">🌡️</div>
                <div className="text-xl font-bold">
                  {formatTemperature(conditions.airTemperature)}
                </div>
                <div className="text-xs text-[var(--theme-text-muted)]">
                  Air Temp
                </div>
              </div>
              <div className="rounded-xl bg-[var(--theme-bg)] p-4 text-center">
                <div className="mb-1 text-3xl">💧</div>
                <div className="text-xl font-bold">
                  {conditions.waterTemperature > 0
                    ? formatTemperature(conditions.waterTemperature)
                    : "—"}
                </div>
                <div className="text-xs text-[var(--theme-text-muted)]">
                  Water Temp
                </div>
              </div>
              <div className="rounded-xl bg-[var(--theme-bg)] p-4 text-center">
                <div className="mb-1 text-3xl">💨</div>
                <div className="text-xl font-bold">
                  {formatWindSpeed(conditions.windSpeed)}
                </div>
                <div className="text-xs text-[var(--theme-text-muted)]">
                  {getWindDirectionLabel(conditions.windDirection)}
                </div>
              </div>
              <div className="rounded-xl bg-[var(--theme-bg)] p-4 text-center">
                <div className="mb-1 text-3xl">🌊</div>
                <div className="text-xl font-bold">
                  {formatHeight(conditions.swellHeight)}
                </div>
                <div className="text-xs text-[var(--theme-text-muted)]">
                  Swell
                </div>
              </div>
              <div className="rounded-xl bg-[var(--theme-bg)] p-4 text-center">
                <div className="mb-1 text-3xl">〰️</div>
                <div className="text-xl font-bold">
                  {formatHeight(conditions.waveHeight)}
                </div>
                <div className="text-xs text-[var(--theme-text-muted)]">
                  Waves
                </div>
              </div>
              <div className="rounded-xl bg-[var(--theme-bg)] p-4 text-center">
                <div className="mb-1 text-3xl">👁️</div>
                <div className="text-xl font-bold">
                  {conditions.visibility > 0
                    ? `${conditions.visibility.toFixed(0)} km`
                    : "—"}
                </div>
                <div className="text-xs text-[var(--theme-text-muted)]">
                  Visibility
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6">
            <h2 className="mb-4 text-lg font-semibold">
              🌙 {isToday ? "Today's Tides" : "Tides"}
            </h2>
            {tides.length > 0 ? (
              <div className="space-y-3">
                {tides.map((tide, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-[var(--theme-bg)] p-3"
                  >
                    <span
                      className={
                        tide.type === "high" ? "text-blue-400" : "text-orange-400"
                      }
                    >
                      {tide.type === "high" ? "↑ High" : "↓ Low"}
                    </span>
                    <span className="font-mono">
                      {formatTime(new Date(tide.time))}
                    </span>
                    <span className="text-[var(--theme-text-muted)]">
                      {formatHeight(tide.height)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--theme-text-muted)]">
                Tide data unavailable for this date.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6">
            <h2 className="mb-4 text-lg font-semibold">☀️ Sun Times</h2>
            {sunTimes ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-[var(--theme-bg)] p-4 text-center">
                  <div className="mb-1 text-2xl">🌅</div>
                  <div className="font-bold">
                    {formatTime(new Date(sunTimes.sunrise))}
                  </div>
                  <div className="text-xs text-[var(--theme-text-muted)]">
                    Sunrise
                  </div>
                </div>
                <div className="rounded-xl bg-[var(--theme-bg)] p-4 text-center">
                  <div className="mb-1 text-2xl">🌇</div>
                  <div className="font-bold">
                    {formatTime(new Date(sunTimes.sunset))}
                  </div>
                  <div className="text-xs text-[var(--theme-text-muted)]">
                    Sunset
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--theme-text-muted)]">
                Sun times unavailable for this date.
              </p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-center">
            <h3 className="mb-2 text-xl font-bold text-white">
              Ready to Go Fishing?
            </h3>
            <p className="mb-4 text-sm text-white/80">Book your charter today</p>
            <Link
              href="/packages"
              className="rounded-lg bg-white px-6 py-2 font-semibold text-orange-600 transition-colors hover:bg-white/90"
            >
              View Packages
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
