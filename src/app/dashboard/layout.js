"use client";

import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardNavbar from "@/components/dashboard/Navbar";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-ink flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    return (
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
    );
}