"use client";
import * as Menubar from "@radix-ui/react-menubar";
import { Users } from "lucide-react";
import { useUserContext } from "@/context/user-context";
import clsx from "clsx";
import { useEffect } from "react";

export function FilterBar() {
  const tabs = ["Users", "Active", "Inactive"];

  const { users, setUsers, allUsers, activeTab, setActiveTab } =
    useUserContext();

  useEffect(() => {
    if (activeTab === "Users") {
      // Tampilkan semua user
      setUsers(allUsers);
    } else {
      // Filter berdasarkan status
      const filtered = allUsers.filter((user) => user.status === activeTab);
      setUsers(filtered);
    }
  }, [activeTab, allUsers]);

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
            {tab === "Users" && <Users size={18} />}
            {tab}
          </Menubar.Trigger>
        </Menubar.Menu>
      ))}
    </Menubar.Root>
  );
}
