import type {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

export type ThemeId = "crt" | "classic" | "pink";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  dragging?: boolean;
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export interface ThemeComponents {
  Shell: React.FC<{ children: ReactNode; className?: string }>;
  AuthPanel: React.FC<{ title?: string; children: ReactNode }>;
  Button: React.FC<ButtonProps>;
  Card: ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>>;
}

export interface ThemeModule {
  id: ThemeId;
  label: string;
  fonts: { sans: string; display: string };
  components: ThemeComponents;
}
