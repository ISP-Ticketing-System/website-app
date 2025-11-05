"use client";
import { useState } from "react";
import { Logo } from "../logo";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import ListNews from "./list-news";

export default function MobilNewsSection() {
  const [showNews, setShowNews] = useState(false);

  return (
    <div className="lg:hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Logo className="h-8 w-auto" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Latest Updates
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNews(!showNews)}
            className="text-gray-700 dark:text-gray-300"
          >
            {showNews ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {showNews && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <ListNews />
          </div>
        )}
      </div>
    </div>
  );
}
