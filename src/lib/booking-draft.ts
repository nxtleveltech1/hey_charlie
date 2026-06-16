import type { SelectedAddonsMap } from "@/lib/addon-pricing";
import {
  DEFAULT_DEPARTURE_LOCATION,
  type DepartureLocationId,
} from "@/lib/departure-locations";

const DRAFT_PREFIX = "hcc-booking-draft:";

export interface BookingDraft {
  formData: {
    date: string;
    timeSlots: string[];
    guestCount: number;
    departureLocation: DepartureLocationId;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    specialRequests: string;
    dietaryRequirements: string;
  };
  selectedAddons: SelectedAddonsMap;
  step: number;
  savedAt: string;
}

function addonIdsToMap(ids: string[]): SelectedAddonsMap {
  return Object.fromEntries(ids.map((id) => [id, 1]));
}

export function saveBookingDraft(
  packageId: string,
  draft: Omit<BookingDraft, "savedAt">,
) {
  if (typeof window === "undefined") return;
  try {
    const payload: BookingDraft = {
      ...draft,
      selectedAddons: draft.selectedAddons ?? {},
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(`${DRAFT_PREFIX}${packageId}`, JSON.stringify(payload));
  } catch {
    /* storage full or private mode */
  }
}

export function loadBookingDraft(packageId: string): BookingDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${packageId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BookingDraft & {
      formData?: { timeSlot?: string; timeSlots?: string[] };
      selectedAddonIds?: string[];
    };
    const timeSlots =
      parsed.formData?.timeSlots ??
      (parsed.formData?.timeSlot ? [parsed.formData.timeSlot] : []);
    const selectedAddons =
      parsed.selectedAddons ??
      (parsed.selectedAddonIds ? addonIdsToMap(parsed.selectedAddonIds) : {});
    return {
      ...parsed,
      formData: {
        ...parsed.formData,
        timeSlots,
        departureLocation:
          parsed.formData?.departureLocation ?? DEFAULT_DEPARTURE_LOCATION,
      } as BookingDraft["formData"],
      selectedAddons,
    };
  } catch {
    return null;
  }
}

export function clearBookingDraft(packageId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${DRAFT_PREFIX}${packageId}`);
}
