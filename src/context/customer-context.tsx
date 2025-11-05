"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllData } from "@/action";
import { Customer } from "@/db/schema/customer_collection";

type CustomerContextType = {
  customers: Customer[];
  allCustomers: Customer[]; // backup data customers
  activeTab: string;
  isLoading: boolean;
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchCustomers: () => Promise<void>;
};

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined
);

export const CustomerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState("Active");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      // setIsLoading(true);
      const data = await getAllData("/customers");
      setCustomers(data);
      setAllCustomers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        allCustomers,
        activeTab,
        isLoading,
        setCustomers,
        setActiveTab,
        setIsLoading,
        fetchCustomers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error(
      "useCustomerContext must be used within a CustomerProvider"
    );
  }
  return context;
};
