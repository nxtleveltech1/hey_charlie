"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { WeatherAlert } from "@/db/schema";

export default function EditWeatherAlertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    severity: "warning",
    activeFrom: "",
    activeTo: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const res = await fetch(`/api/weather-alerts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: WeatherAlert = await res.json();
        setFormData({
          title: data.title,
          message: data.message,
          severity: data.severity,
          activeFrom: new Date(data.activeFrom).toISOString().slice(0, 16),
          activeTo: new Date(data.activeTo).toISOString().slice(0, 16),
          isActive: data.isActive,
        });
      } catch (err) {
        setError("Failed to load alert");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlert();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/weather-alerts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      router.push("/admin/weather-alerts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/weather-alerts" className="text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]">← Back to Weather Alerts</Link>
        <h1 className="text-3xl font-bold mt-2">Edit Weather Alert</h1>
      </div>

      {error && <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--theme-surface)] p-6 rounded-xl border border-[var(--theme-border)]">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Message *</label>
          <textarea rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Severity *</label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "info", label: "Info", icon: "ℹ️", color: "border-blue-500 bg-blue-500/10" },
              { value: "warning", label: "Warning", icon: "⚠️", color: "border-yellow-500 bg-yellow-500/10" },
              { value: "critical", label: "Critical", icon: "🚨", color: "border-red-500 bg-red-500/10" },
            ].map((option) => (
              <button key={option.value} type="button" onClick={() => setFormData({ ...formData, severity: option.value })} className={`p-4 rounded-lg border-2 transition-all ${formData.severity === option.value ? option.color : "border-[var(--theme-border)]"}`}>
                <span className="text-2xl block mb-1">{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Active From *</label>
            <input type="datetime-local" required value={formData.activeFrom} onChange={(e) => setFormData({ ...formData, activeFrom: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Active To *</label>
            <input type="datetime-local" required value={formData.activeTo} onChange={(e) => setFormData({ ...formData, activeTo: e.target.value })} className="w-full px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
          <label htmlFor="isActive" className="text-sm">Active</label>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
          <Link href="/admin/weather-alerts" className="px-6 py-2 bg-[var(--theme-bg)] rounded-lg hover:bg-[var(--theme-border)] transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

