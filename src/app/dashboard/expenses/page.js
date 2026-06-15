"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, Filter, Download } from "lucide-react";

/**
 * Expenses Page
 * 
 * Route: /dashboard/expenses
 * 
 * Features:
 * - List all expenses
 * - Add new expense (modal)
 * - Edit expense
 * - Delete expense
 * - Filter by category
 * - Search
 * - Export to CSV
 * - Category breakdown
 */

const categories = [
    { name: "Food", icon: "🍔", color: "bg-orange-500/20" },
    { name: "Transport", icon: "🚕", color: "bg-blue-500/20" },
    { name: "Entertainment", icon: "🎬", color: "bg-purple-500/20" },
    { name: "Utilities", icon: "⚡", color: "bg-yellow-500/20" },
    { name: "Health", icon: "🏥", color: "bg-red-500/20" },
    { name: "Shopping", icon: "🛍️", color: "bg-pink-500/20" },
    { name: "Other", icon: "📦", color: "bg-gray-500/20" },
];

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState([
        {
            id: 1,
            name: "Coffee",
            category: "Food",
            amount: 120,
            date: "2024-06-15",
            description: "Morning coffee",
        },
        {
            id: 2,
            name: "Electricity Bill",
            category: "Utilities",
            amount: 1200,
            date: "2024-06-14",
            description: "Monthly bill",
        },
        {
            id: 3,
            name: "Uber to Office",
            category: "Transport",
            amount: 250,
            date: "2024-06-13",
            description: "Office commute",
        },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredExpenses = expenses.filter((expense) => {
        const matchesCategory =
            selectedCategory === "All" || expense.category === selectedCategory;
        const matchesSearch = expense.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    const categoryBreakdown = categories.map((cat) => ({
        ...cat,
        total: expenses
            .filter((e) => e.category === cat.name)
            .reduce((sum, e) => sum + e.amount, 0),
    }));

    return (
        <div className="p-6 sm:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold text-mist">
                        Expenses
                    </h1>
                    <p className="text-muted mt-2">
                        Track and manage your spending
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-sage hover:bg-sage-deep text-ink font-semibold px-4 py-2 rounded-lg transition"
                >
                    <Plus size={20} />
                    Add Expense
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass rounded-xl p-6 border border-white/[0.08]">
                    <p className="text-sm text-muted mb-2">Total This Month</p>
                    <p className="text-3xl font-bold text-mist">₹{expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
                </div>
                <div className="glass rounded-xl p-6 border border-white/[0.08]">
                    <p className="text-sm text-muted mb-2">Filtered Total</p>
                    <p className="text-3xl font-bold text-sage">₹{totalSpent.toLocaleString()}</p>
                </div>
                <div className="glass rounded-xl p-6 border border-white/[0.08]">
                    <p className="text-sm text-muted mb-2">Transactions</p>
                    <p className="text-3xl font-bold text-amber">{expenses.length}</p>
                </div>
            </div>

            {/* Category Breakdown */}
            <div>
                <h2 className="text-lg font-semibold text-mist mb-4">
                    Spending by Category
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`glass rounded-lg p-4 border text-center transition ${selectedCategory === "All"
                                ? "border-sage bg-sage/10"
                                : "border-line hover:border-sage/50"
                            }`}
                    >
                        <p className="text-2xl mb-2">📊</p>
                        <p className="text-sm font-medium text-mist">All</p>
                        <p className="text-xs text-muted mt-1">
                            ₹{expenses.reduce((sum, e) => sum + e.amount, 0)}
                        </p>
                    </button>

                    {categoryBreakdown.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`glass rounded-lg p-4 border text-center transition ${selectedCategory === cat.name
                                    ? "border-sage bg-sage/10"
                                    : "border-line hover:border-sage/50"
                                }`}
                        >
                            <p className="text-2xl mb-2">{cat.icon}</p>
                            <p className="text-sm font-medium text-mist">{cat.name}</p>
                            <p className="text-xs text-muted mt-1">₹{cat.total}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-2 bg-white/5 border border-line rounded-lg px-3 py-2">
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent text-mist placeholder:text-muted/50 outline-none flex-1"
                    />
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg transition border border-line">
                    <Filter size={20} className="text-muted" />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg transition border border-line">
                    <Download size={20} className="text-muted" />
                </button>
            </div>

            {/* Expenses List */}
            <div className="glass rounded-xl border border-white/[0.08] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-line">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map((expense) => (
                                <tr
                                    key={expense.id}
                                    className="border-b border-line hover:bg-white/5 transition"
                                >
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-mist">{expense.name}</p>
                                        <p className="text-sm text-muted">{expense.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-sm bg-sage/20 text-sage">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-mist">
                                        ₹{expense.amount}
                                    </td>
                                    <td className="px-6 py-4 text-muted text-sm">
                                        {new Date(expense.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-white/10 rounded transition">
                                                <Edit size={16} className="text-muted" />
                                            </button>
                                            <button className="p-2 hover:bg-red-500/10 rounded transition">
                                                <Trash2 size={16} className="text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Expense Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-xl border border-white/[0.08] p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold text-mist mb-4">Add Expense</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    placeholder="What did you spend on?"
                                    className="w-full bg-white/5 border border-line rounded-lg px-3 py-2 text-mist placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-sage/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted mb-2">
                                    Category
                                </label>
                                <select className="w-full bg-white/5 border border-line rounded-lg px-3 py-2 text-mist focus:outline-none focus:ring-2 focus:ring-sage/50">
                                    {categories.map((cat) => (
                                        <option key={cat.name} value={cat.name}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-muted mb-2">
                                    Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-full bg-white/5 border border-line rounded-lg px-3 py-2 text-mist placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-sage/50"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-white/10 hover:bg-white/15 text-mist font-semibold py-2 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 bg-sage hover:bg-sage-deep text-ink font-semibold py-2 rounded-lg transition">
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}