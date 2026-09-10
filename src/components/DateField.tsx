import { useMemo, useRef, useState } from "react";
import { FieldShell } from "./FieldShell";

type Props = {
  id: string;
  name: string;
  label: string;
  value: string;
  active: boolean;
  invalid: boolean;
  error?: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
};

/**
 * Native <input type="date"> — no dependency.
 *
 * The design has no visible calendar chrome, so everything it specifies is
 * achievable natively, and we get keyboard support, mobile pickers and
 * accessibility for free. The tradeoff is that the popup calendar looks like
 * Chrome's / iOS's rather than a custom panel.
 *
 * One quirk to work around: Chrome and Edge paint "mm/dd/yyyy" inside an
 * empty date input, which collides with the floating placeholder. So the
 * input renders as type="text" until it is focused or has a value. Swapping
 * `type` on a controlled input whose value is "" is safe in React 19, and
 * Chrome keeps focus across the swap.
 */
export function DateField({
  id,
  name,
  label,
  value,
  active,
  invalid,
  error,
  onChange,
  onFocus,
  onBlur,
}: Props) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [asDate, setAsDate] = useState(false);

  const todayISO = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  return (
    <FieldShell
      id={id}
      label={label}
      active={active}
      visible={value.length > 0}
      invalid={invalid}
      arrow
      error={error}
      onActivate={() => {
        setAsDate(true);
        ref.current?.focus();
      }}
    >
      <input
        id={id}
        name={name}
        ref={ref}
        className="contact-form__input"
        type={asDate || value ? "date" : "text"}
        value={value}
        min={todayISO}
        inputMode="none"
        aria-invalid={invalid || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          setAsDate(true);
          onFocus();
        }}
        onBlur={() => {
          if (!value) setAsDate(false);
          onBlur();
        }}
      />
    </FieldShell>
  );
}
