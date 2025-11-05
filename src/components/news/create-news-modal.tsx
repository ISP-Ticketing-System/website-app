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
import toast from "react-hot-toast";
import { CustomError } from "@/type";

interface CreateNewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateNewsModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateNewsModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: { title: string; content: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await response.json();
      }
      let news = await response.json();

      toast.success(news.message);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error((error as CustomError).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create News Article</DialogTitle>
          <DialogDescription>
            Create a new news article to share with users on the login page.
          </DialogDescription>
        </DialogHeader>
        <NewsForm onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
