import type { Metadata } from "next";
import { getTheme } from "@/lib/theme/cookies";
import { ThemeProvider } from "@/lib/theme/provider";
import { ThemedShell } from "@/components/theme/ThemedShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scrum Retro",
  description: "Scrum retrospective board with customizable themes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();

  return (
    <html lang="en" data-theme={theme} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider initialTheme={theme}>
          <ThemedShell>{children}</ThemedShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
