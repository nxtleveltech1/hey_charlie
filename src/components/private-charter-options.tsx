import { PRIVATE_OPTIONS } from "@/lib/private-charters";
import { formatPrice } from "@/lib/booking-utils";

export function PrivateCharterOptions() {
  return <div className="my-4 space-y-2 text-sm" aria-label="Private charter prices">
    {PRIVATE_OPTIONS.map((option) => <div key={option.id} className="flex flex-wrap justify-between gap-2">
      <span>{option.label}</span><strong>{formatPrice(option.price)} per person</strong>
    </div>)}
    <div className="border-t border-[var(--theme-border)] pt-2">Add lunch — R500 per person</div>
    <div>Add drinks — R500 per person</div>
  </div>;
}
