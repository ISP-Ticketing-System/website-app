"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/category/data-table";
import { createColumns } from "@/components/category/columns";
import { useCategoryContext } from "@/context/category-context";
import { Category } from "@/db/schema/category_collection";
import { UpdateCategoryModal } from "./update-category-modal";
import { CreateCategoryModal } from "./create-category-modal";

export default function CategoryContentPage() {
  const { categories, isLoading, fetchCategory } = useCategoryContext();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setUpdateModalOpen(true);
  };

  const handleSuccess = () => {
    // In a real app, you would refetch the data here
    fetchCategory();
    // For now, we'll just close the modals
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedCategory(null);
  };

  const columns = createColumns({ onEdit: handleEdit });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Category</h2>
        <Button asChild>
          <Button onClick={() => setCreateModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Button>
      </div>
      <div>
        {isLoading ? (
          <p>Loading Category data...</p>
        ) : (
          <>
            <DataTable columns={columns} data={categories} />

            <CreateCategoryModal
              open={createModalOpen}
              onOpenChange={setCreateModalOpen}
              onSuccess={handleSuccess}
            />

            <UpdateCategoryModal
              open={updateModalOpen}
              onOpenChange={setUpdateModalOpen}
              onSuccess={handleSuccess}
              category={selectedCategory}
            />
          </>
        )}
      </div>
    </div>
  );
}
