import type { ThemeModule } from "@/lib/theme/types";
import { Shell } from "./Shell";
import { AuthPanel } from "./AuthPanel";
import { Button } from "./Button";
import { Card } from "./Card";
import "./theme.css";

export const crtTheme: ThemeModule = {
  id: "crt",
  label: "CRT",
  fonts: {
    sans: '"VT323", monospace',
    display: '"Press Start 2P", monospace',
  },
  components: {
    Shell,
    AuthPanel,
    Button,
    Card,
  },
};
