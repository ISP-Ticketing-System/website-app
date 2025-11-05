"use client";

import CategoryContentPage from "@/components/category/category-content-page";
import { CategoryProvider } from "@/context/category-context";

export default function CategoryPage() {
  return (
    <CategoryProvider>
      <CategoryContentPage />
    </CategoryProvider>
  );
}
