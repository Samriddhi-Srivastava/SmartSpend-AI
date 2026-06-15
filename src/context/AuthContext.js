"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * AuthContext
 * 
 * Manages global authentication state
 * 
 * Provides:
 * - user: current logged-in user
 * - isLoading: loading state
 * - login: set user after login
 * - logout: clear user
 * 
 * Usage in any component:
 * const { user, isLoading, logout } = useAuth();
 * 
 * Example:
 * if (!user && !isLoading) {
 *   // Not logged in, show login page
 *   redirect('/login');
 * }
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Check if user is logged in on mount
     * Reads token from localStorage
     */
    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem("token");
                const userStr = localStorage.getItem("user");

                if (token && userStr) {
                    // Token exists, user is logged in
                    const userData = JSON.parse(userStr);
                    setUser(userData);
                } else {
                    // No token, user is not logged in
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to use auth context
 * 
 * Usage:
 * const { user, isLoading } = useAuth();
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}