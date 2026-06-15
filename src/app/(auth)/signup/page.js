"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";

/**
 * Signup Page
 * 
 * Route: /signup
 * Users create account with:
 * - Full name
 * - Email
 * - Password (with confirmation)
 * 
 * On success: Redirects to /dashboard
 * 
 * Features:
 * - Password strength indicator
 * - Password confirmation
 * - Basic validation
 * - Terms acceptance checkbox
 */

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /**
     * Password strength checker
     * Returns: weak, medium, strong
     */
    const getPasswordStrength = (pwd) => {
        if (!pwd) return null;
        if (pwd.length < 6) return "weak";
        if (pwd.length < 12 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return "medium";
        return "strong";
    };

    const strength = getPasswordStrength(password);
    const strengthColor = {
        weak: "text-red-400",
        medium: "text-yellow-400",
        strong: "text-sage",
    };

    /**
     * Handle signup submission
     */
    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        if (!agreeTerms) {
            setError("Please accept the terms and conditions");
            setLoading(false);
            return;
        }

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/auth/signup', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ name, email, password }),
            // });
            // const data = await response.json();
            // if (data.token) {
            //   localStorage.setItem('token', data.token);
            //   localStorage.setItem('user', JSON.stringify(data.user));
            //   router.push('/dashboard');
            // }

            console.log("Signup attempt:", { name, email, password });

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Store user data (for demo)
            localStorage.setItem("token", "fake-jwt-token-" + Date.now());
            localStorage.setItem("user", JSON.stringify({ name, email }));

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (err) {
            setError("Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-ink flex items-center justify-center px-4 sm:px-8 py-12">
            {/* Background gradient orbs */}
            <div className="absolute top-20 right-10 h-72 w-72 bg-sage/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-10 h-72 w-72 bg-amber/5 rounded-full blur-3xl pointer-events-none" />

            {/* Main container */}
            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="glass rounded-2xl p-8 sm:p-10 shadow-card border border-white/[0.08]">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-display text-3xl font-bold text-mist">
                            Create account
                        </h1>
                        <p className="mt-2 text-muted">
                            Join thousands managing their money smarter
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Full name input */}
                        <div>
                            <label className="block text-sm font-medium text-mist mb-2">
                                Full name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Samriddhsi Srivastava"
                                    className="w-full bg-white/5 border border-line rounded-lg pl-10 pr-4 py-3 text-mist placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-sage/50 transition"
                                />
                            </div>
                        </div>

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
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Password strength indicator */}
                            {password && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${strength === "weak"
                                                    ? "w-1/3 bg-red-400"
                                                    : strength === "medium"
                                                        ? "w-2/3 bg-yellow-400"
                                                        : "w-full bg-sage"
                                                }`}
                                        />
                                    </div>
                                    <span className={`text-xs font-medium capitalize ${strengthColor[strength]}`}>
                                        {strength}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Confirm password input */}
                        <div>
                            <label className="block text-sm font-medium text-mist mb-2">
                                Confirm password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-line rounded-lg pl-10 pr-12 py-3 text-mist placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-sage/50 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-mist transition"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Password match indicator */}
                        {confirmPassword && password !== confirmPassword && (
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle size={16} />
                                Passwords don't match
                            </div>
                        )}

                        {/* Terms checkbox */}
                        <div className="flex items-start gap-3 mt-5">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-line bg-white/5 cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-sm text-muted cursor-pointer">
                                I agree to the{" "}
                                <a href="#" className="text-sage hover:underline">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-sage hover:underline">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm flex items-start gap-2">
                                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading || !agreeTerms}
                            className="w-full bg-sage hover:bg-sage-deep disabled:opacity-50 disabled:cursor-not-allowed text-ink font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="flex-1 h-px bg-line" />
                        <span className="text-xs text-muted">Already have an account?</span>
                        <div className="flex-1 h-px bg-line" />
                    </div>

                    {/* Login link */}
                    <Link
                        href="/login"
                        className="w-full block text-center bg-white/5 hover:bg-white/10 border border-line text-mist font-medium py-3 rounded-lg transition"
                    >
                        Sign in
                    </Link>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-muted mt-6">
                    Creating an account takes less than 2 minutes
                </p>
            </div>
        </div>
    );
}