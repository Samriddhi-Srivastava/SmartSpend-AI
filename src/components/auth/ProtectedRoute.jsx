"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if we're NOT loading and user is null
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Still loading auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Auth check complete, no user logged in
  if (!user) {
    return null;
  }

  // Logged in, show content
  return children;
}