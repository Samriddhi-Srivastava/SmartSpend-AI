"use client";

import { CheckCircle, AlertCircle, TrendingUp, Target } from "lucide-react";

/**
 * Health Score Page
 * 
 * Route: /dashboard/health-score
 * 
 * Features:
 * - Overall financial health score (0-100)
 * - Breakdown by category
 * - Recommendations
 * - Comparison to average user
 */

export default function HealthScorePage() {
    const overallScore = 78;
    const metrics = [
        {
            name: "Savings Rate",
            score: 85,
            description: "You're saving 15% of income",
            recommendation: "Excellent! Keep it up.",
            icon: CheckCircle,
            color: "sage",
        },
        {
            name: "Spending Control",
            score: 72,
            description: "Your spending varies by 25% month-to-month",
            recommendation: "Try to keep monthly spending more consistent",
            icon: AlertCircle,
            color: "amber",
        },
        {
            name: "Budget Adherence",
            score: 65,
            description: "You exceeded budget in 2 out of 6 months",
            recommendation: "Set stricter limits on discretionary spending",
            icon: AlertCircle,
            color: "amber",
        },
        {
            name: "Emergency Fund",
            score: 90,
            description: "You have 6 months of expenses saved",
            recommendation: "Great emergency fund! You're well-protected.",
            icon: CheckCircle,
            color: "sage",
        },
        {
            name: "Debt Management",
            score: 95,
            description: "No outstanding debts",
            recommendation: "Keep maintaining zero debt status",
            icon: CheckCircle,
            color: "sage",
        },
        {
            name: "Investment Diversity",
            score: 60,
            description: "Limited to savings account only",
            recommendation: "Consider diversifying into investments",
            icon: AlertCircle,
            color: "amber",
        },
    ];

    const topRecommendations = [
        "Increase investments - You have extra ₹2,000+ monthly that could be invested",
        "Reduce food spending - This is your highest category at 27.5%",
        "Set up automatic transfers - To ensure consistent savings",
        "Track entertainment spending - This varies the most month-to-month",
    ];

    return (
        <div className="p-6 sm:p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="font-display text-3xl font-bold text-mist">
                    Financial Health Score
                </h1>
                <p className="text-muted mt-2">
                    A complete assessment of your financial wellness
                </p>
            </div>

            {/* Overall Score */}
            <div className="glass rounded-xl border border-sage/20 bg-sage/5 p-8">
                <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto mb-6">
                        <svg
                            className="transform -rotate-90"
                            viewBox="0 0 180 180"
                            style={{ filter: "drop-shadow(0 0 20px rgba(127, 209, 166, 0.2))" }}
                        >
                            {/* Background circle */}
                            <circle
                                cx="90"
                                cy="90"
                                r="80"
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="8"
                            />
                            {/* Progress circle */}
                            <circle
                                cx="90"
                                cy="90"
                                r="80"
                                fill="none"
                                stroke="#7FD1A6"
                                strokeWidth="8"
                                strokeDasharray={`${(overallScore / 100) * 503} 503`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-sage">{overallScore}</div>
                                <div className="text-sm text-muted mt-1">out of 100</div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-mist mb-2">
                        You're Financially Healthy!
                    </h2>
                    <p className="text-muted max-w-md mx-auto">
                        Your score is above average. Keep maintaining good spending habits and work on the recommendations below.
                    </p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div>
                <h2 className="text-lg font-semibold text-mist mb-4">Score Breakdown</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {metrics.map((metric) => {
                        const Icon = metric.icon;
                        const bgColor =
                            metric.color === "sage" ? "bg-sage/10" : "bg-amber/10";
                        const textColor =
                            metric.color === "sage" ? "text-sage" : "text-amber";

                        return (
                            <div
                                key={metric.name}
                                className={`glass rounded-xl p-6 border border-white/[0.08] ${bgColor}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-mist mb-1">
                                            {metric.name}
                                        </h3>
                                        <p className="text-sm text-muted">{metric.description}</p>
                                    </div>
                                    <Icon className={`${textColor} flex-shrink-0`} size={24} />
                                </div>

                                {/* Score bar */}
                                <div className="mb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-xl font-bold ${textColor}`}>
                                            {metric.score}
                                        </span>
                                        <span className="text-xs text-muted">/100</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${metric.color === "sage" ? "bg-sage" : "bg-amber"
                                                }`}
                                            style={{ width: `${metric.score}%` }}
                                        />
                                    </div>
                                </div>

                                <p className="text-xs text-muted">
                                    {metric.recommendation}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Recommendations */}
            <div className="glass rounded-xl p-6 border border-white/[0.08]">
                <h2 className="text-lg font-semibold text-mist mb-4 flex items-center gap-2">
                    <Target size={20} className="text-sage" />
                    Top Recommendations
                </h2>

                <div className="space-y-3">
                    {topRecommendations.map((rec, idx) => (
                        <div
                            key={idx}
                            className="flex gap-4 p-4 rounded-lg bg-white/5 border border-line"
                        >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sage/20 text-sage flex items-center justify-center text-sm font-bold">
                                {idx + 1}
                            </div>
                            <p className="flex-1 text-muted text-sm">{rec}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Comparison */}
            <div className="glass rounded-xl p-6 border border-white/[0.08]">
                <h2 className="text-lg font-semibold text-mist mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-amber" />
                    Your vs Average User
                </h2>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted">Your Score</span>
                            <span className="text-sm font-semibold text-mist">{overallScore}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-sage rounded-full"
                                style={{ width: `${overallScore}%` }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted">Average Score</span>
                            <span className="text-sm font-semibold text-mist">65</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-muted/50 rounded-full" style={{ width: "65%" }} />
                        </div>
                    </div>

                    <p className="text-sm text-sage pt-2">
                        ✓ You're 13 points above average! Keep up the good work.
                    </p>
                </div>
            </div>

            {/* Tips */}
            <div className="glass rounded-xl p-6 border border-amber/20 bg-amber/5">
                <h3 className="font-semibold text-amber mb-4">💡 Pro Tips to Improve</h3>
                <ul className="space-y-2 text-sm text-muted">
                    <li>✓ Set category-wise budgets and stick to them</li>
                    <li>✓ Automate your savings for consistency</li>
                    <li>✓ Review spending weekly, not just monthly</li>
                    <li>✓ Start investing to improve diversity score</li>
                    <li>✓ Build an emergency fund of 12 months expenses</li>
                </ul>
            </div>
        </div>
    );
}