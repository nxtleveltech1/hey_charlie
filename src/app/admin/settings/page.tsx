"use client";

import { useEffect, useState } from "react";
import type { SiteSettings, TimeSlot } from "@/db/schema";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors";

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`w-12 h-6 rounded-full relative transition-colors ${
        on ? "bg-orange-500" : "bg-[var(--theme-border)]"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
          on ? "left-7" : "left-1"
        }`}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<"export" | "delete" | null>(null);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setSettings(data.settings);
        setSlots(data.timeSlots);
      } catch (err) {
        console.error(err);
        setMessage({ kind: "error", text: "Failed to load settings. Refresh to try again." });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const update = (patch: Partial<SiteSettings>) =>
    setSettings((prev) => (prev ? { ...prev, ...patch } : prev));

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: settings.businessName,
          contactEmail: settings.contactEmail,
          contactPhone: settings.contactPhone,
          location: settings.location,
          minAdvanceBookingDays: settings.minAdvanceBookingDays,
          maxAdvanceBookingDays: settings.maxAdvanceBookingDays,
          autoConfirmBookings: settings.autoConfirmBookings,
          emailNotifications: settings.emailNotifications,
          timeSlots: slots.map((s) => ({ id: s.id, isActive: s.isActive })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const detail = Array.isArray(data.details) && data.details[0]?.message;
        throw new Error(detail || data.error || "Failed to save settings");
      }
      setSettings(data.settings);
      setSlots(data.timeSlots);
      setMessage({ kind: "success", text: "Settings saved." });
    } catch (err) {
      setMessage({
        kind: "error",
        text: err instanceof Error ? err.message : "Failed to save settings",
      });
    } finally {
      setSaving(false);
    }
  };

  const exportData = async () => {
    setBusy("export");
    setMessage(null);
    try {
      const res = await fetch("/api/settings/export");
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to export data");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hey-charlie-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMessage({ kind: "success", text: "Export downloaded." });
    } catch (err) {
      setMessage({
        kind: "error",
        text: err instanceof Error ? err.message : "Failed to export data",
      });
    } finally {
      setBusy(null);
    }
  };

  const deleteCancelled = async () => {
    if (
      !confirm(
        "Permanently delete ALL cancelled bookings? This cannot be undone."
      )
    )
      return;
    setBusy("delete");
    setMessage(null);
    try {
      const res = await fetch("/api/settings/cancelled-bookings", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete cancelled bookings");
      setMessage({
        kind: "success",
        text:
          data.deleted === 0
            ? "No cancelled bookings to delete."
            : `Deleted ${data.deleted} cancelled booking(s).`,
      });
    } catch (err) {
      setMessage({
        kind: "error",
        text: err instanceof Error ? err.message : "Failed to delete cancelled bookings",
      });
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
        {message?.text ?? "Failed to load settings."}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Settings
        </h1>
        <p className="text-[var(--theme-text-muted)]">
          Manage your charter business settings
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            message.kind === "success"
              ? "bg-green-500/10 border-green-500/50 text-green-500"
              : "bg-red-500/10 border-red-500/50 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Business Details */}
        <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
          <h2 className="text-lg font-semibold mb-4">Business Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => update({ businessName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => update({ contactEmail: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Phone</label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => update({ contactPhone: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => update({ location: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Booking Settings */}
        <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
          <h2 className="text-lg font-semibold mb-4">Booking Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Advance Booking (days)</label>
              <input
                type="number"
                value={settings.minAdvanceBookingDays}
                min={0}
                onChange={(e) =>
                  update({ minAdvanceBookingDays: parseInt(e.target.value, 10) || 0 })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Maximum Advance Booking (days)</label>
              <input
                type="number"
                value={settings.maxAdvanceBookingDays}
                min={1}
                onChange={(e) =>
                  update({ maxAdvanceBookingDays: parseInt(e.target.value, 10) || 1 })
                }
                className={inputClass}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--theme-surface)]">
              <div>
                <p className="font-medium">Auto-confirm Bookings</p>
                <p className="text-sm text-[var(--theme-text-muted)]">Automatically confirm new bookings</p>
              </div>
              <Toggle
                on={settings.autoConfirmBookings}
                onChange={(v) => update({ autoConfirmBookings: v })}
                label="Auto-confirm bookings"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--theme-surface)]">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-[var(--theme-text-muted)]">Receive email for new bookings</p>
              </div>
              <Toggle
                on={settings.emailNotifications}
                onChange={(v) => update({ emailNotifications: v })}
                label="Email notifications"
              />
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
          <h2 className="text-lg font-semibold mb-4">Time Slots</h2>
          <div className="space-y-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between p-4 rounded-xl bg-[var(--theme-surface)]"
              >
                <div>
                  <p className="font-medium">{slot.name}</p>
                  <p className="text-sm text-[var(--theme-text-muted)]">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </div>
                <Toggle
                  on={slot.isActive}
                  onChange={(v) =>
                    setSlots((prev) =>
                      prev.map((s) => (s.id === slot.id ? { ...s, isActive: v } : s))
                    )
                  }
                  label={`${slot.name} time slot`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
          <h2 className="text-lg font-semibold mb-4 text-red-500">Danger Zone</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export All Data</p>
                <p className="text-sm text-[var(--theme-text-muted)]">Download all bookings and customer data</p>
              </div>
              <button
                onClick={exportData}
                disabled={busy !== null}
                className="px-4 py-2 rounded-lg border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors text-sm disabled:opacity-50"
              >
                {busy === "export" ? "Exporting…" : "Export"}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete All Cancelled Bookings</p>
                <p className="text-sm text-[var(--theme-text-muted)]">Permanently remove cancelled bookings</p>
              </div>
              <button
                onClick={deleteCancelled}
                disabled={busy !== null}
                className="px-4 py-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors text-sm disabled:opacity-50"
              >
                {busy === "delete" ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
