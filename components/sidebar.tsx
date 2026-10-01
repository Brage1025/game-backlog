"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Heart, Library, Moon, Sun, Trophy, User, Users } from "lucide-react";

import { UserAvatar } from "@/components/user-avatar";
import { useProfile } from "@/lib/use-profile";
import { toggleTheme } from "@/lib/theme";

const NAV_ITEMS = [
  { href: "/", label: "Library", icon: Library },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/friends", label: "Friends", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [profile, , hydrated] = useProfile();
  // Falls back to the text wordmark if /public/game-backlog-logo.png is
  // ever missing or fails to load, instead of showing a broken image.
  const [logoError, setLogoError] = useState(false);

  const displayName = profile.username || "Set up your profile";

  return (
    <>
      {/* Small screens: a compact top bar instead of a sidebar. */}
      <header className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 text-sidebar-foreground md:hidden">
        <Link href="/" className="flex items-center">
          {logoError ? (
            <span className="font-heading font-semibold">Game Backlog</span>
          ) : (
            <Image
              src="/game-backlog-logo.png"
              alt="Game Backlog"
              width={697}
              height={225}
              priority
              className="h-9 w-auto"
              onError={() => setLogoError(true)}
            />
          )}
        </Link>
        <nav className="flex items-center gap-1" aria-label="Main">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={pathname === href ? "page" : undefined}
              className={`rounded-md p-2 transition-colors hover:bg-sidebar-accent ${
                pathname === href ? "bg-sidebar-accent" : ""
              }`}
            >
              <Icon className="size-5" />
            </Link>
          ))}
          <Link
            href="/support"
            aria-label="Support"
            aria-current={pathname === "/support" ? "page" : undefined}
            className={`rounded-md p-2 transition-colors hover:bg-sidebar-accent ${
              pathname === "/support" ? "bg-sidebar-accent" : ""
            }`}
          >
            <Heart className="size-5" />
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Switch between light and dark mode"
            className="rounded-md p-2 transition-colors hover:bg-sidebar-accent"
          >
            <Sun className="hidden size-5 dark:block" />
            <Moon className="size-5 dark:hidden" />
          </button>
        </nav>
      </header>

      {/* Medium screens and up: fixed-height sidebar that stays put while the page scrolls. */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <Link href="/" className="flex items-center px-4 py-5">
          {logoError ? (
            <span className="font-heading text-lg font-semibold">
              Game Backlog
            </span>
          ) : (
            <Image
              src="/game-backlog-logo.png"
              alt="Game Backlog"
              width={697}
              height={225}
              priority
              className="h-auto w-full"
              onError={() => setLogoError(true)}
            />
          )}
        </Link>

        <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Main">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : ""
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Support: centered text like the theme toggle below it, icon pinned
            left with `absolute` so it doesn't push the centered text over. */}
        <div className="px-3">
          <Link
            href="/support"
            aria-current={pathname === "/support" ? "page" : undefined}
            className={`relative flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
              pathname === "/support"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : ""
            }`}
          >
            <Heart className="absolute left-3 size-4" />
            Support
          </Link>
        </div>

        {/* Inverted colors (foreground as background) so it stands out in both
            themes: light button in dark mode, dark button in light mode.
            The label and icon switch with CSS `dark:` variants rather than
            React state, so they're correct from the first paint. */}
        <div className="mt-1 px-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="relative flex w-full items-center justify-center rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
          >
            <Sun className="absolute left-3 hidden size-4 dark:block" />
            <Moon className="absolute left-3 size-4 dark:hidden" />
            <span className="hidden dark:inline">Lightmode</span>
            <span className="dark:hidden">Darkmode</span>
          </button>
        </div>

        <Link
          href="/profile"
          className="m-3 flex items-center gap-3 rounded-lg border border-sidebar-border p-3 transition-colors hover:bg-sidebar-accent"
        >
          <UserAvatar
            username={hydrated ? profile.username : ""}
            avatarUrl={hydrated ? profile.avatarUrl : null}
          />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {hydrated ? displayName : "\u00A0"}
          </span>
        </Link>
      </aside>
    </>
  );
}
