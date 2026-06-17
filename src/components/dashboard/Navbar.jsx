"use client";

import { Menu, Search, Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

/**
 * Dashboard Navbar
 *
 * Top bar in dashboard with:
 * - Hamburger menu (mobile)
 * - Search bar
 * - Notifications
 * - Theme toggle
 * - User avatar
 */

export default function DashboardNavbar({ toggleSidebar }) {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b border-line bg-ink-soft/50 dark:bg-slate-900/50 backdrop-blur sticky top-0 z-40 flex items-center justify-between px-6 transition-colors duration-300">
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-white/5 dark:hover:bg-slate-700 rounded-lg transition md:hidden"
        >
          <Menu size={20} className="text-muted dark:text-slate-400" />
        </button>

        <div className="hidden sm:flex items-center gap-3 bg-white/5 dark:bg-slate-800/50 border border-line dark:border-slate-700 rounded-lg px-3 py-2 flex-1 max-w-sm">
          <Search size={18} className="text-muted dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="bg-transparent text-mist dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-muted/50 outline-none flex-1 text-sm"
          />
        </div>
      </div>

      {/* Right: Notifications + Theme + Avatar */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-white/5 dark:hover:bg-slate-700 rounded-lg transition">
          <Bell size={20} className="text-muted dark:text-slate-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-sage rounded-full" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-line dark:border-slate-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-mist dark:text-slate-100">
              {session?.user?.name?.split(" ")[0] || "User"}
            </p>
            <p className="text-xs text-muted dark:text-slate-400">
              {session?.user?.email}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-sage/20 dark:bg-sage/10 border border-sage/30 dark:border-sage/20 flex items-center justify-center">
            <span className="text-sage font-semibold">
              {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
