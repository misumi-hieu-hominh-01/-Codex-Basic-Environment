"use client";

import { useEffect } from "react";
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
  // Close when the Escape key is pressed
  useEffect(() => {
    if (!isOpen) return;
    
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    document.addEventListener("keydown", handler);
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
