import type { ThemeModule } from "@/lib/theme/types";
import { Shell } from "./Shell";
import { AuthPanel } from "./AuthPanel";
import { Button } from "./Button";
import { Card } from "./Card";
import "./theme.css";

export const pinkTheme: ThemeModule = {
  id: "pink",
  label: "Pink",
  fonts: {
    sans: '"Quicksand", system-ui, sans-serif',
    display: '"Quicksand", system-ui, sans-serif',
  },
  components: {
    Shell,
    AuthPanel,
    Button,
    Card,
  },
};
