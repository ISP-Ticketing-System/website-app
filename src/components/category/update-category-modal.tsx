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
import { Category } from "@/db/schema/category_collection";
import { CategoryForm, CategoryFormValues } from "../forms/category-form";

interface UpdateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  category: Category | null;
}

export function UpdateCategoryModal({
  open,
  onOpenChange,
  onSuccess,
  category,
}: UpdateCategoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (input: CategoryFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      const response = await fetch(`/api/categories/${category?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw await response.json();
      }

      let user = await response.json();

      toast.success(user.message);

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error((error as CustomError).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>
            Update the Service Level Agreement details.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          initialData={{
            category: category.category,
            times: category.times,
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEdit={true}
        />
      </DialogContent>
    </Dialog>
  );
}
