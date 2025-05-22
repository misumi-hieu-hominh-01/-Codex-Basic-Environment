import React from "react";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Additional class names to apply */
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    const classes = [styles.input, className].filter(Boolean).join(" ");
    return <input ref={ref} className={classes} {...props} />;
  }
);

Input.displayName = "Input";
