"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BookingStatusFormProps {
  bookingId: string;
  currentStatus: string;
}

const statuses = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "confirmed", label: "Confirmed", color: "bg-green-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
  { value: "completed", label: "Completed", color: "bg-blue-500" },
];

export function BookingStatusForm({ bookingId, currentStatus }: BookingStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {statuses.map((s) => (
        <button
          key={s.value}
          onClick={() => handleStatusChange(s.value)}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg text-left text-sm transition-all flex items-center gap-3 ${
            status === s.value
              ? "bg-[var(--theme-surface)] border-2 border-orange-500"
              : "border border-[var(--theme-border)] hover:bg-[var(--theme-surface)]"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span className={`w-3 h-3 rounded-full ${s.color}`} />
          {s.label}
          {status === s.value && (
            <span className="ml-auto text-orange-500">✓</span>
          )}
        </button>
      ))}
    </div>
  );
}

