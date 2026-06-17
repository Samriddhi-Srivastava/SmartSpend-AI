"use client";

import { useState } from "react";
import { BarChart2, TrendingUp, PieChart, Calendar } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const categoryData = [
  { name: "Food", value: 4500, color: "#7FD1A6" },
  { name: "Transport", value: 2000, color: "#F0C088" },
  { name: "Shopping", value: 3200, color: "#60A5FA" },
  { name: "Bills", value: 1800, color: "#F87171" },
  { name: "Entertainment", value: 1200, color: "#A78BFA" },
];

const monthlyData = [
  { month: "Jan", income: 25000, expenses: 18000 },
  { month: "Feb", income: 25000, expenses: 21000 },
  { month: "Mar", income: 27000, expenses: 19000 },
  { month: "Apr", income: 25000, expenses: 22000 },
  { month: "May", income: 28000, expenses: 20000 },
  { month: "Jun", income: 25000, expenses: 17000 },
];

const trendData = [
  { day: "Mon", amount: 850 },
  { day: "Tue", amount: 1200 },
  { day: "Wed", amount: 600 },
  { day: "Thu", amount: 1800 },
  { day: "Fri", amount: 2200 },
  { day: "Sat", amount: 1500 },
  { day: "Sun", amount: 900 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("monthly");

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-mist dark:text-slate-100">
            Analytics
          </h1>
          <p className="text-muted dark:text-slate-400 mt-1">
            Deep insights into your spending patterns
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex bg-white/5 dark:bg-slate-800 rounded-lg p-1 border border-line dark:border-slate-700">
          {["weekly", "monthly", "yearly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition capitalize ${
                period === p
                  ? "bg-sage text-ink"
                  : "text-muted dark:text-slate-400 hover:text-mist dark:hover:text-slate-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Spent", value: "₹12,700", change: "+8%", up: true },
          { label: "Avg Daily", value: "₹423", change: "-3%", up: false },
          { label: "Top Category", value: "Food", change: "₹4,500", up: true },
          { label: "Saved", value: "₹7,300", change: "+12%", up: false },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass rounded-xl border border-white/[0.08] dark:border-slate-700 p-4"
          >
            <p className="text-xs text-muted dark:text-slate-400">{stat.label}</p>
            <p className="text-xl font-bold text-mist dark:text-slate-100 mt-1">{stat.value}</p>
            <p className={`text-xs mt-1 ${stat.up ? "text-sage" : "text-amber"}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="glass rounded-xl border border-white/[0.08] dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-mist dark:text-slate-100 mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-sage" />
            Spending by Category
          </h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <RechartsPie>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`₹${value}`, "Amount"]}
                  contentStyle={{
                    background: "#121A21",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    color: "#E8EEEA",
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm text-muted dark:text-slate-400">{cat.name}</span>
                  </div>
                  <span className="text-sm font-medium text-mist dark:text-slate-100">
                    ₹{cat.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Income vs Expenses Bar Chart */}
        <div className="glass rounded-xl border border-white/[0.08] dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-mist dark:text-slate-100 mb-6 flex items-center gap-2">
            <BarChart2 size={20} className="text-sage" />
            Income vs Expenses
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <XAxis
                dataKey="month"
                tick={{ fill: "#8B9A93", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8B9A93", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v / 1000}k`}
              />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
                contentStyle={{
                  background: "#121A21",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  color: "#E8EEEA",
                }}
              />
              <Bar dataKey="income" fill="#7FD1A6" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#F0C088" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend */}
        <div className="glass rounded-xl border border-white/[0.08] dark:border-slate-700 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-mist dark:text-slate-100 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-sage" />
            Weekly Spending Trend
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#8B9A93", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8B9A93", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Spent"]}
                contentStyle={{
                  background: "#121A21",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  color: "#E8EEEA",
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#7FD1A6"
                strokeWidth={2}
                dot={{ fill: "#7FD1A6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
