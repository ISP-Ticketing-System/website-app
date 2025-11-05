"use client";
import * as Menubar from "@radix-ui/react-menubar";
import { Wifi } from "lucide-react";
import clsx from "clsx";
import { useEffect } from "react";
import { useServiceContext } from "@/context/service-context";

export function FilterBar() {
  const tabs = ["Services", "Available", "Unavailable"];

  const { services, setServices, allServices, activeTab, setActiveTab } =
    useServiceContext();

  useEffect(() => {
    if (activeTab === "Services") {
      // Tampilkan semua services
      setServices(allServices);
    } else {
      // Filter berdasarkan status
      const filtered = allServices.filter(
        (service) => service.status === activeTab
      );
      setServices(filtered);
    }
  }, [activeTab, allServices]);

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
            {tab === "Services" && <Wifi size={18} />}
            {tab}
          </Menubar.Trigger>
        </Menubar.Menu>
      ))}
    </Menubar.Root>
  );
}
