"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import UploadPicture from "@/components/ui/uploadPicture";
import AudioDescriptionRecorder from "@/components/ui/audioDescriptionRecorder";
import { useProfile } from "@/contexts/ProfileContexts";
import Image from "next/image";

export default function ProfilePage() {
  const supabase = createClient();
  const { setProfilePicture } = useProfile();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    display_name: "",
    profile_picture: "",
    description: "",
    location: "",
    language: "",
  });

  // <-- added: hold selected file until save -->
  const [pendingImage, setPendingImage] = useState<File | null>(null);

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

  // <-- added: receive file from UploadPicture -->
  const handleFileSelect = (file: File | null) => {
    setPendingImage(file);
  };

  // Save updates
  const handleSave = async () => {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to update your profile.");
      setSaving(false);
      return;
    }

    // <-- added: upload pending image if present and get public URL -->
    let finalProfilePicture = profile.profile_picture;
    if (pendingImage) {
      const filePath = `users/${user.id}/${Date.now()}-${pendingImage.name}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, pendingImage, { upsert: true });

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        alert("Image upload failed: " + uploadError.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(filePath);

      finalProfilePicture = data.publicUrl;
    }

    const { error } = await supabase
      .from("sellers")
      .update({
        display_name: profile.display_name,
        profile_picture: finalProfilePicture,
        description: profile.description,
        location: profile.location,
        language: profile.language,
      })
      .eq("user_id", user?.id);

    if (error) alert("Error updating profile: " + error.message);
    else {
      alert("Profile updated successfully!");
      // clear pending image and update local state to show new URL immediately
      setPendingImage(null);
      setProfile(prev => ({ ...prev, profile_picture: finalProfilePicture }));

      if (finalProfilePicture) setProfilePicture(finalProfilePicture);
    }

    setSaving(false);
  };

  const handleDelete = async () => {

      const confirmed = window.confirm(
        "Are you sure you want to delete your seller account? This cannot be undone."
      );
      if (!confirmed) return;

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return alert("You must be logged in.");

      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete account");

      alert("✅ Account deleted successfully");
      await supabase.auth.signOut();
      window.location.reload();
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
        <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0">
          {profile.profile_picture ? (
            <Image
              src={profile.profile_picture}
              alt="Profile Picture"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-700" />
          )}
        </div>

        {/* Upload Section */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-800 dark:text-gray-200">
            Profile Picture
          </label>
          {/* <-- changed: pass onFileSelect handler to UploadPicture --> */}
          <UploadPicture onFileSelect={handleFileSelect} />
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

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium mb-1">Description</label>

          {/* Audio + Manual Description Component */}
          <AudioDescriptionRecorder
            // Optional: you can provide initial value or a callback if needed
            initialDescription={profile.description}
            onChange={(value) => setProfile({ ...profile, description: value })}
          />
        </div>

        {/* Save Button */}
        <div className="flex">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        </div>
        
        <div className="flex">
        <button
          onClick={handleDelete}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
        >
          Delete Account
        </button>
        </div>
      </div>
    </div>
  );
}