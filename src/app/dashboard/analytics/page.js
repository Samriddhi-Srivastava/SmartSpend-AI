"use client";

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Target, AlertCircle } from "lucide-react";

/**
 * Analytics Page
 * 
 * Route: /dashboard/analytics
 * 
 * Features:
 * - Monthly spending trend
 * - Category breakdown pie chart
 * - Spending patterns
 * - Budget vs actual
 * - AI insights
 * 
 * Uses Recharts for data visualization
 */

const monthlyData = [
    { month: "Jan", spent: 8500, budget: 10000 },
    { month: "Feb", spent: 7200, budget: 10000 },
    { month: "Mar", spent: 9100, budget: 10000 },
    { month: "Apr", spent: 8800, budget: 10000 },
    { month: "May", spent: 10200, budget: 10000 },
    { month: "Jun", spent: 8920, budget: 10000 },
];

const categoryData = [
    { name: "Food", value: 2450, color: "#7FD1A6" },
    { name: "Transport", value: 1800, color: "#F0C088" },
    { name: "Entertainment", value: 1200, color: "#8B9A93" },
    { name: "Utilities", value: 1500, color: "#E8EEEA" },
    { name: "Shopping", value: 980, color: "#121A21" },
    { name: "Health", value: 990, color: "#16202A" },
];

export default function AnalyticsPage() {
    const totalSpent = monthlyData.reduce((sum, m) => sum + m.spent, 0);
    const avgSpent = Math.round(totalSpent / monthlyData.length);
    const maxSpent = Math.max(...monthlyData.map((m) => m.spent));

    return (
        <div className="p-6 sm:p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="font-display text-3xl font-bold text-mist">
                    Analytics & Insights
                </h1>
                <p className="text-muted mt-2">
                    Understand your spending patterns
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass rounded-xl p-6 border border-white/[0.08]">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm text-muted mb-1">Average Monthly</p>
                            <p className="text-2xl font-bold text-mist">₹{avgSpent.toLocaleString()}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-sage/20 text-sage">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <p className="text-sm text-muted">Last 6 months</p>
                </div>

                <div className="glass rounded-xl p-6 border border-white/[0.08]">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm text-muted mb-1">Highest Month</p>
                            <p className="text-2xl font-bold text-amber">₹{maxSpent.toLocaleString()}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber/20 text-amber">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <p className="text-sm text-muted">May 2024</p>
                </div>

                <div className="glass rounded-xl p-6 border border-white/[0.08]">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm text-muted mb-1">This Month Target</p>
                            <p className="text-2xl font-bold text-sage">₹1,080</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-sage/20 text-sage">
                            <Target size={20} />
                        </div>
                    </div>
                    <p className="text-sm text-muted">Budget remaining</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Trend */}
                <div className="lg:col-span-2 glass rounded-xl p-6 border border-white/[0.08]">
                    <h2 className="text-lg font-semibold text-mist mb-6">
                        Spending Trend
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                            <XAxis dataKey="month" stroke="#8B9A93" />
                            <YAxis stroke="#8B9A93" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#16202A",
                                    border: "1px solid #222",
                                    borderRadius: "8px",
                                }}
                                labelStyle={{ color: "#E8EEEA" }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="spent"
                                stroke="#7FD1A6"
                                strokeWidth={2}
                                dot={{ fill: "#7FD1A6", r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="budget"
                                stroke="#8B9A93"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Breakdown */}
                <div className="glass rounded-xl p-6 border border-white/[0.08]">
                    <h2 className="text-lg font-semibold text-mist mb-6">
                        By Category
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#16202A",
                                    border: "1px solid #222",
                                    borderRadius: "8px",
                                }}
                                labelStyle={{ color: "#E8EEEA" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bar Chart - Budget vs Actual */}
            <div className="glass rounded-xl p-6 border border-white/[0.08]">
                <h2 className="text-lg font-semibold text-mist mb-6">
                    Budget vs Actual Spending
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="month" stroke="#8B9A93" />
                        <YAxis stroke="#8B9A93" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#16202A",
                                border: "1px solid #222",
                                borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#E8EEEA" }}
                        />
                        <Legend />
                        <Bar dataKey="budget" fill="#8B9A93" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="spent" fill="#7FD1A6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Category Breakdown Table */}
            <div className="glass rounded-xl border border-white/[0.08] overflow-hidden">
                <div className="p-6 border-b border-line">
                    <h2 className="text-lg font-semibold text-mist">
                        Category Breakdown
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-line">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">
                                    % of Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">
                                    Trend
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryData.map((cat) => {
                                const percentage = (
                                    (cat.value /
                                        categoryData.reduce((sum, c) => sum + c.value, 0)) *
                                    100
                                ).toFixed(1);
                                return (
                                    <tr
                                        key={cat.name}
                                        className="border-b border-line hover:bg-white/5 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-mist">{cat.name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-mist font-semibold">
                                            ₹{cat.value.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            backgroundColor: cat.color,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm text-muted">{percentage}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sage text-sm font-medium">
                                            ↓ -5%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Insights */}
            <div className="glass rounded-xl p-6 border border-amber/20 bg-amber/5">
                <h3 className="text-lg font-semibold text-amber mb-4">
                    💡 Smart Insights
                </h3>
                <div className="space-y-3 text-sm text-muted">
                    <p>
                        ✓ Your spending has decreased by 12% compared to last month
                    </p>
                    <p>
                        ✓ Food is your highest spending category at 27.5% of total expenses
                    </p>
                    <p>
                        ✓ You're 8% under budget this month (₹1,080 remaining)
                    </p>
                    <p>
                        ✓ Your most expensive day was June 8th with ₹1,450 in transactions
                    </p>
                </div>
            </div>
        </div>
    );
}