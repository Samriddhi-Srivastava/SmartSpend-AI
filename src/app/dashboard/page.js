"use client";

import { TrendingUp, Wallet, Target, Calendar } from "lucide-react";

/**
 * Dashboard Home Page
 * 
 * Route: /dashboard
 * 
 * Shows:
 * - Balance card
 * - Quick stats (spent this month, budget remaining, etc)
 * - Recent transactions
 * - Monthly chart
 * - Quick actions
 * 
 * This is the first page users see after login
 */

export default function Dashboard() {
    // Mock data - replace with API calls
    const stats = [
        {
            label: "Balance",
            value: "₹12,450",
            change: "+12%",
            icon: Wallet,
            color: "sage",
        },
        {
            label: "Spent This Month",
            value: "₹8,920",
            change: "-8%",
            icon: TrendingUp,
            color: "amber",
        },
        {
            label: "Budget Remaining",
            value: "₹1,080",
            change: "11% left",
            icon: Target,
            color: "sage",
        },
        {
            label: "Next Bill",
            value: "₹2,500",
            change: "in 5 days",
            icon: Calendar,
            color: "amber",
        },
    ];

    const recentTransactions = [
        {
            id: 1,
            name: "Coffee Shop",
            category: "Food",
            amount: "-₹120",
            date: "Today, 2:30 PM",
            icon: "☕",
        },
        {
            id: 2,
            name: "Electricity Bill",
            category: "Utilities",
            amount: "-₹1,200",
            date: "Yesterday",
            icon: "⚡",
        },
        {
            id: 3,
            name: "Salary Received",
            category: "Income",
            amount: "+₹15,000",
            date: "3 days ago",
            icon: "💰",
        },
        {
            id: 4,
            name: "Netflix Subscription",
            category: "Entertainment",
            amount: "-₹199",
            date: "4 days ago",
            icon: "🎬",
        },
    ];

    return (
        <div className="p-6 sm:p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="font-display text-3xl font-bold text-mist">
                    Your Financial Overview
                </h1>
                <p className="text-muted mt-2">
                    Track your spending and build better financial habits
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="glass rounded-xl p-6 border border-white/[0.08]"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-sm text-muted mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-mist">{stat.value}</p>
                                </div>
                                <div
                                    className={`p-2.5 rounded-lg ${stat.color === "sage"
                                            ? "bg-sage/20 text-sage"
                                            : "bg-amber/20 text-amber"
                                        }`}
                                >
                                    <Icon size={20} />
                                </div>
                            </div>
                            <p
                                className={`text-sm font-medium ${stat.color === "sage"
                                        ? "text-sage"
                                        : "text-amber"
                                    }`}
                            >
                                {stat.change}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions */}
                <div className="lg:col-span-2">
                    <div className="glass rounded-xl p-6 border border-white/[0.08]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-mist">
                                Recent Transactions
                            </h2>
                            <a href="/dashboard/expenses" className="text-sage text-sm hover:underline">
                                View all
                            </a>
                        </div>

                        <div className="space-y-3">
                            {recentTransactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition border border-transparent hover:border-line"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="text-2xl">{tx.icon}</div>
                                        <div>
                                            <p className="font-medium text-mist">{tx.name}</p>
                                            <p className="text-sm text-muted">{tx.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${tx.amount.startsWith("+") ? "text-sage" : "text-mist"
                                            }`}>
                                            {tx.amount}
                                        </p>
                                        <p className="text-xs text-muted">{tx.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-4">
                    <div className="glass rounded-xl p-6 border border-white/[0.08] h-full flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-mist mb-4">
                                Quick Actions
                            </h2>
                        </div>

                        <div className="space-y-3 flex-1 flex flex-col justify-center">
                            <button className="w-full bg-sage hover:bg-sage-deep text-ink font-semibold py-3 rounded-lg transition">
                                + Add Expense
                            </button>
                            <button className="w-full bg-white/10 hover:bg-white/15 text-mist font-semibold py-3 rounded-lg transition border border-line">
                                Split with Friends
                            </button>
                            <button className="w-full bg-white/10 hover:bg-white/15 text-mist font-semibold py-3 rounded-lg transition border border-line">
                                Chat with AI
                            </button>
                            <a
                                href="/dashboard/health-score"
                                className="w-full bg-white/10 hover:bg-white/15 text-mist font-semibold py-3 rounded-lg transition border border-line text-center"
                            >
                                Check Health Score
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insight Card */}
            <div className="glass rounded-xl p-6 border border-amber/20 bg-amber/5">
                <div className="flex items-start gap-4">
                    <div className="text-3xl">💡</div>
                    <div>
                        <h3 className="font-semibold text-amber mb-1">AI Insight</h3>
                        <p className="text-sm text-muted">
                            Your food spending rose 22% this month. Reducing dining by just 15% would save you ₹1,200 — enough to cover a month of your phone bill!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}