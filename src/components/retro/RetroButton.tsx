import type { ButtonHTMLAttributes, ReactNode } from "react";

type RetroButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
};

export function RetroButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: RetroButtonProps) {
  return (
    <button
      className={`retro-btn retro-btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
