import { supabase } from "./supabase";

export async function getBudgets(userId) {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return (data || []).map((b) => ({ ...b, monthly_limit: parseFloat(b.monthly_limit) }));
}

export async function upsertBudget(userId, category, monthlyLimit) {
  const { data, error } = await supabase
    .from("budgets")
    .upsert(
      { user_id: userId, category, monthly_limit: parseFloat(monthlyLimit) },
      { onConflict: "user_id,category" }
    )
    .select();

  if (error) throw error;
  return data?.[0];
}

export async function deleteBudget(userId, category) {
  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("user_id", userId)
    .eq("category", category);

  if (error) throw error;
}

/**
 * Check if current month's spending in a category has crossed
 * the budget limit (80% or 100%+). Returns alert info or null.
 */
export function checkBudgetThreshold(spent, limit) {
  const percentage = (spent / limit) * 100;
  if (percentage >= 80) {
    return { triggered: true, percentage: Math.round(percentage) };
  }
  return { triggered: false, percentage: Math.round(percentage) };
}