"use client";

import { useState, useEffect, useRef } from "react";
import { X, Camera, Loader2 } from "lucide-react";
import { getProfile, upsertProfile, uploadProfilePicture } from "@/lib/profile";
import Image from "next/image";

export default function ProfileModal({ isOpen, onClose, session }) {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    dob: "",
    gender: "",
    profile_picture_url: "",
  });

  useEffect(() => {
    if (!isOpen || !session?.user?.email) return;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await getProfile(session.user.email);
        setFormData({
          full_name: profile?.full_name || session.user.name || "",
          phone: profile?.phone || "",
          dob: profile?.dob || "",
          gender: profile?.gender || "",
          profile_picture_url:
            profile?.profile_picture_url || session.user.image || "",
        });
        setError(null);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isOpen, session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePictureSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      const url = await uploadProfilePicture(session.user.email, file);
      setFormData((prev) => ({ ...prev, profile_picture_url: url }));
    } catch (err) {
      console.error("Error uploading picture:", err);
      setError("Failed to upload picture. Try a smaller image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      await upsertProfile(session.user.email, formData);
      setSuccessMsg("Profile updated!");
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
            Your Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={22} />
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-300 text-center py-8">
            Loading profile...
          </p>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Profile Picture */}
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {formData.profile_picture_url ? (
                    <Image
                      src={formData.profile_picture_url}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-500 dark:text-gray-300">
                      {formData.full_name?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 shadow-md disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Camera size={16} />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePictureSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Error / Success */}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            )}
            {successMsg && (
              <p className="text-sm text-green-600 dark:text-green-400 text-center">
                {successMsg}
              </p>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Email (read-only, from Google) */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={session?.user?.email || ""}
                disabled
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
