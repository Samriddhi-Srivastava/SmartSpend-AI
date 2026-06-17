"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { getExpenses } from "@/lib/expenses";

export const dynamic = "force-dynamic";

export default function HealthScorePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [healthScore, setHealthScore] = useState(0);
  const [metrics, setMetrics] = useState({
    consistency: 0,
    control: 0,
    diversity: 0,
    trend: 0,
    savings: 0,
  });
  const [recommendations, setRecommendations] = useState([]);
  const [spendingTrend, setSpendingTrend] = useState([]);

  // Calculate health score and metrics
  useEffect(() => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }

    const calculateHealth = async () => {
      try {
        setIsLoading(true);
        const expensesData = await getExpenses(session.user.email);
        setExpenses(expensesData);

        if (expensesData.length === 0) {
          setHealthScore(50);
          setIsLoading(false);
          return;
        }

        // 1. Consistency Score (0-100)
        // Lower standard deviation = more consistent = healthier
        const amounts = expensesData.map((e) => e.amount);
        const avgAmount = amounts.reduce((a, b) => a + b) / amounts.length;
        const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avgAmount, 2), 0) / amounts.length;
        const stdDev = Math.sqrt(variance);
        const consistencyScore = Math.max(0, Math.min(100, 100 - stdDev / 2));

        // 2. Control Score (0-100)
        // Based on how many expenses exceed 1.5x average
        const outliers = amounts.filter((a) => a > avgAmount * 1.5).length;
        const outlierRatio = outliers / amounts.length;
        const controlScore = Math.max(0, 100 - outlierRatio * 150);

        // 3. Diversity Score (0-100)
        // Spread across multiple categories
        const categories = new Set(expensesData.map((e) => e.category)).size;
        const diversityScore = Math.min(100, (categories / 6) * 100);

        // 4. Trend Score (0-100)
        // Is spending decreasing? (positive trend)
        const recentExpenses = expensesData.slice(0, Math.floor(expensesData.length / 2));
        const olderExpenses = expensesData.slice(Math.floor(expensesData.length / 2));
        const recentAvg = recentExpenses.reduce((sum, e) => sum + e.amount, 0) / recentExpenses.length;
        const olderAvg = olderExpenses.reduce((sum, e) => sum + e.amount, 0) / olderExpenses.length;
        const trendDifference = ((olderAvg - recentAvg) / olderAvg) * 100;
        const trendScore = Math.max(0, Math.min(100, 50 + trendDifference));

        // 5. Savings Potential (0-100)
        // Based on category concentration
        const categoryTotals = {};
        expensesData.forEach((e) => {
          categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
        });
        const topCategory = Math.max(...Object.values(categoryTotals));
        const totalSpending = Object.values(categoryTotals).reduce((a, b) => a + b);
        const topCategoryRatio = topCategory / totalSpending;
        const savingsScore = topCategoryRatio > 0.4 ? 40 : topCategoryRatio > 0.3 ? 60 : 80;

        // Calculate overall score (weighted average)
        const overallScore = Math.round(
          consistencyScore * 0.2 +
          controlScore * 0.2 +
          diversityScore * 0.15 +
          trendScore * 0.2 +
          savingsScore * 0.25
        );

        setHealthScore(overallScore);
        setMetrics({
          consistency: Math.round(consistencyScore),
          control: Math.round(controlScore),
          diversity: Math.round(diversityScore),
          trend: Math.round(trendScore),
          savings: Math.round(savingsScore),
        });

        // Generate recommendations
        const recs = [];
        if (consistencyScore < 60) {
          recs.push({
            type: "warning",
            title: "Spending Inconsistency",
            description: "Your expenses vary significantly. Try setting daily spending limits.",
          });
        }
        if (controlScore < 60) {
          recs.push({
            type: "warning",
            title: "High Outliers Detected",
            description: "You have several expenses much larger than your average. Monitor these.",
          });
        }
        if (diversityScore < 50) {
          recs.push({
            type: "info",
            title: "Limited Category Diversity",
            description: "Try diversifying your spending across more categories.",
          });
        }
        if (trendScore < 50) {
          recs.push({
            type: "warning",
            title: "Spending is Increasing",
            description: "Your recent expenses are higher than before. Consider reviewing your budget.",
          });
        }
        if (savingsScore < 60) {
          recs.push({
            type: "alert",
            title: "Savings Opportunity",
            description: `You're spending heavily on ${Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]}. This is a key area to reduce.`,
          });
        }
        if (overallScore >= 80) {
          recs.push({
            type: "success",
            title: "Excellent Financial Health!",
            description: "You're managing your finances very well. Keep it up!",
          });
        }

        setRecommendations(recs.length > 0 ? recs : [{ type: "info", title: "All Clear", description: "Your finances look good!" }]);

        // Generate spending trend data
        const monthlyData = {};
        expensesData.forEach((e) => {
          const date = new Date(e.date);
          const monthKey = date.toISOString().slice(0, 7);
          monthlyData[monthKey] = (monthlyData[monthKey] || 0) + e.amount;
        });

        const trendData = Object.entries(monthlyData)
          .sort()
          .map(([month, amount]) => ({ month, amount }));

        setSpendingTrend(trendData);
      } catch (err) {
        console.error("Error calculating health score:", err);
      } finally {
        setIsLoading(false);
      }
    };

    calculateHealth();
  }, [session?.user?.email]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-900/10";
    if (score >= 60) return "from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-900/10";
    if (score >= 40) return "from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-900/10";
    return "from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-900/10";
  };

  const radarData = [
    { name: "Consistency", value: metrics.consistency },
    { name: "Control", value: metrics.control },
    { name: "Diversity", value: metrics.diversity },
    { name: "Trend", value: metrics.trend },
    { name: "Savings", value: metrics.savings },
  ];

  if (!session) {
    return (
      <div className="min-h-screen bg-mist dark:bg-slate-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Please log in to view your health score.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist dark:bg-slate-950 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-boldtext-ink dark:text-slate-100  font-display">
            Financial Health Score
          </h1>
         <p className="text-muted dark:text-slate-400 mt-2">
            Your personalized financial wellness report
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">Calculating your health score...</p>
          </div>
        ) : (
          <>
            {/* Main Score */}
            <div className={`bg-gradient-to-br ${getScoreBgColor(healthScore)} rounded-lg p-8 mb-8 border border-gray-200 dark:border-gray-700`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">Your Health Score</p>
                  <div className={`text-6xl font-bold ${getScoreColor(healthScore)}`}>
                    {healthScore}
                    <span className="text-3xl">/100</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-4">
                    {healthScore >= 80
                      ? "Excellent! You're managing finances brilliantly."
                      : healthScore >= 60
                      ? "Good! Your finances are on track."
                      : healthScore >= 40
                      ? "Fair. There's room for improvement."
                      : "Needs attention. Review your spending habits."}
                  </p>
                </div>

                {/* Circular Progress */}
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray={`${(healthScore / 100) * 565.48} 565.48`}
                      className={`transition-all duration-1000 ${getScoreColor(healthScore)}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${getScoreColor(healthScore)}`}>
                      {healthScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {Object.entries(metrics).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center"
                >
                  <p className="text-gray-600 dark:text-gray-400 text-sm capitalize mb-2">{key}</p>
                  <p className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}</p>
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        value >= 80
                          ? "bg-green-600"
                          : value >= 60
                          ? "bg-yellow-600"
                          : value >= 40
                          ? "bg-orange-600"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Radar Chart */}
{expenses.length > 0 && (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Financial Health Metrics
    </h2>
    {expenses.length < 5 && (
      <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
        ⚠️ Add more expenses for a more accurate health metrics breakdown.
      </p>
    )}
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={radarData} margin={{ top: 30, right: 60, bottom: 30, left: 60 }}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis 
          dataKey="name" 
          stroke="#6b7280"
          tick={{ fontSize: 13 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]} 
          stroke="#9ca3af"
          tick={{ fontSize: 11 }}
          tickCount={5}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.5}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  </div>
)}

            {/* Spending Trend */}
{spendingTrend.length > 0 && (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Spending Trend
    </h2>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={spendingTrend}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" />
        <YAxis 
          stroke="#6b7280"
          formatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: "#10b981", r: 4 }}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}
            {/* Recommendations */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personalized Recommendations
              </h2>
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-4 border flex gap-4 ${
                    rec.type === "success"
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                      : rec.type === "warning"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
                      : rec.type === "alert"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                      : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                  }`}
                >
                  <div className="flex-shrink-0 pt-1">
                    {rec.type === "success" ? (
                      <CheckCircle
                        className="text-green-600 dark:text-green-400"
                        size={20}
                      />
                    ) : rec.type === "alert" ? (
                      <AlertCircle
                        className="text-red-600 dark:text-red-400"
                        size={20}
                      />
                    ) : (
                      <TrendingUp
                        className="text-yellow-600 dark:text-yellow-400"
                        size={20}
                      />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${
                        rec.type === "success"
                          ? "text-green-900 dark:text-green-100"
                          : rec.type === "warning"
                          ? "text-yellow-900 dark:text-yellow-100"
                          : rec.type === "alert"
                          ? "text-red-900 dark:text-red-100"
                          : "text-blue-900 dark:text-blue-100"
                      }`}
                    >
                      {rec.title}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        rec.type === "success"
                          ? "text-green-800 dark:text-green-200"
                          : rec.type === "warning"
                          ? "text-yellow-800 dark:text-yellow-200"
                          : rec.type === "alert"
                          ? "text-red-800 dark:text-red-200"
                          : "text-blue-800 dark:text-blue-200"
                      }`}
                    >
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {expenses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">
                  Add expenses to get your health score calculated!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}