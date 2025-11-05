"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllData } from "@/action";
import { SLA } from "@/db/schema/sla_collection";

type SLAContextType = {
  sla: SLA[];
  allSLA: SLA[]; // backup data sla
  activeTab: string;
  isLoading: boolean;
  setSLA: React.Dispatch<React.SetStateAction<SLA[]>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchSLA: () => Promise<void>;
};

const SLAContext = createContext<SLAContextType | undefined>(undefined);

export const SLAProvider = ({ children }: { children: React.ReactNode }) => {
  const [sla, setSLA] = useState<SLA[]>([]);
  const [allSLA, setAllSLA] = useState<SLA[]>([]);
  const [activeTab, setActiveTab] = useState("Available");
  const [isLoading, setIsLoading] = useState(true);

  const fetchSLA = async () => {
    try {
      // setIsLoading(true);
      const data = await getAllData("/sla");
      setSLA(data);
      setAllSLA(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSLA();
  }, []);

  return (
    <SLAContext.Provider
      value={{
        sla,
        allSLA,
        activeTab,
        isLoading,
        setSLA,
        setActiveTab,
        setIsLoading,
        fetchSLA,
      }}
    >
      {children}
    </SLAContext.Provider>
  );
};

export const useSLAContext = () => {
  const context = useContext(SLAContext);
  if (!context) {
    throw new Error("useSLAContext must be used within a SLAProvider");
  }
  return context;
};
