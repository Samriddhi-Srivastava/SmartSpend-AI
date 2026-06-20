import { supabase } from "./supabase";
import { getProfile } from "./profile";
import { sendExpenseReminderEmail, sendBudgetAlertEmail } from "./email";
import { getBudgets, checkBudgetThreshold } from "./budgets";

/**
 * Get all expenses for the current user
 */
export async function getExpenses(userId) {
  if (!userId) throw new Error("User ID is required");

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Add a new expense
 */

export async function addExpense(userId, expense) {
  if (!userId) throw new Error("User ID is required");

  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        user_id: userId,
        name: expense.name,
        amount: parseFloat(expense.amount),
        category: expense.category,
        date: expense.date,
        notes: expense.notes || "",
      },
    ])
    .select();

  if (error) throw error;

  return data?.[0];
}
/**
 * Update an existing expense
 */
export async function updateExpense(userId, expenseId, updates) {
  if (!userId) throw new Error("User ID is required");

  const { data, error } = await supabase
    .from("expenses")
    .update({
      name: updates.name,
      amount: parseFloat(updates.amount),
      category: updates.category,
      date: updates.date,
      notes: updates.notes || "",
    })
    .eq("id", expenseId)
    .eq("user_id", userId)
    .select();

  if (error) throw error;
  return data?.[0];
}

/**
 * Delete an expense
 */
export async function deleteExpense(userId, expenseId) {
  if (!userId) throw new Error("User ID is required");

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId)
    .eq("user_id", userId);

  if (error) throw error;
}

/**
 * Get spending by category
 */
export async function getExpensesByCategory(userId) {
  if (!userId) throw new Error("User ID is required");

  const expenses = await getExpenses(userId);

  const byCategory = {};
  expenses.forEach((exp) => {
    if (!byCategory[exp.category]) {
      byCategory[exp.category] = 0;
    }
    byCategory[exp.category] += exp.amount;
  });

  return Object.entries(byCategory).map(([name, value]) => ({
    name,
    value,
  }));
}

/**
 * Get total spending
 */
export async function getTotalSpending(userId) {
  if (!userId) throw new Error("User ID is required");

  const expenses = await getExpenses(userId);
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

/**
 * Get average daily spending
 */
export async function getAverageDailySpending(userId) {
  if (!userId) throw new Error("User ID is required");

  const expenses = await getExpenses(userId);
  if (expenses.length === 0) return 0;

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const daysSpanned = new Set(expenses.map((e) => e.date)).size;

  return Math.round(total / daysSpanned);
}
