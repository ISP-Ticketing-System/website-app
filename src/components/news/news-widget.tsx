"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Loader2, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { useNewsContext } from "@/context/news-context";
import { News } from "@/db/schema/news_collection";
import { useState } from "react";

export function NewsWidget() {
  const { news: recentNews, isLoading } = useNewsContext();

  const [showModal, setShowModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>();

  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const getInitials = (name: string) => {
    return name[0].toUpperCase();
  };

  const viewDetailNews = (news: News | null, isOpen: boolean) => {
    setSelectedNews(news);
    setShowModal(isOpen);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Newspaper className="h-5 w-5 text-green-600" />
              Recent News
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {isLoading && (
            <div className="flex justify-center items-center h-full mt-5">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />{" "}
            </div>
          )}

          {recentNews.length === 0 && !isLoading && (
            <p className="text-center py-10 text-muted-foreground">
              No news at the moment{" "}
            </p>
          )}

          <div className="space-y-4 overflow-y-auto max-h-[500px] hide-scrollbar">
            {recentNews &&
              recentNews.map((news: any, index: number) => (
                <div
                  key={news._id.toString()}
                  className={`${
                    index !== recentNews.length - 1
                      ? "border-b border-gray-100 dark:border-gray-700 pb-4"
                      : ""
                  } cursor-pointer`}
                  onClick={() => viewDetailNews(news, true)}
                >
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-tight line-clamp-2">
                      {news.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {stripHtml(news.content).substring(0, 100)}...
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`/avatars/${news._id}.png`} />
                          <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                            {getInitials(news.author)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {news.author}
                        </span>
                      </div>

                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(news.createdAt, "MMM dd yyyy")}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {showModal && selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 backdrop-blur-sm max-w-lg w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900 dark:text-white leading-tight">
                {selectedNews.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <div
                  className="rich-content text-gray-800 dark:text-gray-200 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: selectedNews.content,
                  }}
                />
              </CardDescription>

              <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  className="text-sm text-red-500 hover:text-red-600 hover:underline transition-colors"
                  onClick={() => viewDetailNews(null, false)}
                >
                  Tutup
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
