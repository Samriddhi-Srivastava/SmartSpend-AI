"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Save, Lock, Bell, Palette, LogOut } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: session?.user?.name || "User",
    email: session?.user?.email || "user@example.com",
    phone: "+91 98765 43210",
    currency: "INR",
  });

  const [notifications, setNotifications] = useState({
    expenseReminders: true,
    budgetAlerts: true,
    weeklyReport: true,
    aiInsights: true,
    settleReminders: true,
    emailUpdates: false,
  });

  const [theme, setTheme] = useState("dark");

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleNotificationChange = (field) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-mist dark:text-slate-100">Settings</h1>
        <p className="text-muted dark:text-slate-400 mt-2">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="glass rounded-xl border border-white/[0.08] dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-mist dark:text-slate-100 mb-4">
          Profile Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted dark:text-slate-400 mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleProfileChange("name", e.target.value)}
              className="w-full bg-white/5 dark:bg-slate-800/50 border border-line dark:border-slate-700 rounded-lg px-3 py-2 text-mist dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sage/50"
            />
          </div>

          <div>
            <label className="block text-sm text-muted dark:text-slate-400 mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              className="w-full bg-white/5 dark:bg-slate-800/50 border border-line dark:border-slate-700 rounded-lg px-3 py-2 text-mist dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sage/50"
            />
          </div>

          <div>
            <label className="block text-sm text-muted dark:text-slate-400 mb-2">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleProfileChange("phone", e.target.value)}
              className="w-full bg-white/5 dark:bg-slate-800/50 border border-line dark:border-slate-700 rounded-lg px-3 py-2 text-mist dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sage/50"
            />
          </div>

          <div>
            <label className="block text-sm text-muted dark:text-slate-400 mb-2">Currency</label>
            <select
              value={profile.currency}
              onChange={(e) => handleProfileChange("currency", e.target.value)}
              className="w-full bg-white/5 dark:bg-slate-800/50 border border-line dark:border-slate-700 rounded-lg px-3 py-2 text-mist dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sage/50"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 bg-sage hover:bg-sage-deep dark:bg-sage/80 dark:hover:bg-sage text-ink font-semibold px-6 py-2 rounded-lg transition"
            >
              <Save size={18} />
              Save Changes
            </button>
            {saved && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sage/20 dark:bg-sage/10 text-sage text-sm">
                ✓ Saved successfully!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass rounded-xl border border-white/[0.08] dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-mist dark:text-slate-100 mb-4 flex items-center gap-2">
          <Bell size={20} className="text-sage" />
          Notifications
        </h2>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => {
            const labels = {
              expenseReminders: "Expense Reminders",
              budgetAlerts: "Budget Alerts",
              weeklyReport: "Weekly Report",
              aiInsights: "AI Insights",
              settleReminders: "Settle Reminders",
              emailUpdates: "Email Updates",
            };

            return (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 dark:hover:bg-slate-800/50 transition">
                <div>
                  <p className="font-medium text-mist dark:text-slate-100">{labels[key]}</p>
                  <p className="text-sm text-muted dark:text-slate-400">
                    {key === "expenseReminders" && "Get reminded when you add expenses"}
                    {key === "budgetAlerts" && "Alerts when you exceed budget"}
                    {key === "weeklyReport" && "Summary of your weekly spending"}
                    {key === "aiInsights" && "AI tips to improve spending"}
                    {key === "settleReminders" && "Reminders to settle group expenses"}
                    {key === "emailUpdates" && "Important account updates via email"}
                  </p>
                </div>

                <label className="relative inline-block w-12 h-6 bg-white/10 dark:bg-slate-700 rounded-full cursor-pointer border border-line dark:border-slate-600">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleNotificationChange(key)}
                    className="sr-only"
                  />
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition ${
                      value ? "bg-sage translate-x-6" : "bg-muted dark:bg-slate-500"
                    }`}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Management */}
      <div className="glass rounded-xl border border-white/[0.08] dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-mist dark:text-slate-100 mb-4">Account</h2>

        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center bg-red-500/10 dark:bg-red-500/5 hover:bg-red-500/20 dark:hover:bg-red-500/10 border border-red-500/30 dark:border-red-500/20 text-red-400 dark:text-red-400 font-semibold px-4 py-3 rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
