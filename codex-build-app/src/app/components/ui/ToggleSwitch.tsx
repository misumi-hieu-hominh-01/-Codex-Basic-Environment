"use client";

import styles from "./ToggleSwitch.module.css";

interface ToggleSwitchProps {
  /** Current checked state */
  checked: boolean;
  /** Called with the new state when toggled */
  onChange?: (checked: boolean) => void;
  /** Optional labels for [off, on] states */
  labels?: [string, string];
  className?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  labels = ["Off", "On"],
  className = "",
}: ToggleSwitchProps) {
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");
  const switchClasses = [styles.switch, checked ? styles.on : styles.off]
    .filter(Boolean)
    .join(" ");

  const label = checked ? labels[1] : labels[0];

  return (
    <div className={containerClasses} onClick={() => onChange?.(!checked)}>
      <div className={switchClasses}>
        <div className={styles.knob}></div>
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
