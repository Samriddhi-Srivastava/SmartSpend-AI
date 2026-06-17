"use client";

import { useState, useEffect } from "react";

export default function ExpenseForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        amount: initialData.amount,
        category: initialData.category,
        date: initialData.date,
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    setFormData({
      name: "",
      amount: "",
      category: "Food",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
  };

  const categories = [
    "Food",
    "Dining",
    "Transport",
    "Health",
    "Entertainment",
    "Other",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Expense Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Groceries"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900"
          required
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Amount (₹) *
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Optional notes..."
          rows="3"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors"
        >
          {initialData ? "Update" : "Add"} Expense
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
