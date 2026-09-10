import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";

type Props = {
  show: boolean;
  onClose: () => void;
};

export function SuccessPopup({ show, onClose }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!show) return;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Simple focus trap: the dialog only holds one focusable element, so
      // keep Tab on it rather than letting focus escape to the page behind.
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [show, onClose]);

  return (
    <div
      ref={ref}
      className={cx("feedback-popup", show && "show")}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-popup-heading"
      aria-hidden={!show}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button ref={closeRef} type="button" className="feedback-popup__close" onClick={onClose}>
        Close
      </button>

      {/* Reveals DOWNWARD from -105%, unlike the preloader and hero which
          reveal upward from +105%. Both are faithful to the reference. */}
      <p id="feedback-popup-heading" className="feedback-popup-heading">
        <span>
          <span>Successfully</span>
        </span>
        <span>
          <span>Sent</span>
        </span>
      </p>
    </div>
  );
}
