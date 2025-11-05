"use client";
import * as Menubar from "@radix-ui/react-menubar";
import { Users } from "lucide-react";
import clsx from "clsx";
import { useEffect } from "react";
import { useCustomerContext } from "@/context/customer-context";

export function FilterBar() {
  const tabs = ["Customers", "Active", "Inactive"];

  const { setCustomers, allCustomers, activeTab, setActiveTab } =
    useCustomerContext();

  useEffect(() => {
    if (activeTab === "Customers") {
      // Tampilkan semua user
      setCustomers(allCustomers);
    } else {
      // Filter berdasarkan status
      const filtered = allCustomers.filter(
        (customer) => customer.status === activeTab
      );
      setCustomers(filtered);
    }
  }, [activeTab, allCustomers]);

  return (
    <Menubar.Root className="inline-flex gap-2 p-1 mb-4">
      {tabs.map((tab) => (
        <Menubar.Menu key={tab}>
          <Menubar.Trigger
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm",
              activeTab === tab
                ? "bg-green-800 text-white"
                : "bg-green-100 text-green-900 hover:bg-green-200"
            )}
          >
            {tab === "Customers" && <Users size={18} />}
            {tab}
          </Menubar.Trigger>
        </Menubar.Menu>
      ))}
    </Menubar.Root>
  );
}
