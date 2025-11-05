"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllData } from "@/action";
import { News } from "@/db/schema/news_collection";

type NewsContextType = {
  news: News[];
  allNews: News[]; // backup data news
  activeTab: string;
  isLoading: boolean;
  setNews: React.Dispatch<React.SetStateAction<News[]>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchNews: () => Promise<void>;
};

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider = ({ children }: { children: React.ReactNode }) => {
  const [news, setNews] = useState<News[]>([]);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [activeTab, setActiveTab] = useState("News");
  const [isLoading, setIsLoading] = useState(true);

  const fetchNews = async () => {
    try {
      // setIsLoading(true);
      const data = await getAllData("/news");
      setNews(data);
      setAllNews(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <NewsContext.Provider
      value={{
        news,
        allNews,
        activeTab,
        isLoading,
        setNews,
        setActiveTab,
        setIsLoading,
        fetchNews,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNewsContext must be used within a NewsProvider");
  }
  return context;
};
