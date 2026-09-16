"use client";

import { useActionState, useRef, useState } from "react";
import { submitContact } from "@/app/actions";
import { ConsentCheckbox } from "./ConsentCheckbox";
import { DateField } from "./DateField";
import { SuccessPopup } from "./SuccessPopup";
import { TextField } from "./TextField";
import { EMPTY_VALUES, FIELDS, type FieldName } from "@/lib/fields";
import { INITIAL_CONTACT_STATE } from "@/lib/contact-types";

export function ContactForm() {
  const [values, setValues] = useState<Record<FieldName, string>>(EMPTY_VALUES);
  const [focused, setFocused] = useState<FieldName | null>(null);
  // const [openMenu, setOpenMenu] = useState<FieldName | null>(null);
  const [consent, setConsent] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  /**
   * `state.errors` is server-owned and only refreshes on the next submit, so
   * without this a field would stay red the whole time the user is fixing it.
   * Editing a field dismisses its error; a new server response clears the set.
   */
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(new Set());

  const sendRef = useRef<HTMLButtonElement | null>(null);
  // Stable across renders — the server rejects submissions faster than 2.5s.
  const [mountedAt] = useState(() => Date.now());

  const [state, formAction, pending] = useActionState(submitContact, INITIAL_CONTACT_STATE);

  // React's "adjust state when a prop changes" pattern, not an effect: a new
  // server response un-dismisses every field, and a successful one resets the
  // form and opens the popup. Doing this during render avoids the extra
  // commit-then-rerender pass an effect would cost.
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    setDismissed(new Set());
    if (state.ok) {
      setShowPopup(true);
      setValues(EMPTY_VALUES);
      setConsent(false);
    }
  }

  const errorFor = (name: string) =>
    dismissed.has(name) ? undefined : state.errors?.[name];

  const dismiss = (name: string) =>
    setDismissed((prev) => {
      if (prev.has(name)) return prev;
      const next = new Set(prev);
      next.add(name);
      return next;
    });

  const set = (name: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    dismiss(name);
  };

  return (
    <>
      <form className="contact-form" action={formAction} noValidate>
        <input
          className="contact-form__hp"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <input type="hidden" name="ts" value={mountedAt} />

        {FIELDS.map((field) => {
          const name = field.name as FieldName;
          const id = `field-${name}`;
          const value = values[name];
          const error = errorFor(name);
          const invalid = Boolean(error);

          // if (field.kind === "select") {
          //   return (
          //     <Dropdown
          //       key={name}
          //       id={id}
          //       name={name}
          //       label={field.label}
          //       options={field.options}
          //       value={value}
          //       open={openMenu === name}
          //       invalid={invalid}
          //       required={"required" in field ? field.required : undefined}
          //       error={error}
          //       onChange={(v) => set(name, v)}
          //       onOpenChange={(open) => setOpenMenu(open ? name : null)}
          //     />
          //   );
          // }

          if (field.kind === "date") {
            return (
              <DateField
                key={name}
                id={id}
                name={name}
                label={field.label}
                value={value}
                active={focused === name || value.length > 0}
                invalid={invalid}
                error={error}
                onChange={(v) => set(name, v)}
                onFocus={() => setFocused(name)}
                onBlur={() => setFocused((f) => (f === name ? null : f))}
              />
            );
          }

          return (
            <TextField
              key={name}
              id={id}
              name={name}
              label={field.label}
              kind={field.kind}
              value={value}
              active={focused === name || value.trim().length > 0}
              invalid={invalid}
              wide={"wide" in field ? field.wide : undefined}
              required={"required" in field ? field.required : undefined}
              autoComplete={"autoComplete" in field ? field.autoComplete : undefined}
              error={error}
              onChange={(v) => set(name, v)}
              onFocus={() => setFocused(name)}
              onBlur={() => setFocused((f) => (f === name ? null : f))}
            />
          );
        })}

        <div className="col-span-full mt-8 flex w-full flex-col items-start justify-between gap-10 pb-16 md:mt-12 md:pb-24 lg:pb-32">
          <div className="flex flex-col gap-3">
            <ConsentCheckbox
              checked={consent}
              invalid={Boolean(errorFor("consent"))}
              error={errorFor("consent")}
              onChange={(checked) => {
                setConsent(checked);
                dismiss("consent");
              }}
            />
            <span role="status" aria-live="polite">
              {state.message && !state.ok ? (
                <span className="block font-body text-legal text-invalid">
                  {state.message}
                </span>
              ) : null}
            </span>
          </div>

          <div className="w-full flex items-center justify-center gap-5">
            <button
              ref={sendRef}
              type="submit"
              className="group flex shrink-0 items-center gap-5 font-display text-send uppercase text-ink transition-colors duration-300 hover:text-bronze disabled:cursor-progress disabled:text-idle"
              disabled={pending}
            >
              <span className="shrink-underline inline-block font-display text-heading font-bold uppercase text-ink">
                {pending ? "Counting you in" : "Count us in"}
              </span>
            </button>
          </div>
        </div>
      </form>

      <SuccessPopup
        show={showPopup}
        onClose={() => {
          setShowPopup(false);
          sendRef.current?.focus();
        }}
      />
    </>
  );
}
