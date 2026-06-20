import { Resend } from "resend";

const FROM_ADDRESS = "SmartSpend AI <onboarding@resend.dev>";

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendExpenseReminderEmail(toEmail, expense) {
  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: toEmail,
      subject: `Expense logged: ${expense.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #10b981;">Expense Added ✅</h2>
          <p>You just logged a new expense in SmartSpend AI:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; color: #666;">Name</td><td style="padding: 8px; font-weight: bold;">${expense.name}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Amount</td><td style="padding: 8px; font-weight: bold;">₹${expense.amount}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Category</td><td style="padding: 8px; font-weight: bold;">${expense.category}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Date</td><td style="padding: 8px; font-weight: bold;">${expense.date}</td></tr>
          </table>
          <p style="color: #999; font-size: 12px;">You're receiving this because Expense Reminders are enabled in your SmartSpend AI settings.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send expense reminder email:", err);
  }
}

export async function sendBudgetAlertEmail(toEmail, { category, spent, limit }) {
  try {
    const resend = getResendClient();
    const percentage = Math.round((spent / limit) * 100);
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: toEmail,
      subject: `Budget alert: ${category} spending at ${percentage}%`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Budget Alert ⚠️</h2>
          <p>Your spending on <strong>${category}</strong> has reached <strong>${percentage}%</strong> of your monthly budget.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; color: #666;">Spent so far</td><td style="padding: 8px; font-weight: bold;">₹${spent.toLocaleString("en-IN")}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Monthly limit</td><td style="padding: 8px; font-weight: bold;">₹${limit.toLocaleString("en-IN")}</td></tr>
          </table>
          <p style="color: #999; font-size: 12px;">You're receiving this because Budget Alerts are enabled in your SmartSpend AI settings.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send budget alert email:", err);
  }
}

export async function sendWeeklyReportEmail(toEmail, { totalSpent, topCategory, topCategoryAmount, expenseCount }) {
  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: toEmail,
      subject: `Your weekly spending report`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #10b981;">Weekly Report 📊</h2>
          <p>Here's a summary of your spending this past week:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; color: #666;">Total spent</td><td style="padding: 8px; font-weight: bold;">₹${totalSpent.toLocaleString("en-IN")}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Expenses logged</td><td style="padding: 8px; font-weight: bold;">${expenseCount}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Top category</td><td style="padding: 8px; font-weight: bold;">${topCategory || "N/A"} (₹${(topCategoryAmount || 0).toLocaleString("en-IN")})</td></tr>
          </table>
          <p style="color: #999; font-size: 12px;">You're receiving this because Weekly Reports are enabled in your SmartSpend AI settings.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send weekly report email:", err);
  }
}