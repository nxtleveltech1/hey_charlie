"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { WeatherAlert } from "@/db/schema";

const severityColors: Record<string, string> = {
  info: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  critical: "bg-red-500/20 text-red-400 border-red-500/50",
};

const severityIcons: Record<string, string> = {
  info: "ℹ️",
  warning: "⚠️",
  critical: "🚨",
};

export default function AdminWeatherAlertsPage() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/weather-alerts");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      setError("Failed to load weather alerts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alert?")) return;
    
    try {
      const res = await fetch(`/api/weather-alerts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setAlerts(alerts.filter((a) => a.id !== id));
    } catch (err) {
      setError("Failed to delete alert");
      console.error(err);
    }
  };

  const isAlertActive = (alert: WeatherAlert) => {
    const now = new Date();
    return alert.isActive && new Date(alert.activeFrom) <= now && new Date(alert.activeTo) >= now;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Weather Alerts</h1>
          <p className="text-[var(--theme-text-muted)] mt-1">Manage marine weather warnings and notifications</p>
        </div>
        <Link href="/admin/weather-alerts/new" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          + New Alert
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">{error}</div>
      )}

      {alerts.length === 0 ? (
        <div className="text-center py-12 bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)]">
          <p className="text-[var(--theme-text-muted)]">No weather alerts yet.</p>
          <Link href="/admin/weather-alerts/new" className="text-orange-400 hover:text-orange-300 mt-2 inline-block">
            Create your first alert
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const active = isAlertActive(alert);
            return (
              <div key={alert.id} className={`p-4 rounded-xl border ${severityColors[alert.severity]} ${!active ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <span className="text-2xl">{severityIcons[alert.severity]}</span>
                    <div>
                      <h3 className="font-semibold">{alert.title}</h3>
                      <p className="text-sm opacity-80 mt-1">{alert.message}</p>
                      <div className="mt-2 flex gap-4 text-xs opacity-70">
                        <span>From: {new Date(alert.activeFrom).toLocaleString()}</span>
                        <span>To: {new Date(alert.activeTo).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-1 text-xs rounded-full ${active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                      {active ? "Active" : "Inactive"}
                    </span>
                    <Link href={`/admin/weather-alerts/${alert.id}`} className="px-3 py-1.5 text-sm bg-black/20 rounded-lg hover:bg-black/30 transition-colors">Edit</Link>
                    <button onClick={() => deleteAlert(alert.id)} className="px-3 py-1.5 text-sm hover:bg-black/20 rounded-lg transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

