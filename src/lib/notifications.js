import { supabase } from "./supabase";

export async function createInAppNotification(userId, { type, title, message }) {
  const { data, error } = await supabase
    .from("in_app_notifications")
    .insert([
      {
        user_id: userId,
        type,
        title,
        message,
        is_read: false,
      },
    ])
    .select();

  if (error) throw error;
  return data?.[0];
}

export async function getUnreadNotifications(userId) {
  const { data, error } = await supabase
    .from("in_app_notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data || [];
}

export async function getAllNotifications(userId, limit = 20) {
  const { data, error } = await supabase
    .from("in_app_notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function markAsRead(notificationId) {
  const { error } = await supabase
    .from("in_app_notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) throw error;
}

export async function markAllAsRead(userId) {
  const { error } = await supabase
    .from("in_app_notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) throw error;
}