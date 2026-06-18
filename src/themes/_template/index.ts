import type { ThemeModule } from "@/lib/theme/types";
import { Shell } from "./Shell";
import { AuthPanel } from "./AuthPanel";
import { Button } from "./Button";
import { Card } from "./Card";
import "./theme.css";

export const templateTheme: ThemeModule = {
  id: "crt",
  label: "Template",
  fonts: {
    sans: "system-ui, sans-serif",
    display: "system-ui, sans-serif",
  },
  components: {
    Shell,
    AuthPanel,
    Button,
    Card,
  },
};
