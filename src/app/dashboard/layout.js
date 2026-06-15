"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardNavbar from "@/components/dashboard/Navbar";
import { useState } from "react";

/**
 * Dashboard Layout
 * 
 * This wraps ALL dashboard pages
 * Route: /dashboard/*
 * 
 * Structure:
 * - ProtectedRoute: Checks if user is logged in
 * - Sidebar: Navigation menu (left side)
 * - Navbar: Top bar with user info
 * - {children}: Page content
 * 
 * Features:
 * - Mobile responsive sidebar toggle
 * - Protected route (redirects to login if not logged in)
 * - Navigation between dashboard pages
 */

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <ProtectedRoute>
            <div className="flex h-screen bg-ink overflow-hidden">
                {/* Sidebar */}
                <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

                {/* Main content area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top navbar */}
                    <DashboardNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                    {/* Page content */}
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}