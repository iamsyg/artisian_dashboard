"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface ProfileContextType {
  profilePicture: string | null;
  setProfilePicture: (url: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profilePicture: null,
  setProfilePicture: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // load profile on mount
  useEffect(() => {
    const fetchProfilePicture = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("sellers")
        .select("profile_picture")
        .eq("user_id", user.id)
        .single();

      if (!error && data?.profile_picture) {
        setProfilePicture(data.profile_picture);
      }
    };

    fetchProfilePicture();
  }, []);

  return (
    <ProfileContext.Provider value={{ profilePicture, setProfilePicture }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Hook for easy consumption
export const useProfile = () => useContext(ProfileContext);

