export default function AdminSettingsPage() {
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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Business Details */}
        <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
          <h2 className="text-lg font-semibold mb-4">Business Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name</label>
              <input
                type="text"
                defaultValue="Hey Charlie Charters"
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <input
                type="email"
                defaultValue="ahoy@heycharliecharters.co.za"
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Phone</label>
              <input
                type="tel"
                defaultValue="+27 12 345 6789"
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                defaultValue="V&A Waterfront, Cape Town"
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
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
                defaultValue={1}
                min={0}
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Maximum Advance Booking (days)</label>
              <input
                type="number"
                defaultValue={90}
                min={1}
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--theme-surface)]">
              <div>
                <p className="font-medium">Auto-confirm Bookings</p>
                <p className="text-sm text-[var(--theme-text-muted)]">Automatically confirm new bookings</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-[var(--theme-border)] relative">
                <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--theme-surface)]">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-[var(--theme-text-muted)]">Receive email for new bookings</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-orange-500 relative">
                <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)]">
          <h2 className="text-lg font-semibold mb-4">Time Slots</h2>
          <div className="space-y-3">
            {[
              { name: "Morning", time: "08:00 - 12:00", active: true },
              { name: "Afternoon", time: "13:00 - 17:00", active: true },
              { name: "Sunset", time: "17:00 - 20:00", active: true },
            ].map((slot) => (
              <div
                key={slot.name}
                className="flex items-center justify-between p-4 rounded-xl bg-[var(--theme-surface)]"
              >
                <div>
                  <p className="font-medium">{slot.name}</p>
                  <p className="text-sm text-[var(--theme-text-muted)]">{slot.time}</p>
                </div>
                <span className={`w-3 h-3 rounded-full ${slot.active ? "bg-green-500" : "bg-red-500"}`} />
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
              <button className="px-4 py-2 rounded-lg border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors text-sm">
                Export
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete All Cancelled Bookings</p>
                <p className="text-sm text-[var(--theme-text-muted)]">Permanently remove cancelled bookings</p>
              </div>
              <button className="px-4 py-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity">
          Save Settings
        </button>
      </div>
    </div>
  );
}

