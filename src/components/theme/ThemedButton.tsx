"use client";

import { useThemeComponents } from "@/lib/theme/hooks";
import type { ButtonProps } from "@/lib/theme/types";

export function ThemedButton(props: ButtonProps) {
  const { Button } = useThemeComponents();
  return <Button {...props} />;
}
