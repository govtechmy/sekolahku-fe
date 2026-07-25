import { useMemo } from "react";
import { prefetchCarianSekolah } from "../services/prefetch.svc";

/**
 * Returns event handlers that warm the `carian-sekolah` data as soon as the
 * user shows intent to go there — hovering, keyboard-focusing or touching the
 * trigger — so the actual navigation feels instant.
 *
 * Spread onto any element that leads to the map page:
 *
 * ```tsx
 * const prefetchProps = usePrefetchCarianSekolah();
 * <Link to="/ms/carian-sekolah" {...prefetchProps}>Carian Sekolah</Link>
 * ```
 */
export function usePrefetchCarianSekolah() {
  return useMemo(
    () => ({
      onMouseEnter: prefetchCarianSekolah,
      onFocus: prefetchCarianSekolah,
      // `touchstart` fires before `click` on mobile, buying a head start.
      onTouchStart: prefetchCarianSekolah,
    }),
    [],
  );
}
