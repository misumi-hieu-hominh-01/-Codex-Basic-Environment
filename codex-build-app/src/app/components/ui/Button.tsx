import React from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style for the button */
  variant?: ButtonVariant;
  /** Additional class names to apply */
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    const classes = [styles.button, styles[variant], className]
      .filter(Boolean)
      .join(" ");

    return <button ref={ref} className={classes} {...props} />;
  }
);

Button.displayName = "Button";
