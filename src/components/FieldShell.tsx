import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type FieldShellProps = {
  id: string;
  label: string;
  /** Label floats up: the field has focus, an open menu, or a value. */
  active: boolean;
  /** Field has a value — text goes from 20% black to full black. */
  visible: boolean;
  invalid: boolean;
  wide?: boolean;
  /** Render the select chevron after the label. */
  arrow?: boolean;
  /** Chevron rotated 180° because the menu is open. */
  arrowOpen?: boolean;
  /** Validation message — rendered visually hidden, referenced by the control. */
  error?: string;
  /**
   * "label" for real inputs; "span" for the dropdown, whose accessible name
   * comes from aria-labelledby on its trigger button instead.
   */
  labelAs?: "label" | "span";
  /** Called when the user clicks the field's own padding, not a child. */
  onActivate?: () => void;
  children: ReactNode;
};

/**
 * The hairline row shared by every control.
 *
 * The placeholder is `pointer-events: none` (so it never eats clicks) and
 * absolutely positioned at exactly where typed text sits, which is what lets
 * it fly to `bottom: 100%` when the field goes active. Clicks on the field's
 * own padding are forwarded to the control via `onActivate`.
 */
export function FieldShell({
  id,
  label,
  active,
  visible,
  invalid,
  wide,
  arrow,
  arrowOpen,
  error,
  labelAs = "label",
  onActivate,
  children,
}: FieldShellProps) {
  const placeholderClass = cx(
    "contact-form__placeholder",
    arrow && "arrow",
    arrowOpen && "is-open",
  );

  return (
    <div
      className={cx(
        "contact-form__field",
        wide && "contact-form__field_wide",
        active && "active",
        visible && "visible",
        invalid && "invalid",
      )}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
          onActivate?.();
        }
      }}
    >
      {children}

      {labelAs === "label" ? (
        <label htmlFor={id} className={placeholderClass}>
          {label}
        </label>
      ) : (
        <span id={`${id}-label`} className={placeholderClass}>
          {label}
        </span>
      )}

      {/* The design shows no visible per-field error text, so the message
          lives here for assistive tech and the red hairline carries it
          visually. */}
      {error ? (
        <span id={`${id}-error`} className="sr-only">
          {error}
        </span>
      ) : null}
    </div>
  );
}
