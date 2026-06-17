"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getExpenses, getTotalSpending, getAverageDailySpending, getExpensesByCategory } from "@/lib/expenses";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const [averageDailySpending, setAverageDailySpending] = useState(0);
  const [categoryData, setCategoryData] = useState([]);

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6", "#ec4899"];

  // Fetch expenses on mount
  useEffect(() => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const expensesData = await getExpenses(session.user.email);
        setExpenses(expensesData);

        const total = await getTotalSpending(session.user.email);
        setTotalSpending(total);

        const avgDaily = await getAverageDailySpending(session.user.email);
        setAverageDailySpending(avgDaily);

        const categories = await getExpensesByCategory(session.user.email);
        setCategoryData(categories);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [session?.user?.email]);

  // Prepare recent expenses (last 5)
  const recentExpenses = expenses.slice(0, 5);

  // Prepare monthly trend data
  const monthlyData = expenses.reduce((acc, exp) => {
    const date = new Date(exp.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const existing = acc.find((item) => item.month === monthKey);

    if (existing) {
      existing.amount += exp.amount;
    } else {
      acc.push({ month: monthKey, amount: exp.amount });
    }

    return acc;
  }, []).slice(-6); // Last 6 months

  // Calculate financial health score (0-100)
  const calculateHealthScore = () => {
    if (expenses.length === 0) return 50;
    
    const avgSpending = totalSpending / (expenses.length || 1);
    const variance = expenses.reduce((sum, exp) => sum + Math.pow(exp.amount - avgSpending, 2), 0) / expenses.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower standard deviation = more consistent spending = healthier
    const consistency = Math.max(0, 100 - stdDev / 2);
    return Math.min(100, Math.round(consistency));
  };

  const healthScore = calculateHealthScore();

  if (!session) {
    return (
      <div className="min-h-screen bg-mist dark:bg-slate-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
     <div className="min-h-screen bg-mist dark:bg-slate-950 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-boldtext-muted dark:text-slate-400 font-display">
            Welcome back, {session.user?.name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-muted dark:text-slate-400 mt-2">
            Here's your financial overview
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted dark:text-slate-400">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Spending */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Spending</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      ₹{totalSpending.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                    <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
                  </div>
                </div>
              </div>

              {/* Average Daily */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Daily Average</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      ₹{averageDailySpending.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                </div>
              </div>

              {/* Expenses Count */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {expenses.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                </div>
              </div>

              {/* Health Score */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Health Score</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {healthScore}/100
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Target className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Spending Trend */}
              {monthlyData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending Trend</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
                      <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Category Breakdown */}
              {categoryData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">By Category</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ₹${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Recent Expenses */}
            {recentExpenses.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Expenses</h2>
                <div className="space-y-3">
                  {recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{expense.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white">₹{expense.amount.toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {expenses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300 mb-4">No expenses yet. Add your first expense to see insights!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}