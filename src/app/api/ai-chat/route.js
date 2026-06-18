import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Server-side Supabase client (separate from the browser one in src/lib/supabase.js)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { message, userEmail } = await request.json();

    if (!message || !userEmail) {
      return Response.json({ error: "Missing message or user" }, { status: 400 });
    }

    // Fetch the user's real expenses
    const { data: expenses, error: expError } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userEmail)
      .order("date", { ascending: false });

    if (expError) throw expError;

    const expenseList = expenses || [];

    // Build a compact summary instead of dumping raw rows (keeps the prompt small and cheap)
    const total = expenseList.reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const byCategory = {};
    expenseList.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + parseFloat(e.amount);
    });

    const categorySummary = Object.entries(byCategory)
      .map(([cat, amt]) => `${cat}: ₹${amt.toFixed(0)}`)
      .join(", ");

    const recentList = expenseList
      .slice(0, 15)
      .map((e) => `${e.date} - ${e.name} (${e.category}): ₹${e.amount}`)
      .join("\n");

    const systemContext = `You are SmartSpend AI, a friendly personal finance assistant. 
You have access to this user's real expense data. Use it to give specific, personalized, actionable answers.
Always answer in Indian Rupees (₹). Keep responses concise (3-5 sentences unless asked for detail).

USER'S FINANCIAL SUMMARY:
- Total expenses recorded: ${expenseList.length}
- Total spending: ₹${total.toFixed(0)}
- Spending by category: ${categorySummary || "No data yet"}

RECENT TRANSACTIONS:
${recentList || "No expenses recorded yet."}

USER'S QUESTION: ${message}`;

    const model = genAI.getGenerativeModel(
  { model: "gemini-2.5-flash" },
  { apiVersion: "v1" }
);
    const result = await model.generateContent(systemContext);
    const reply = result.response.text();

    return Response.json({ reply });
  } catch (err) {
    console.error("AI Chat error:", err);
    return Response.json(
      { error: "Failed to get AI response. Please try again." },
      { status: 500 }
    );
  }
}