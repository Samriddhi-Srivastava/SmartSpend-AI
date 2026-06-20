import { getProfile } from "@/lib/profile";
import { getBudgets, checkBudgetThreshold } from "@/lib/budgets";
import { getExpenses } from "@/lib/expenses";
import {
  sendExpenseReminderEmail,
  sendBudgetAlertEmail,
} from "@/lib/email";
import { createInAppNotification } from "@/lib/notifications";

export async function POST(request) {
  try {
    const { userId, expense } = await request.json();

    if (!userId || !expense) {
      return Response.json(
        { error: "Missing userId or expense" },
        { status: 400 }
      );
    }

    // Get user's notification preferences
    const profile = await getProfile(userId);
    const prefs = profile?.notification_preferences || {};

    // Expense reminder
    if (prefs.expenseReminders !== false) {
      sendExpenseReminderEmail(userId, expense);
      await createInAppNotification(userId, {
        type: "expense_added",
        title: "Expense Added",
        message: `${expense.name} - ₹${expense.amount} logged to ${expense.category}`,
      }).catch((err) => console.error("Failed to create in-app notification:", err));
    }

    // Budget alert
    if (prefs.budgetAlerts !== false) {
      const budgets = await getBudgets(userId);
      const matchingBudget = budgets.find((b) => b.category === expense.category);

      if (matchingBudget) {
        const allExpenses = await getExpenses(userId);
        const now = new Date();
        const monthSpend = allExpenses
          .filter((e) => {
            const d = new Date(e.date);
            return (
              e.category === expense.category &&
              d.getMonth() === now.getMonth() &&
              d.getFullYear() === now.getFullYear()
            );
          })
          .reduce((sum, e) => sum + e.amount, 0);

        const { triggered, percentage } = checkBudgetThreshold(
          monthSpend,
          matchingBudget.monthly_limit
        );
        if (triggered) {
          sendBudgetAlertEmail(userId, {
            category: expense.category,
            spent: monthSpend,
            limit: matchingBudget.monthly_limit,
          });
          await createInAppNotification(userId, {
            type: "budget_alert",
            title: "Budget Alert",
            message: `${expense.category} spending is at ${percentage}% of your ₹${matchingBudget.monthly_limit.toLocaleString("en-IN")} budget`,
          }).catch((err) => console.error("Failed to create budget alert notification:", err));
        }
      }
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Notification API error:", err);
    return Response.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}