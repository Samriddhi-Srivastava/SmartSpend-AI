"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Bell, X } from "lucide-react";
import {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
} from "@/lib/notifications";

export default function NotificationDropdown() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Load notifications on mount
  useEffect(() => {
    if (session?.user?.email) {
      loadNotifications();
    }
  }, [session?.user?.email]);

  // Poll for new notifications every 5 seconds
  useEffect(() => {
    if (!session?.user?.email) return;

    const interval = setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [session?.user?.email]);

  // Refresh when dropdown opens
  useEffect(() => {
    if (isOpen && session?.user?.email) {
      loadNotifications();
    }
  }, [isOpen, session?.user?.email]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    if (!session?.user?.email) return;
    try {
      setIsLoading(true);
      const data = await getAllNotifications(session.user.email);
      setNotifications(data);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(session.user.email);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "expense_added":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "budget_alert":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "expense_added":
        return "💰";
      case "budget_alert":
        return "⚠️";
      default:
        return "📢";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/5 dark:hover:bg-slate-700 rounded-lg transition"
      >
        <Bell size={20} className="text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[500px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-green-600 dark:text-green-400 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No notifications yet
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-l-4 ${
                      notif.is_read
                        ? "border-gray-300 dark:border-gray-600 opacity-60"
                        : "border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-900/10"
                    } ${getNotificationColor(notif.type)} cursor-pointer hover:bg-opacity-75 dark:hover:bg-opacity-50 transition`}
                    onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                  >
                    <div className="flex gap-3">
                      <span className="text-lg">
                        {getNotificationIcon(notif.type)}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {notif.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {new Date(notif.created_at).toLocaleString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
