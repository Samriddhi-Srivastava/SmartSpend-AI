"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { getBudgets, upsertBudget, deleteBudget } from "@/lib/budgets";
import { getExpenses } from "@/lib/expenses";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Food", "Dining", "Transport", "Health", "Entertainment", "Other"];

export default function BudgetsPage() {
  const { data: session } = useSession();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formCategory, setFormCategory] = useState("Food");
  const [formLimit, setFormLimit] = useState("");

  useEffect(() => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }
    loadData();
  }, [session?.user?.email]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [budgetData, expenseData] = await Promise.all([
        getBudgets(session.user.email),
        getExpenses(session.user.email),
      ]);
      setBudgets(budgetData);
      setExpenses(expenseData);
      setError(null);
    } catch (err) {
      console.error("Error loading budgets:", err);
      setError("Failed to load budgets.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate this month's spending per category
  const getMonthlySpending = (category) => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return expenses
      .filter((e) => {
        const d = new Date(e.date);
        return e.category === category && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!formLimit || parseFloat(formLimit) <= 0) return;

    try {
      await upsertBudget(session.user.email, formCategory, formLimit);
      setFormLimit("");
      setIsFormOpen(false);
      await loadData();
    } catch (err) {
      console.error("Error saving budget:", err);
      setError("Failed to save budget.");
    }
  };

  const handleDeleteBudget = async (category) => {
    try {
      await deleteBudget(session.user.email, category);
      await loadData();
    } catch (err) {
      console.error("Error deleting budget:", err);
      setError("Failed to delete budget.");
    }
  };

  const availableCategories = CATEGORIES.filter(
    (c) => !budgets.some((b) => b.category === c)
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-mist dark:bg-slate-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Please log in to view budgets.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist dark:bg-slate-950 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-boldtext-ink dark:text-slate-100  font-display">
              Budgets
            </h1>
            <p className="text-muted dark:text-slate-400 mt-2">
              Set monthly limits and track your progress
            </p>
          </div>
          {availableCategories.length > 0 && (
            <button
              onClick={() => {
                setFormCategory(availableCategories[0]);
                setIsFormOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
            >
              <Plus size={20} />
              Set Budget
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-300 text-center py-12">Loading budgets...</p>
        ) : budgets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">
              No budgets set yet. Set a monthly limit per category to start tracking.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const spent = getMonthlySpending(budget.category);
              const percentage = Math.min(100, Math.round((spent / budget.monthly_limit) * 100));
              const isOverBudget = spent > budget.monthly_limit;
              const isNearLimit = percentage >= 80 && !isOverBudget;

              return (
                <div
                  key={budget.category}
                  className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
                      {(isOverBudget || isNearLimit) && (
                        <AlertTriangle
                          size={16}
                          className={isOverBudget ? "text-red-500" : "text-amber-500"}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteBudget(budget.category)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      ₹{spent.toLocaleString("en-IN")} of ₹{budget.monthly_limit.toLocaleString("en-IN")}
                    </span>
                    <span className={`font-bold ${
                      isOverBudget ? "text-red-500" : isNearLimit ? "text-amber-500" : "text-green-600"
                    }`}>
                      {percentage}%
                    </span>
                  </div>

                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isOverBudget ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-green-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Budget Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Set Budget</h2>
              <form onSubmit={handleAddBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {availableCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Monthly Limit (₹)</label>
                  <input
                    type="number"
                    value={formLimit}
                    onChange={(e) => setFormLimit(e.target.value)}
                    placeholder="5000"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-bold py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}