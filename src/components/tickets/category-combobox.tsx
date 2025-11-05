import { useState } from "react";
import { Controller, Control } from "react-hook-form";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/db/schema/category_collection";

type Props = {
  control: Control<any>;
  categories: Category[] | undefined;
  isEditMode: boolean;
};

export const CategoryCombobox: React.FC<Props> = ({
  control,
  categories,
  isEditMode,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <Controller
      control={control}
      name="categoryId"
      render={({ field }) => {
        const selectedCategory = categories?.find((c) => c._id === field.value);

        return (
          <div className="space-y-1 mt-1">
            <label className="text-sm font-medium">Category</label>
            <Popover.Root open={open} onOpenChange={setOpen}>
              <Popover.Trigger asChild disabled={isEditMode}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm",
                    isEditMode
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : ""
                  )}
                >
                  {selectedCategory
                    ? `${selectedCategory.category}`
                    : "Select a category"}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-50 w-[350px] rounded-md border bg-white p-2 shadow-md"
                  side="bottom"
                  align="start"
                >
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-2 w-full rounded-md border px-2 py-1 text-sm"
                  />

                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {categories?.length === 0 && (
                      <div className="text-sm text-muted-foreground px-2 py-1">
                        No category found.
                      </div>
                    )}

                    {categories?.map((category) => (
                      <button
                        key={category._id.toString()}
                        type="button"
                        onClick={() => {
                          field.onChange(category._id);
                          setOpen(false);
                          setSearch("");
                        }}
                        className="flex w-full items-center justify-between px-2 py-1 text-sm hover:bg-gray-100 rounded-md"
                      >
                        <span>{`${category.category} (${category.times} minutes)`}</span>
                        {field.value === category._id && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        );
      }}
    />
  );
};
