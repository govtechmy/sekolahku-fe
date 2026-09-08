/**
 * A lightweight loading indicator shown when a backend fallback search is in
 * progress. Renders a spinning circle + "Mencari lagi..." text.
 *
 * Use this in search result dropdowns/lists to communicate that a secondary
 * (backend) search is running after the frontend search returned no or low-
 * confidence results.
 */

interface SearchFallbackIndicatorProps {
  /** Whether the indicator should be visible. Renders nothing when false. */
  visible: boolean;
  /** Additional CSS classes for the container. */
  className?: string;
}

export function SearchFallbackIndicator({
  visible,
  className = "",
}: SearchFallbackIndicatorProps) {
  if (!visible) return null;

  return (
    <div
      className={`flex items-center justify-center gap-2 px-4 py-4 text-sm text-gray-500 ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      <span>Mencari lagi...</span>
    </div>
  );
}
