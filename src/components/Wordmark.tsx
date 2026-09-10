/**
 * Full-width logotype at the foot of the page.
 *
 * Renders live text with SVG `textLength`, which makes it fill the viewBox
 * exactly at any viewport width rather than guessing with clamp(). Swap the
 * whole component for real artwork when it exists.
 *
 * Do NOT add letter-spacing: `lengthAdjust="spacingAndGlyphs"` already opens
 * the tracking to fill textLength=450 (VISION INFINIE is 6.787em ≈ 380px at
 * 56px, so it stretches ~18%), and tracking would fight it.
 *
 * The viewBox height is Valturin's cap height, not an em box: at 56px the
 * caps are 40.7px tall, so a 60px box would waste 12px underneath.
 *
 * Caveat: textLength is measured after the webfont loads, so `font-display:
 * swap` reflows this one element once.
 */
export function Wordmark() {
  return (
    <svg
      viewBox="0 0 450 48"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Vision infinie"
    >
      <text
        x="0"
        y="44"
        textLength="450"
        lengthAdjust="spacingAndGlyphs"
        fill="currentColor"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "56px",
          // 400 is the only weight Valturin has.
          fontWeight: 400,
        }}
      >
        VISION INFINIE
      </text>
    </svg>
  );
}
