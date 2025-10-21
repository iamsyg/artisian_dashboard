"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";


interface ProfileAvatarProps {
  imageUrl?: string;
  size?: number;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUrl = "/mortydefault.jpg",
  size = 35,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full border border-gray-300 hover:ring-2 hover:ring-blue-500 transition-all"
        style={{ width: size, height: size, overflow: "hidden" }}
      >
        <Image
          src={imageUrl}
          alt="Profile"
          width={size}
          height={size}
          className="object-cover rounded-full"
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 shadow-md rounded-md border border-gray-200 dark:border-gray-700 animate-fadeIn"
        >
          <button
            onClick={() => {
              router.push("/protected/profile");
              setOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
