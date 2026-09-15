import { useRef } from "react";
import { FieldShell } from "./FieldShell";

type Props = {
  id: string;
  name: string;
  label: string;
  kind: "text" | "email" | "textarea" | "number";
  value: string;
  active: boolean;
  invalid: boolean;
  wide?: boolean;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
};

export function TextField({
  id,
  name,
  label,
  kind,
  value,
  active,
  invalid,
  wide,
  required,
  autoComplete,
  error,
  onChange,
  onFocus,
  onBlur,
}: Props) {
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const shared = {
    id,
    name,
    value,
    className: "contact-form__input",
    autoComplete,
    required,
    "aria-invalid": invalid || undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    onFocus,
    onBlur,
  } as const;

  return (
    <FieldShell
      id={id}
      label={label}
      active={active}
      visible={value.trim().length > 0}
      invalid={invalid}
      wide={wide}
      error={error}
      onActivate={() => ref.current?.focus()}
    >
      {kind === "textarea" ? (
        <textarea
          {...shared}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={1}
          maxLength={5000}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          {...shared}
          ref={ref as React.Ref<HTMLInputElement>}
          type={kind}
          // maxLength does nothing on type="number" — min + inputMode are what
          // actually constrain it, and the latter gets the numeric keypad.
          {...(kind === "number"
            ? { min: 1, inputMode: "numeric" as const }
            : { maxLength: 2000 })}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </FieldShell>
  );
}
