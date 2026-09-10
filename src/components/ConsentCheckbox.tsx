import { cx } from "@/lib/cx";
import { CONSENT_TEXT } from "@/lib/fields";

type Props = {
  checked: boolean;
  invalid: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
};

export function ConsentCheckbox({ checked, invalid, error, onChange }: Props) {
  return (
    <label className="checkbox-container">
      {/* The reference uses `display: none` here, which removes the control
          from the accessibility tree and makes it unfocusable. contact.css
          visually-hides it instead and adds a focus ring on the box. */}
      <input
        type="checkbox"
        name="consent"
        className="checkbox-input"
        checked={checked}
        aria-invalid={invalid || undefined}
        aria-describedby={error ? "consent-error" : undefined}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={cx("checkbox-paragraph-label", invalid && "invalid")} aria-hidden="true" />
      <span className={cx("checkbox-paragraph", checked && "checked", invalid && "invalid")}>
        {CONSENT_TEXT}
      </span>
      {error ? (
        <span id="consent-error" className="sr-only">
          {error}
        </span>
      ) : null}
    </label>
  );
}
