"use client";

import { Menu, Search, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Dashboard Navbar
 * 
 * Top bar in dashboard
 * Shows:
 * - Hamburger menu (mobile)
 * - Search bar
 * - Notifications
 * - User avatar
 * 
 * Features:
 * - Search functionality (ready to implement)
 * - Notifications bell
 * - User profile section
 * - Responsive design
 */

export default function DashboardNavbar({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-line bg-ink-soft/50 backdrop-blur sticky top-0 z-40 flex items-center justify-between px-6">
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-white/5 rounded-lg transition md:hidden"
        >
          <Menu size={20} className="text-muted" />
        </button>

        <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-line rounded-lg px-3 py-2 flex-1 max-w-sm">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="bg-transparent text-mist placeholder:text-muted/50 outline-none flex-1 text-sm"
          />
        </div>
      </div>

      {/* Right: Notifications + Avatar */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-white/5 rounded-lg transition">
          <Bell size={20} className="text-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-sage rounded-full" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-line">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-mist">
              {user?.name?.split(" ")[0] || "User"}
            </p>
            <p className="text-xs text-muted">{user?.email}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-sage/20 border border-sage/30 flex items-center justify-center">
            <span className="text-sage font-semibold">
              {user?.name?.[0] || user?.email?.[0] || "U"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
