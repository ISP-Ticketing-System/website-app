"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewsForm } from "../forms/news-form";
import { News } from "@/db/schema/news_collection";
import toast from "react-hot-toast";

interface UpdateNewsModalProps {
  news: News;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UpdateNewsModal({
  news,
  open,
  onOpenChange,
  onSuccess,
}: UpdateNewsModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: { title: string; content: string }) => {
    setIsLoading(true);
    try {
      // Simulate API call
      const response = await fetch(`/api/news/${news?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await response.json();
      }
      let result = await response.json();

      toast.success(result.message);

      onSuccess();

      onOpenChange(false);
    } catch (error) {
      toast("Failed to update news article.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update News Article</DialogTitle>
          <DialogDescription>
            Update the news article information.
          </DialogDescription>
        </DialogHeader>
        <NewsForm
          initialData={news}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
