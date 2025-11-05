"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllData } from "@/action";
import { Ticket } from "@/db/schema/ticket_collection";

type TicketContextType = {
  tickets: Ticket[];
  allTickets: Ticket[]; // backup data tickets
  activeTab: string;
  isLoading: boolean;
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchTickets: () => Promise<void>;
};

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: React.ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [allTickets, setallTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState("Tickets");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const data = await getAllData("/tickets");
      setTickets(data);
      setallTickets(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        allTickets,
        activeTab,
        isLoading,
        setTickets,
        setActiveTab,
        setIsLoading,
        fetchTickets,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTicketContext = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTicketContext must be used within a TicketProvider");
  }
  return context;
};
