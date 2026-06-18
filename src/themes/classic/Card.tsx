import { forwardRef } from "react";
import type { CardProps } from "@/lib/theme/types";

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className = "", dragging = false, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`app-card ${dragging ? "app-card-dragging" : ""} ${className}`}
      {...props}
    >
      <span className="theme-card-corner" aria-hidden="true" />
      {children}
    </div>
  );
});
