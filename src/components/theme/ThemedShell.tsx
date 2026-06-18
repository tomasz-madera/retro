"use client";

import { useTheme } from "@/lib/theme/hooks";

type ThemedShellProps = {
  children: React.ReactNode;
};

export function ThemedShell({ children }: ThemedShellProps) {
  const { theme } = useTheme();
  const Shell = theme.components.Shell;
  return <Shell>{children}</Shell>;
}
