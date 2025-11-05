"use client";
import * as Menubar from "@radix-ui/react-menubar";
import { NewspaperIcon } from "lucide-react";
import clsx from "clsx";
import { useEffect } from "react";
import { useNewsContext } from "@/context/news-context";

export function FilterBar() {
  const tabs = ["News", "Archive"];

  const { setNews, allNews, activeTab, setActiveTab } = useNewsContext();

  useEffect(() => {
    let isDeleted = activeTab === "News" ? false : true;

    const filtered = allNews.filter((data) => data.isDeleted === isDeleted);
    setNews(filtered);
  }, [activeTab, allNews]);

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
            {tab === "News" && <NewspaperIcon size={18} />}
            {tab}
          </Menubar.Trigger>
        </Menubar.Menu>
      ))}
    </Menubar.Root>
  );
}
