"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/db/schema/user_collection";
import { getAllData } from "@/action";

type profileContextType = {
  profile: User | null;
  isLoading: boolean;
  setProfile: React.Dispatch<React.SetStateAction<User | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchProfile: () => Promise<void>;
};

const ProfileContext = createContext<profileContextType | undefined>(undefined);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await getAllData("/profile");
      setProfile(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        setProfile,
        setIsLoading,
        fetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};
