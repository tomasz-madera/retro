import type { ButtonProps } from "@/lib/theme/types";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`app-button app-button-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
