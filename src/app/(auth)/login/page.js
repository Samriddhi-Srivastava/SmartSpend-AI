"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

/**
 * Login Page
 * 
 * This is the route: /login
 * Users enter email + password
 * On success, redirects to /dashboard
 * 
 * Why "use client"?
 * - Uses useState for form state
 * - Uses useRouter for navigation
 * - Handles form submission
 */

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /**
     * Handle form submission
     * 
     * In a real app:
     * 1. Send email + password to backend API
     * 2. Backend verifies credentials
     * 3. Backend returns JWT token
     * 4. Store token in localStorage/cookie
     * 5. Redirect to /dashboard
     * 
     * For now: Simple validation
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Basic validation
        if (!email || !password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/auth/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email, password }),
            // });
            // const data = await response.json();
            // if (data.token) {
            //   localStorage.setItem('token', data.token);
            //   router.push('/dashboard');
            // }

            // Fake success for demo
            console.log("Login attempt:", { email, password });

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Store token (for demo)
            localStorage.setItem("token", "fake-jwt-token-" + Date.now());
            localStorage.setItem("user", JSON.stringify({ email }));

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (err) {
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-ink flex items-center justify-center px-4 sm:px-8">
            {/* Background gradient orb (left side) */}
            <div className="absolute top-20 left-10 h-72 w-72 bg-sage/10 rounded-full blur-3xl pointer-events-none" />

            {/* Background gradient orb (right side) */}
            <div className="absolute bottom-20 right-10 h-72 w-72 bg-amber/5 rounded-full blur-3xl pointer-events-none" />

            {/* Main container */}
            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="glass rounded-2xl p-8 sm:p-10 shadow-card border border-white/[0.08]">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-display text-3xl font-bold text-mist">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-muted">
                            Sign in to your SmartSpend account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email input */}
                        <div>
                            <label className="block text-sm font-medium text-mist mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-white/5 border border-line rounded-lg pl-10 pr-4 py-3 text-mist placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-sage/50 transition"
                                />
                            </div>
                        </div>

                        {/* Password input */}
                        <div>
                            <label className="block text-sm font-medium text-mist mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-line rounded-lg pl-10 pr-12 py-3 text-mist placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-sage/50 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-mist transition"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sage hover:bg-sage-deep disabled:opacity-50 disabled:cursor-not-allowed text-ink font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Forgot password link */}
                    <div className="mt-6 text-center">
                        <a href="#" className="text-sm text-sage hover:text-sage-deep transition">
                            Forgot password?
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="flex-1 h-px bg-line" />
                        <span className="text-xs text-muted">Don't have an account?</span>
                        <div className="flex-1 h-px bg-line" />
                    </div>

                    {/* Signup link */}
                    <Link
                        href="/signup"
                        className="w-full block text-center bg-white/5 hover:bg-white/10 border border-line text-mist font-medium py-3 rounded-lg transition"
                    >
                        Create account
                    </Link>
                </div>

                {/* Footer text */}
                <p className="text-center text-xs text-muted mt-6">
                    By signing in, you agree to our{" "}
                    <a href="#" className="text-sage hover:underline">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-sage hover:underline">
                        Privacy Policy
                    </a>
                </p>
            </div>
        </div>
    );
}