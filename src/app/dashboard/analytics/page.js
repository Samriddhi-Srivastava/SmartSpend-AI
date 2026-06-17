"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { getExpenses } from "@/lib/expenses";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [timeframe, setTimeframe] = useState("month"); // week, month, year
  const [categoryData, setCategoryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topCategories, setTopCategories] = useState([]);

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6", "#ec4899", "#14b8a6", "#f97316"];

  // Fetch and process analytics data
  useEffect(() => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }

    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        const expensesData = await getExpenses(session.user.email);
        setExpenses(expensesData);

        // Process category data
        const categoryBreakdown = {};
        expensesData.forEach((exp) => {
          categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
        });

        const categoryArray = Object.entries(categoryBreakdown)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        setCategoryData(categoryArray);
        setTopCategories(categoryArray.slice(0, 5));

        // Process daily data (last 30 days)
        const dailyBreakdown = {};
        const today = new Date();
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          dailyBreakdown[dateStr] = 0;
        }

        expensesData.forEach((exp) => {
          if (dailyBreakdown.hasOwnProperty(exp.date)) {
            dailyBreakdown[exp.date] += exp.amount;
          }
        });

        const dailyArray = Object.entries(dailyBreakdown)
          .map(([date, amount]) => ({ date, amount }))
          .reverse();

        setDailyData(dailyArray);

        // Process weekly data
        const weeklyBreakdown = {};
        expensesData.forEach((exp) => {
          const date = new Date(exp.date);
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          const weekKey = weekStart.toISOString().split("T")[0];

          weeklyBreakdown[weekKey] = (weeklyBreakdown[weekKey] || 0) + exp.amount;
        });

        const weeklyArray = Object.entries(weeklyBreakdown)
          .map(([week, amount]) => ({ week, amount }))
          .sort();

        setWeeklyData(weeklyArray);

        // Process monthly data
        const monthlyBreakdown = {};
        expensesData.forEach((exp) => {
          const date = new Date(exp.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          monthlyBreakdown[monthKey] = (monthlyBreakdown[monthKey] || 0) + exp.amount;
        });

        const monthlyArray = Object.entries(monthlyBreakdown)
          .map(([month, amount]) => ({ month, amount }))
          .sort();

        setMonthlyData(monthlyArray);
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [session?.user?.email]);

  // Get data based on timeframe
  const getTimeframeData = () => {
    switch (timeframe) {
      case "week":
        return dailyData.slice(-7);
      case "month":
        return dailyData;
      case "year":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  const timeframeData = getTimeframeData();
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgSpending = expenses.length > 0 ? totalSpending / expenses.length : 0;

  if (!session) {
    return (
      <div className="min-h-screen bg-mist dark:bg-slate-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Please log in to view analytics.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist dark:bg-slate-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-boldtext-ink dark:text-slate-100  font-display">
            Analytics
          </h1>
          <p className="text-muted dark:text-slate-400 mt-2">
            Deep dive into your spending patterns
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Timeframe Selector */}
            <div className="flex gap-2 mb-8">
              {["week", "month", "year"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    timeframe === tf
                      ? "bg-green-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Spending</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  ₹{totalSpending.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Average Expense</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  ₹{Math.round(avgSpending).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Entries</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {expenses.length}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Spending Trend */}
              {timeframeData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Spending Trend
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timeframeData}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey={timeframe === "year" ? "month" : "date"}
                        stroke="#6b7280"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                        formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                      />
                      <Area
                        type="monotone"
                        dataKey={timeframe === "year" ? "amount" : "amount"}
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Category Distribution */}
              {categoryData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Spending by Category
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ₹${value.toLocaleString("en-IN")}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Top Categories Table */}
            {topCategories.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Top Categories
                </h2>
                <div className="space-y-2">
                  {topCategories.map((category, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-900 dark:text-white font-medium">{category.name}</span>
                      <span className="text-gray-900 dark:text-white font-bold">
                        ₹{category.value.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {expenses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">
                  No expense data yet. Add expenses to see analytics!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}