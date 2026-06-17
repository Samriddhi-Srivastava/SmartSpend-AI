"use client";

export const dynamic = "force-dynamic";

import { TrendingUp, Shield, Target, AlertCircle } from "lucide-react";

const metrics = [
  { label: "Savings Rate", score: 28, max: 100, color: "#7FD1A6", description: "You save 28% of income" },
  { label: "Spending Control", score: 72, max: 100, color: "#F0C088", description: "Mostly within budget" },
  { label: "Debt Management", score: 90, max: 100, color: "#60A5FA", description: "No major debts" },
  { label: "Emergency Fund", score: 45, max: 100, color: "#F87171", description: "3 months of expenses saved" },
];

const tips = [
  { icon: Target, text: "Set up automatic savings to reach your emergency fund goal faster" },
  { icon: TrendingUp, text: "Your spending control improved 8% from last month - keep it up!" },
  { icon: AlertCircle, text: "Consider reducing food expenses to boost your savings rate above 30%" },
];

export default function HealthScorePage() {
  const overallScore = 72;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-mist">Financial Health Score</h1>
        <p className="text-muted mt-1">Your overall financial wellness rating</p>
      </div>

      {/* Big Score */}
      <div className="glass rounded-xl border border-white/[0.08] p-8 text-center">
        <div className="relative inline-flex items-center justify-center w-40 h-40 mb-6">
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
            <circle
              cx="80" cy="80" r="70"
              fill="none"
              stroke="#7FD1A6"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - overallScore / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute text-center">
            <span className="font-display text-5xl font-bold text-mist">{overallScore}</span>
            <span className="block text-sm text-muted">out of 100</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-sage mb-2">Good</h2>
        <p className="text-muted max-w-sm mx-auto">
          Your financial health is above average. Focus on building your emergency fund to reach "Excellent" status.
        </p>
      </div>

      {/* Metric Breakdown */}
      <div className="glass rounded-xl border border-white/[0.08] p-6">
        <h2 className="text-lg font-semibold text-mist mb-6 flex items-center gap-2">
          <Shield size={20} className="text-sage" />
          Score Breakdown
        </h2>
        <div className="space-y-5">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-mist">{metric.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted">{metric.description}</span>
                  <span className="font-bold text-mist">{metric.score}</span>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{ width: `${metric.score}%`, backgroundColor: metric.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="glass rounded-xl border border-white/[0.08] p-6">
        <h2 className="text-lg font-semibold text-mist mb-4">How to Improve</h2>
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
              <tip.icon size={18} className="text-sage mt-0.5 shrink-0" />
              <p className="text-sm text-mist">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
