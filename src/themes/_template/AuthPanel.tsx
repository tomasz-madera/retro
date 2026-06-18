import type { ReactNode } from "react";

type AuthPanelProps = {
  title?: string;
  children: ReactNode;
};

export function AuthPanel({ title, children }: AuthPanelProps) {
  return (
    <div className="theme-auth-panel">
      {title && <div className="theme-auth-panel-title">{title}</div>}
      <div className="theme-auth-panel-body">{children}</div>
    </div>
  );
}
