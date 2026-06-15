const DRAFT_PREFIX = "hcc-booking-draft:";

export interface BookingDraft {
  formData: {
    date: string;
    timeSlot: string;
    guestCount: number;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    specialRequests: string;
    dietaryRequirements: string;
  };
  step: number;
  savedAt: string;
}

export function saveBookingDraft(packageId: string, draft: Omit<BookingDraft, "savedAt">) {
  if (typeof window === "undefined") return;
  try {
    const payload: BookingDraft = { ...draft, savedAt: new Date().toISOString() };
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
    return JSON.parse(raw) as BookingDraft;
  } catch {
    return null;
  }
}

export function clearBookingDraft(packageId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${DRAFT_PREFIX}${packageId}`);
}
