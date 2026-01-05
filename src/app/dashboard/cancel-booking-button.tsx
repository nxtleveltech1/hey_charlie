"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CancelBookingButtonProps {
  bookingId: string;
}

export function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
        >
          {isLoading ? "..." : "Yes, Cancel"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-4 py-2 rounded-lg border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors text-sm"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-4 py-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors text-sm"
    >
      Cancel
    </button>
  );
}

