"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { News } from "@/db/schema/news_collection";
import { CustomError } from "@/type";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ListNews() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>();

  const formatDate = (date: Date) => {
    const currentDate = new Date(date); // atau new Date() jika ingin sekarang

    const formatted = currentDate.toLocaleString("en-US", {
      month: "short", // Jan, Feb, dst.
      day: "2-digit", // 01 - 31
      year: "numeric", // 2024
      hour: "2-digit", // 01 - 12
      minute: "2-digit", // 00 - 59
      hour12: true, // pakai AM/PM
    });

    return formatted;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/news", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw await response.json();
      }

      const data = await response.json();

      const filtered = data.filter((el: News) => el.isDeleted === false);

      setNews(filtered);
    } catch (error) {
      toast.error((error as CustomError).message);
    } finally {
      setIsLoading(false);
    }
  };

  const viewDetailNews = (news: News | null, isOpen: boolean) => {
    setSelectedNews(news);
    setShowModal(isOpen);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
        </div>
      )}

      {news.length === 0 && !isLoading && (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-muted-foreground">No news at the moment </p>
        </div>
      )}

      {news.length !== 0 &&
        !isLoading &&
        news.map((item, index) => (
          <div key={index}>
            <Card
              key={index}
              className="border-0 shadow-sm bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900 dark:text-white leading-tight">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <div className="relative">
                    <p className="line-clamp-2 pr-20">
                      {item.content.replace(/<[^>]*>/g, "")}
                    </p>
                    <button
                      className="absolute right-0 bottom-0 text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors duration-150"
                      onClick={() => viewDetailNews(item, true)}
                    >
                      Selengkapnya
                    </button>
                  </div>
                </CardDescription>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={
                          "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
                        }
                        alt={item.author}
                      />
                      <AvatarFallback className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300">
                        {getInitials(item.author)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {item.author}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(item.createdAt)}
                  </span>
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
          </div>
        ))}
    </>
  );
}
