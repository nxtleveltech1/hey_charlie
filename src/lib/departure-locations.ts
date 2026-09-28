import { z } from "zod";

export const DEPARTURE_LOCATIONS = [
  { id: "hout-bay", label: "Houtbay Harbor" },
  { id: "simons-town", label: "Simons Town" },
] as const;

export type DepartureLocationId = (typeof DEPARTURE_LOCATIONS)[number]["id"];

export const DEFAULT_DEPARTURE_LOCATION: DepartureLocationId = "hout-bay";

export const departureLocationSchema = z.enum([
  "hout-bay",
  "simons-town",
]);

export function formatDepartureLocation(
  id: string | null | undefined,
): string {
  const match = DEPARTURE_LOCATIONS.find((loc) => loc.id === id);
  return match?.label ?? "Not specified";
}
