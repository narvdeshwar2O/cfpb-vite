import { locationData } from "./locationData";

/**
 * Canonical list of state/agency names, derived from the same source the data
 * uses (locationData mirrors the /states-data API shape). Used for the
 * state-assignment dropdown so values match the data's naming for scoping.
 */
export const STATE_OPTIONS: string[] = Array.from(
  new Set(
    ((locationData?.data ?? []) as Array<{ state_name?: string }>)
      .map((s) => s.state_name)
      .filter((name): name is string => !!name)
  )
).sort((a, b) => a.localeCompare(b));

/**
 * Resolves a stored state value to its canonical option (case-insensitive), so
 * e.g. "Bihar" displays as the option "BIHAR". Returns the original value when
 * there's no match (keeps unknown/legacy values selectable).
 */
export function normalizeState(value: string | null | undefined): string {
  if (!value) return "";
  const match = STATE_OPTIONS.find((s) => s.toLowerCase() === value.toLowerCase());
  return match ?? value;
}
