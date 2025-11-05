"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { CustomError } from "@/type";
import { CategoryForm, CategoryFormValues } from "../forms/category-form";

interface CreateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCategoryModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateCategoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await response.json();
      }

      let category = await response.json();

      toast.success(category.message);

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Add a new Category with Service Level Agreement and response time.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
