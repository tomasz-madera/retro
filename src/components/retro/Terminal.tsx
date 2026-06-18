import type { ReactNode } from "react";

type TerminalProps = {
  title?: string;
  children: ReactNode;
};

export function Terminal({ title = "RETRO.EXE", children }: TerminalProps) {
  return (
    <div className="terminal-window">
      <div className="terminal-titlebar">
        <span className="terminal-title">{title}</span>
        <span className="terminal-controls" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  );
}
