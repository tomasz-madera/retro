"use client";

import { useThemeComponents } from "@/lib/theme/hooks";

type ThemedAuthPanelProps = {
  title?: string;
  children: React.ReactNode;
};

export function ThemedAuthPanel({ title, children }: ThemedAuthPanelProps) {
  const { AuthPanel } = useThemeComponents();
  return <AuthPanel title={title}>{children}</AuthPanel>;
}
