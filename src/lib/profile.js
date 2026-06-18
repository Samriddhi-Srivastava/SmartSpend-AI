import { supabase } from "./supabase";

/**
 * Get profile for a user. Returns null if no profile exists yet.
 */
export async function getProfile(userId) {
  if (!userId) throw new Error("User ID is required");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Create or update a profile (upsert based on user_id).
 */
export async function upsertProfile(userId, profileData) {
  if (!userId) throw new Error("User ID is required");

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: userId,
        full_name: profileData.full_name,
        phone: profileData.phone,
        dob: profileData.dob || null,
        gender: profileData.gender,
        profile_picture_url: profileData.profile_picture_url,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select();

  if (error) throw error;
  return data?.[0];
}

/**
 * Upload a profile picture to Supabase Storage and return its public URL.
 */
export async function uploadProfilePicture(userId, file) {
  if (!userId) throw new Error("User ID is required");
  if (!file) throw new Error("File is required");

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return data.publicUrl;
}