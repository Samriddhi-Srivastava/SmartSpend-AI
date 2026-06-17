"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Users,
  MessageSquare,
  Heart,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Dashboard Sidebar
 *
 * Left navigation menu for dashboard
 * Shows all available pages:
 * - Dashboard (home)
 * - Expenses
 * - Analytics
 * - Groups (Splitwise)
 * - AI Chat
 * - Health Score
 * - Settings
 *
 * Features:
 * - Active page highlighting
 * - Collapsible on mobile
 * - Logout button
 * - Icons from lucide-react
 */

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview",
  },
  {
    label: "Expenses",
    href: "/dashboard/expenses",
    icon: Wallet,
    description: "Track spending",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: TrendingUp,
    description: "Insights",
  },
  {
    label: "Groups",
    href: "/dashboard/groups",
    icon: Users,
    description: "Splitwise",
  },
  {
    label: "AI Chat",
    href: "/dashboard/ai-chat",
    icon: MessageSquare,
    description: "Smart advice",
  },
  {
    label: "Health Score",
    href: "/dashboard/health-score",
    icon: Heart,
    description: "Financial health",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Preferences",
  },
];

export default function DashboardSidebar({ open, setOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          open ? "w-64" : "w-20"
        } bg-surface border-r border-line transition-all duration-300 flex flex-col overflow-y-auto`}
      >
        {/* Logo / Header */}
        <div className="h-16 border-b border-line flex items-center justify-between px-4 sticky top-0 bg-ink-soft/50 backdrop-blur">
          {open && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center text-ink font-bold">
                <Sparkles size={16} />
              </div>
              <span className="font-display font-bold text-mist text-sm">
                SmartSpend
              </span>
            </div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="p-1.5 hover:bg-white/5 rounded-lg transition"
          >
            {open ? (
              <ChevronLeft size={18} className="text-muted" />
            ) : (
              <ChevronRight size={18} className="text-muted" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-sage/20 text-sage"
                      : "text-muted hover:bg-white/5 hover:text-mist"
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {open && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-muted/70">
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-line p-3 space-y-2">
          {open && (
            <div className="px-3 py-2 text-xs text-muted">
              <p className="font-medium text-mist mb-1">
                {session?.user?.name || session?.user?.email || "User"}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:bg-red-500/10 hover:text-red-400 transition text-sm"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {open && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
