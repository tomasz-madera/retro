import type { ReactNode } from "react";

type CRTScreenProps = {
  children: ReactNode;
  className?: string;
};

export function CRTScreen({ children, className = "" }: CRTScreenProps) {
  return (
    <div className={`crt-screen ${className}`}>
      <div className="crt-content">{children}</div>
      <div className="crt-scanlines" aria-hidden="true" />
    </div>
  );
}
