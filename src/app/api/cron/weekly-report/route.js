import { createClient } from "@supabase/supabase-js";
import { sendWeeklyReportEmail } from "@/lib/email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  // Verify this request is actually from Vercel Cron, not a random visitor
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Get all distinct users who have a profile (and therefore preferences)
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, notification_preferences");

    if (profileError) throw profileError;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoStr = oneWeekAgo.toISOString().split("T")[0];

    for (const profile of profiles || []) {
      const prefs = profile.notification_preferences || {};
      if (prefs.weeklyReport === false) continue;

      const { data: weekExpenses, error: expError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", profile.user_id)
        .gte("date", oneWeekAgoStr);

      if (expError || !weekExpenses || weekExpenses.length === 0) continue;

      const totalSpent = weekExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

      const byCategory = {};
      weekExpenses.forEach((e) => {
        byCategory[e.category] = (byCategory[e.category] || 0) + parseFloat(e.amount);
      });

      const [topCategory, topCategoryAmount] =
        Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0] || [null, 0];

      await sendWeeklyReportEmail(profile.user_id, {
        totalSpent,
        topCategory,
        topCategoryAmount,
        expenseCount: weekExpenses.length,
      });
    }

    return Response.json({ success: true, usersProcessed: profiles?.length || 0 });
  } catch (err) {
    console.error("Weekly report cron error:", err);
    return Response.json({ error: "Failed to send weekly reports" }, { status: 500 });
  }
}