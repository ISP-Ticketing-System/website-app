"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllData } from "@/action";
import { Category } from "@/db/schema/category_collection";

type CategoryContextType = {
  categories: Category[];
  allCategory: Category[]; // backup data categories
  activeTab: string;
  isLoading: boolean;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchCategory: () => Promise<void>;
};

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategory, setAllCategory] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState("Available");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategory = async () => {
    try {
      // setIsLoading(true);
      const data = await getAllData("/categories");
      setCategories(data);
      setAllCategory(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        allCategory,
        activeTab,
        isLoading,
        setCategories,
        setActiveTab,
        setIsLoading,
        fetchCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider"
    );
  }
  return context;
};
