"use client";
import * as Menubar from "@radix-ui/react-menubar";
import { Ticket } from "lucide-react";
import clsx from "clsx";
import { useEffect } from "react";
import { useTicketContext } from "@/context/ticket-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

export function FilterBar() {
  const tabs = [
    "Tickets",
    "In Progress",
    "Escalated",
    "Done",
    "All Ticket Today",
  ];

  const { setTickets, allTickets, activeTab, setActiveTab } =
    useTicketContext();

  useEffect(() => {
    if (activeTab === "Tickets") {
      setTickets(allTickets);
    } else if (activeTab === "All Ticket Today") {
      const filtered = allTickets.filter((ticket) => {
        return (
          new Date(ticket.createdAt).toDateString() ===
          new Date().toDateString()
        );
      });
      setTickets(filtered);
    } else {
      const filtered = allTickets.filter((ticket) => {
        return ticket.status === activeTab;
      });
      setTickets(filtered);
    }
  }, [activeTab, allTickets]);

  return (
    <div className="inline-flex rounded-md bg-green-100 text-green-900 p-1.5 mb-5">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={clsx(
            "px-5 py-2 rounded-md font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2",
            activeTab === tab
              ? "bg-green-800 text-white"
              : "bg-green-100 text-green-900 hover:bg-green-200"
          )}
        >
          {tab === "Tickets" && <Ticket size={18} />}
          {tab}
        </button>
      ))}
    </div>
  );
}
