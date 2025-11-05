"use client";

import NewsContextPage from "@/components/news/news-content-page";
import { NewsProvider } from "@/context/news-context";

export default function CategoryPage() {
  return (
    <NewsProvider>
      <NewsContextPage />
    </NewsProvider>
  );
}
