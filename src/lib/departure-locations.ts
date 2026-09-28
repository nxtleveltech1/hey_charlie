import { z } from "zod";

export const DEPARTURE_LOCATIONS = [
  { id: "hout-bay", label: "Houtbay Harbor" },
] as const;

export type DepartureLocationId = (typeof DEPARTURE_LOCATIONS)[number]["id"];

export const DEFAULT_DEPARTURE_LOCATION: DepartureLocationId = "hout-bay";

export const departureLocationSchema = z.literal(DEFAULT_DEPARTURE_LOCATION);

export function formatDepartureLocation(
  id: string | null | undefined,
): string {
  const match = DEPARTURE_LOCATIONS.find((loc) => loc.id === id);
  return match?.label ?? "Not specified";
}
