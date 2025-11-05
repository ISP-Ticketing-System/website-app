"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Service } from "@/db/schema/service_collection";
import { getAllData } from "@/action";

type ServiceContextType = {
  services: Service[];
  allServices: Service[]; // backup data services
  activeTab: string;
  isLoading: boolean;
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchServices: () => Promise<void>;
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [activeTab, setActiveTab] = useState("Available");
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = async () => {
    try {
      // setIsLoading(true);
      const data = await getAllData("/services");
      setServices(data);
      setAllServices(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        services,
        allServices,
        activeTab,
        isLoading,
        setServices,
        setActiveTab,
        setIsLoading,
        fetchServices,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServiceContext must be used within a ServiceProvider");
  }
  return context;
};
