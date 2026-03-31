"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { getWindDirectionLabel, formatTemperature, formatWindSpeed, formatHeight, formatTime, type MarineConditions, type FishingRating, type TideData, type SunTimes, type WeatherAlert } from "@/lib/weather-service";

interface WeatherData {
  conditions: MarineConditions;
  fishingRating: FishingRating;
  alerts: WeatherAlert[];
  sunTimes: SunTimes;
  tides: TideData[];
  error?: string;
}

export default function WeatherPage() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("/api/weather?type=current");
        if (!res.ok) throw new Error("Failed to fetch weather");
        const weatherData = await res.json();
        setData(weatherData);
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--theme-bg)] flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[var(--theme-bg)] flex items-center justify-center pt-20">
        <p className="text-[var(--theme-text-muted)]">Unable to load weather data</p>
      </main>
    );
  }

  const { conditions, fishingRating, alerts, sunTimes, tides } = data;
  const ratingStars = "★".repeat(Math.floor(fishingRating.score)) + "☆".repeat(5 - Math.floor(fishingRating.score));

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">
      <MobileNav />

      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 w-full border-b border-[var(--theme-border)] backdrop-blur-2xl z-50 transition-colors duration-300" style={{ backgroundColor: 'var(--theme-nav-bg-transparent)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-4">
              <Image src="/logo2.png" alt="Hey Charlie Charters" width={50} height={50} className="rounded-xl" />
              <div>
                <span className="text-xl font-bold tracking-tight italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-display)" }}>
                  Hey Charlie
                </span>
                <span className="block text-[10px] font-semibold italic tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                  CHARTERS
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link href="/#packages" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">Packages</Link>
              <Link href="/destinations" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">Destinations</Link>
              <Link href="/crew" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">Crew</Link>
              <Link href="/news" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">News</Link>
              <span className="text-sm text-orange-400 font-medium">Weather</span>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <SignedOut>
                <Link href="/sign-in" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">Sign In</Link>
                <Link href="/#packages" className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:opacity-90 transition-opacity">Book Now</Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">My Bookings</Link>
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-9 h-9 ring-2 ring-orange-500/50" } }} />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-8 bg-gradient-to-b from-[var(--theme-surface)] to-[var(--theme-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">Marine <span className="text-orange-500">Weather</span></h1>
          <p className="text-center text-[var(--theme-text-muted)]">Current conditions and fishing forecast</p>
        </div>
      </section>

      {/* Alerts */}
      {alerts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-8">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-xl mb-2 ${alert.severity === "critical" ? "bg-red-500/20 border border-red-500/50" : alert.severity === "warning" ? "bg-yellow-500/20 border border-yellow-500/50" : "bg-blue-500/20 border border-blue-500/50"}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{alert.severity === "critical" ? "🚨" : alert.severity === "warning" ? "⚠️" : "ℹ️"}</span>
                <div>
                  <h3 className="font-semibold">{alert.title}</h3>
                  <p className="text-sm opacity-80">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fishing Rating */}
          <div className="lg:col-span-1 bg-gradient-to-br from-orange-500/20 to-[var(--theme-surface)] rounded-2xl border border-orange-500/30 p-6">
            <h2 className="text-lg font-semibold mb-4">🎣 Fishing Rating</h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400">{fishingRating.label}</div>
              <div className="text-2xl text-orange-400 mt-2">{ratingStars}</div>
              <div className="mt-4 text-sm text-[var(--theme-text-muted)]">
                {fishingRating.reasons.slice(0, 3).map((reason, i) => (<p key={i}>{reason}</p>))}
              </div>
            </div>
          </div>

          {/* Current Conditions */}
          <div className="lg:col-span-2 bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] p-6">
            <h2 className="text-lg font-semibold mb-4">🌊 Current Conditions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[var(--theme-bg)] rounded-xl">
                <div className="text-3xl mb-1">🌡️</div>
                <div className="text-xl font-bold">{formatTemperature(conditions.airTemperature)}</div>
                <div className="text-xs text-[var(--theme-text-muted)]">Air Temp</div>
              </div>
              <div className="text-center p-4 bg-[var(--theme-bg)] rounded-xl">
                <div className="text-3xl mb-1">💧</div>
                <div className="text-xl font-bold">{formatTemperature(conditions.waterTemperature)}</div>
                <div className="text-xs text-[var(--theme-text-muted)]">Water Temp</div>
              </div>
              <div className="text-center p-4 bg-[var(--theme-bg)] rounded-xl">
                <div className="text-3xl mb-1">💨</div>
                <div className="text-xl font-bold">{formatWindSpeed(conditions.windSpeed)}</div>
                <div className="text-xs text-[var(--theme-text-muted)]">{getWindDirectionLabel(conditions.windDirection)}</div>
              </div>
              <div className="text-center p-4 bg-[var(--theme-bg)] rounded-xl">
                <div className="text-3xl mb-1">🌊</div>
                <div className="text-xl font-bold">{formatHeight(conditions.swellHeight)}</div>
                <div className="text-xs text-[var(--theme-text-muted)]">Swell</div>
              </div>
            </div>
          </div>

          {/* Tides */}
          <div className="bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] p-6">
            <h2 className="text-lg font-semibold mb-4">🌙 Today&apos;s Tides</h2>
            <div className="space-y-3">
              {tides.map((tide, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[var(--theme-bg)] rounded-lg">
                  <span className={tide.type === "high" ? "text-blue-400" : "text-orange-400"}>{tide.type === "high" ? "↑ High" : "↓ Low"}</span>
                  <span className="font-mono">{formatTime(new Date(tide.time))}</span>
                  <span className="text-[var(--theme-text-muted)]">{formatHeight(tide.height)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sun Times */}
          <div className="bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] p-6">
            <h2 className="text-lg font-semibold mb-4">☀️ Sun Times</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[var(--theme-bg)] rounded-xl">
                <div className="text-2xl mb-1">🌅</div>
                <div className="font-bold">{formatTime(new Date(sunTimes.sunrise))}</div>
                <div className="text-xs text-[var(--theme-text-muted)]">Sunrise</div>
              </div>
              <div className="text-center p-4 bg-[var(--theme-bg)] rounded-xl">
                <div className="text-2xl mb-1">🌇</div>
                <div className="font-bold">{formatTime(new Date(sunTimes.sunset))}</div>
                <div className="text-xs text-[var(--theme-text-muted)]">Sunset</div>
              </div>
            </div>
          </div>

          {/* Book CTA */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-bold text-white mb-2">Ready to Go Fishing?</h3>
            <p className="text-white/80 text-sm mb-4">Book your charter today</p>
            <Link href="/packages" className="px-6 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-white/90 transition-colors">View Packages</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

