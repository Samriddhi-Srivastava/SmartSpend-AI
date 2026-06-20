"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import ExpenseForm from "@/components/dashboard/ExpenseForm";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "@/lib/expenses";

export const dynamic = "force-dynamic";

export default function ExpensesPage() {
  const { data: session } = useSession();
  const [expenses, setExpenses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["All", "Food", "Dining", "Transport", "Health", "Entertainment", "Other"];

  // Fetch expenses on mount or when user changes
  useEffect(() => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }

    const loadExpenses = async () => {
      try {
        setIsLoading(true);
        const data = await getExpenses(session.user.email);
        setExpenses(data);
        setError(null);
      } catch (err) {
        console.error("Error loading expenses:", err);
        setError("Failed to load expenses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenses();
  }, [session?.user?.email]);

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddExpense = async (expenseData) => {
    if (!session?.user?.email) return;

    try {
      if (editingId) {
        // Update existing expense
        const updated = await updateExpense(session.user.email, editingId, expenseData);
        setExpenses(
          expenses.map((exp) =>
            exp.id === editingId ? { ...exp, ...updated } : exp
          )
        );
        setEditingId(null);
      } else {
        // Add new expense
        const newExpense = await addExpense(session.user.email, expenseData);
        setExpenses([newExpense, ...expenses]);

        // Fire off notifications (non-blocking)
        fetch("/api/send-notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.email,
            expense: newExpense,
          }),
        }).catch((err) => console.error("Notification fetch failed:", err));
      }
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      console.error("Error saving expense:", err);
      setError("Failed to save expense. Please try again.");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!session?.user?.email) return;

    try {
      await deleteExpense(session.user.email, id);
      setExpenses(expenses.filter((exp) => exp.id !== id));
      setError(null);
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense. Please try again.");
    }
  };

  const handleEditExpense = (expense) => {
    setEditingId(expense.id);
    setIsFormOpen(true);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-mist dark:bg-slate-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Please log in to view expenses.</p>
      </div>
    );
  }

  return (
     <div className="min-h-screen bg-mist dark:bg-slate-950 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-ink dark:text-slate-100 font-display">
              Expenses
            </h1>
            <p className="text-muted dark:text-slate-400 mt-2">
              Track and manage your spending
            </p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setIsFormOpen(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
          >
            <Plus size={20} />
            Add Expense
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-display">
                {editingId ? "Edit Expense" : "Add New Expense"}
              </h2>
              <ExpenseForm
                onSubmit={handleAddExpense}
                onCancel={() => setIsFormOpen(false)}
                initialData={editingId ? expenses.find((e) => e.id === editingId) : null}
              />
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 text-gray-600 dark:text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">Loading expenses...</p>
          </div>
        )}

        {/* Expenses List */}
        {!isLoading && (
          <div className="space-y-3">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">
                  {expenses.length === 0 ? "No expenses yet. Add one to get started!" : "No expenses found"}
                </p>
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-all"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {expense.name}
                    </h3>
                    <div className="flex gap-4 mt-1 text-sm text-gray-600 dark:text-gray-300">
                      <span>{expense.category}</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                      {expense.notes && <span>{expense.notes}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{parseFloat(expense.amount).toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => handleEditExpense(expense)}
                      className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}