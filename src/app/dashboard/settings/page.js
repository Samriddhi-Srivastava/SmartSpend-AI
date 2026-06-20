"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Save, Bell, LogOut, Loader2 } from "lucide-react";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  updateCurrency,
} from "@/lib/profile";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const [currency, setCurrency] = useState("INR");
  const [notifications, setNotifications] = useState({
    expenseReminders: true,
    budgetAlerts: true,
    weeklyReport: true,
    aiInsights: true,
    settleReminders: true,
    emailUpdates: false,
  });

  useEffect(() => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }
    loadSettings();
  }, [session?.user?.email]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const prefs = await getNotificationPreferences(session.user.email);
      setNotifications(prefs);
      setError(null);
    } catch (err) {
      console.error("Error loading settings:", err);
      setError("Failed to load settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (field) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }));
    setSaved(false);
  };

  const handleSaveNotifications = async () => {
    try {
      setIsSaving(true);
      await updateNotificationPreferences(session.user.email, notifications);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setError(null);
    } catch (err) {
      console.error("Error saving notifications:", err);
      setError("Failed to save notification preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCurrency = async () => {
    try {
      setIsSaving(true);
      await updateCurrency(session.user.email, currency);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setError(null);
    } catch (err) {
      console.error("Error saving currency:", err);
      setError("Failed to save currency preference.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <p className="text-gray-600 dark:text-gray-300">Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-2xl">
      {/* Header */}
      <div>
         <h1 className="text-4xl font-boldtext-ink dark:text-slate-100  font-display">
          Settings
        </h1>
        <p className="text-muted dark:text-slate-400 mt-2">
          Manage your account preferences
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-sm font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Currency Preference */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Preferences
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                setSaved(false);
              }}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSaveCurrency}
              disabled={isSaving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save
            </button>
            {saved && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium">
                ✓ Saved
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Bell size={20} className="text-green-600 dark:text-green-400" />
          Email Notifications
        </h2>

        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading preferences...</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {Object.entries(notifications).map(([key, value]) => {
                const labels = {
                  expenseReminders: "Expense Reminders",
                  budgetAlerts: "Budget Alerts",
                  weeklyReport: "Weekly Report",
                  aiInsights: "AI Insights",
                  settleReminders: "Settle Reminders",
                  emailUpdates: "Email Updates",
                };

                const descriptions = {
                  expenseReminders: "Get a confirmation when you log an expense",
                  budgetAlerts: "Alerts when you spend 80%+ of a budget",
                  weeklyReport: "Summary of your weekly spending (Monday 9am)",
                  aiInsights: "AI tips to improve your financial health",
                  settleReminders: "Reminders to settle group expenses",
                  emailUpdates: "Important account updates and announcements",
                };

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {labels[key]}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {descriptions[key]}
                      </p>
                    </div>

                    <label className="relative inline-block w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleNotificationChange(key)}
                        className="sr-only"
                      />
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition ${
                          value
                            ? "bg-green-600 translate-x-6"
                            : "bg-gray-500"
                        }`}
                      />
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveNotifications}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </button>
              {saved && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium">
                  ✓ Saved
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Account Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account</h2>

        <div className="space-y-3">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Logged in as <span className="font-semibold">{session?.user?.email}</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center bg-red-500/10 dark:bg-red-500/5 hover:bg-red-500/20 dark:hover:bg-red-500/10 border border-red-500/30 dark:border-red-500/20 text-red-600 dark:text-red-400 font-semibold px-4 py-3 rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}