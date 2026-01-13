export type SessionCenter = [number, number];

/**
 * Safely read and validate the initial location persisted in sessionStorage.
 * Returns a tuple [lat, lng] when available and valid, otherwise null.
 */
export function getSessionInitialLocation(): SessionCenter | null {
  try {
    const raw = sessionStorage.getItem("locationSession");
    if (!raw) return null;

    const parsed = JSON.parse(raw) as {
      state?: { initialLocationUser?: unknown };
    } | null;

    const fromStorage = parsed?.state?.initialLocationUser as
      | [number, number]
      | undefined
      | null;

    if (
      Array.isArray(fromStorage) &&
      fromStorage.length === 2 &&
      typeof fromStorage[0] === "number" &&
      typeof fromStorage[1] === "number"
    ) {
      return fromStorage;
    }

    return null;
  } catch (error) {
    console.error(
      "[sessionInitialLocation] Failed to parse locationSession from sessionStorage:",
      error,
    );
    return null;
  }
}
