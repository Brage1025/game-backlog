import type { Metadata } from "next";
import { Space_Grotesk, Oxanium } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

import { Sidebar } from "@/components/sidebar";
import { DEFAULT_THEME, THEME_COOKIE, type Theme } from "@/lib/theme";

// These variable names must match what globals.css expects:
// --font-sans and --font-heading
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Game Backlog",
  description: "Track your game backlog.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The theme is stored in a cookie so the server can put the right class on
  // <html> from the very first byte: no script, no flash, no hydration warning.
  const cookieStore = await cookies();
  const saved = cookieStore.get(THEME_COOKIE)?.value;
  const theme: Theme =
    saved === "light" || saved === "dark" ? saved : DEFAULT_THEME;

  return (
    <html lang="en" className={theme === "dark" ? "dark" : undefined}>
      <body
        className={`${spaceGrotesk.variable} ${oxanium.variable} font-sans antialiased`}
      >
        {/* Stacked on mobile (top bar above the page), side by side from md up. */}
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
