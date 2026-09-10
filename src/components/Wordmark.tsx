/**
 * Full-width logotype at the foot of the page.
 *
 * The reference uses a fixed 450×60 SVG logotype. We have no Vision Infinite
 * artwork, so this renders live text with `textLength` — which makes it fill
 * the viewBox exactly at any viewport width, rather than guessing with
 * clamp(). Swap the whole component for the real SVG when it exists.
 *
 * Caveat: textLength is measured after the webfont loads, so `font-display:
 * swap` reflows this one element once.
 */
export function Wordmark() {
  return (
    <svg
      viewBox="0 0 450 60"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Vision Infinite"
    >
      <text
        x="0"
        y="48"
        textLength="450"
        lengthAdjust="spacingAndGlyphs"
        fill="currentColor"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "56px",
          fontWeight: 640,
          fontVariationSettings: '"wght" 640',
        }}
      >
        VISION INFINITE
      </text>
    </svg>
  );
}
