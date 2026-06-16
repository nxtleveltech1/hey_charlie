import { z } from "zod";

export const DEPARTURE_LOCATIONS = [
  { id: "va-waterfront", label: "V&A Waterfront" },
  { id: "hout-bay", label: "Hout Bay" },
  { id: "simons-town", label: "Simons Town" },
] as const;

export type DepartureLocationId = (typeof DEPARTURE_LOCATIONS)[number]["id"];

export const DEFAULT_DEPARTURE_LOCATION: DepartureLocationId = "va-waterfront";

export const departureLocationSchema = z.enum([
  "va-waterfront",
  "hout-bay",
  "simons-town",
]);

export function formatDepartureLocation(
  id: string | null | undefined,
): string {
  const match = DEPARTURE_LOCATIONS.find((loc) => loc.id === id);
  return match?.label ?? "Not specified";
}
