import type { ReactNode } from "react";

type AuthPanelProps = {
  title?: string;
  children: ReactNode;
};

export function AuthPanel({ title = "RETRO.EXE", children }: AuthPanelProps) {
  return (
    <div className="theme-auth-panel">
      <div className="theme-auth-panel-titlebar">
        <span className="theme-auth-panel-title">{title}</span>
        <span className="theme-auth-panel-controls" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </div>
      <div className="theme-auth-panel-body">{children}</div>
    </div>
  );
}
