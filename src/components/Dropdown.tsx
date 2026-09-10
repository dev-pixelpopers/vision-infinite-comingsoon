import { useEffect, useRef } from "react";
import { FieldShell } from "./FieldShell";
import { cx } from "@/lib/cx";

type Props = {
  id: string;
  name: string;
  label: string;
  options: readonly string[];
  value: string;
  open: boolean;
  invalid: boolean;
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
};

/**
 * ARIA 1.2 listbox.
 *
 * The reference markup is a <ul> of <button>s, which is semantically a
 * toolbar rather than a select. We keep its class names but use real listbox
 * roles with `aria-activedescendant` — focus stays on the <ul> and the active
 * option is announced, which is the pattern screen readers expect.
 *
 * The hidden <input> is mandatory: the Server Action reads FormData, and
 * neither a <button> nor a <li> contributes anything to it.
 */
export function Dropdown({
  id,
  name,
  label,
  options,
  value,
  open,
  invalid,
  required,
  error,
  onChange,
  onOpenChange,
}: Props) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const typeahead = useRef({ buffer: "", at: 0 });

  const selectedIndex = options.indexOf(value);
  // Which option the keyboard is currently on; -1 until the list opens.
  const activeIndex = useRef(selectedIndex);

  const listId = `${id}-listbox`;
  const optionId = (i: number) => `${id}-option-${i}`;

  const setActive = (i: number) => {
    const clamped = Math.max(0, Math.min(options.length - 1, i));
    activeIndex.current = clamped;
    const ul = listRef.current;
    if (!ul) return;
    ul.setAttribute("aria-activedescendant", optionId(clamped));
    ul.querySelectorAll<HTMLLIElement>("[role='option']").forEach((li, index) => {
      li.classList.toggle("is-active", index === clamped);
    });
    ul.querySelector<HTMLLIElement>(`#${CSS.escape(optionId(clamped))}`)?.scrollIntoView({
      block: "nearest",
    });
  };

  const openList = (startAt = selectedIndex >= 0 ? selectedIndex : 0) => {
    onOpenChange(true);
    activeIndex.current = startAt;
  };

  const closeList = (refocus = true) => {
    onOpenChange(false);
    if (refocus) triggerRef.current?.focus();
  };

  const commit = (i: number) => {
    const next = options[i];
    if (next !== undefined) onChange(next);
    closeList();
  };

  // Move DOM focus into the list once it renders, and seed the active option.
  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    setActive(activeIndex.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Close on outside pointerdown and on scroll.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    const onScroll = () => onOpenChange(false);
    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, onOpenChange]);

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openList();
    }
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    const i = activeIndex.current;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive(i + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive(i - 1);
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(i);
        break;
      case "Escape":
        e.preventDefault();
        closeList();
        break;
      case "Tab":
        onOpenChange(false);
        break;
      default: {
        if (e.key.length !== 1) return;
        // event timeStamp rather than Date.now() — same purpose, and pure
        const now = e.timeStamp;
        const t = typeahead.current;
        t.buffer = now - t.at > 700 ? e.key : t.buffer + e.key;
        t.at = now;
        const q = t.buffer.toLowerCase();
        const found = options.findIndex((o) => o.toLowerCase().startsWith(q));
        if (found >= 0) setActive(found);
      }
    }
  };

  return (
    <div ref={wrapRef} style={{ display: "contents" }}>
      <FieldShell
        id={id}
        label={label}
        active={open || value.length > 0}
        visible={value.length > 0}
        invalid={invalid}
        arrow
        arrowOpen={open}
        error={error}
        labelAs="span"
        onActivate={() => triggerRef.current?.focus()}
      >
        <button
          id={id}
          ref={triggerRef}
          type="button"
          className="contact-form__input contact-form__trigger"
          /* ARIA 1.2 select-only combobox: the role is what makes
             aria-expanded / aria-invalid / aria-required valid here. */
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          /* Reads as "<label> <selected value>". Referencing a dedicated
             value span rather than the button itself — a self-reference in
             aria-labelledby is legal but computes inconsistently. */
          aria-labelledby={`${id}-label ${id}-value`}
          aria-invalid={invalid || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-required={required || undefined}
          onClick={() => (open ? closeList(false) : openList())}
          onKeyDown={onTriggerKeyDown}
        >
          <span id={`${id}-value`}>{value}</span>
        </button>

        <input type="hidden" name={name} value={value} />

        {open ? (
          <ul
            id={listId}
            ref={listRef}
            className="dropdown"
            role="listbox"
            tabIndex={-1}
            aria-labelledby={`${id}-label`}
            onKeyDown={onListKeyDown}
          >
            {options.map((option, i) => (
              <li
                key={option}
                id={optionId(i)}
                role="option"
                aria-selected={option === value}
                className={cx("dropdown__item", "dropdown__button")}
                onClick={() => commit(i)}
                onMouseEnter={() => setActive(i)}
              >
                {option}
              </li>
            ))}
          </ul>
        ) : null}
      </FieldShell>
    </div>
  );
}
