import type { ReactNode } from "react";

type ShellProps = {
  children: ReactNode;
  className?: string;
};

export function Shell({ children, className = "" }: ShellProps) {
  return (
    <div className={`theme-shell ${className}`}>
      <div className="theme-shell-content">{children}</div>
    </div>
  );
}
