"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import UploadPicture from "@/components/ui/uploadPicture";
import AudioDescriptionRecorder from "@/components/ui/audioDescriptionRecorder"; 
import Image from "next/image";

export default function ProfilePage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    display_name: "",
    profile_picture: "",
    description: "",
    location: "",
    language: "",
  });

  // Fetch current seller profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error(userError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("sellers")
        .select("display_name, profile_picture, description, location, language")
        .eq("user_id", user.id)
        .single();

      if (error) console.error(error);
      else setProfile(data || {});

      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save updates
  const handleSave = async () => {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("sellers")
      .update({
        display_name: profile.display_name,
        profile_picture: profile.profile_picture,
        description: profile.description,
        location: profile.location,
        language: profile.language,
      })
      .eq("user_id", user?.id);

    if (error) alert("Error updating profile: " + error.message);
    else alert("Profile updated successfully!");

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>

        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <Image
            src={profile.profile_picture || "/mortydefault.png"}
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full object-cover border border-gray-300"
          />
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-800 dark:text-gray-200">
              Profile Picture
            </label>
            <UploadPicture
              onFileSelect={(file) => {
                if (file) {
                  const url = URL.createObjectURL(file);
                  setProfile((prev) => ({ ...prev, profile_picture: url }));
                } else {
                  setProfile((prev) => ({ ...prev, profile_picture: "" }));
                }
              }}
            />
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input
            type="text"
            name="display_name"
            value={profile.display_name || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium mb-1">Description</label>

          {/* Audio + Manual Description Component */}
          <AudioDescriptionRecorder
            // Optional: you can provide initial value or a callback if needed
            // onChange={(value) => setProfile({ ...profile, description: value })}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={profile.location || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select
            name="language"
            value={profile.language || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-100"
          >
            <option value="">Select your language</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Bengali">Bengali</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
