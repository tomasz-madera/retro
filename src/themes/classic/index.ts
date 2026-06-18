import type { ThemeModule } from "@/lib/theme/types";
import { Shell } from "./Shell";
import { AuthPanel } from "./AuthPanel";
import { Button } from "./Button";
import { Card } from "./Card";
import "./theme.css";

export const classicTheme: ThemeModule = {
  id: "classic",
  label: "Classic",
  fonts: {
    sans: '"Nunito", system-ui, sans-serif',
    display: '"Nunito", system-ui, sans-serif',
  },
  components: {
    Shell,
    AuthPanel,
    Button,
    Card,
  },
};
