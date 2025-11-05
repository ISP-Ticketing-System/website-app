"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/db/schema/user_collection";
import { getAllData } from "@/action";

type UserContextType = {
  users: User[];
  allUsers: User[]; // backup data users
  activeTab: string;
  isLoading: boolean;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUsers: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("Active");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      // setIsLoading(true);
      const data = await getAllData("/users");
      setUsers(data);
      setAllUsers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        allUsers,
        activeTab,
        isLoading,
        setUsers,
        setActiveTab,
        setIsLoading,
        fetchUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
