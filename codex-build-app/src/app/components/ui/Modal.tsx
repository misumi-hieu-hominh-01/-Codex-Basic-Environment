"use client";

import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controls whether the modal is visible */
  isOpen: boolean;
  /** Called when the user requests to close the modal */
  onClose?: () => void;
  /** Additional class names for the modal container */
  className?: string;
  /** Modal contents */
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  ...props
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close when the Escape key is pressed
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    const focusEl = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusEl?.focus();
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Don't render anything if the modal isn't open
  if (!isOpen) return null;

  const modalClasses = [styles.modal, className].filter(Boolean).join(" ");

  const content = (
    <div className={styles.overlay} onClick={() => onClose?.()}>
      <div
        className={modalClasses}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        ref={modalRef}
        tabIndex={-1}
        {...props}
      >
        {children}
      </div>
    </div>
  );

  // Use a portal so the modal renders outside regular DOM flow
  return typeof window !== "undefined"
    ? ReactDOM.createPortal(content, document.body)
    : content;
}
