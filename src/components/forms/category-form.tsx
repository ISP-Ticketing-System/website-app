"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  category: z.string().min(1, "Category is required"),
  times: z.string().min(1, "Response time must be at least 1 minutes"),
});

export type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData?: {
    category: string;
    times: string;
  };
  onSubmit: (data: CategoryFormValues) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function CategoryForm({
  initialData,
  onSubmit,
  isLoading,
  isEdit = false,
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: initialData?.category || "",
      times: initialData?.times || "1",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="times"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Response Time (Minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter response time in minutes"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Category"}
        </Button>
      </form>
    </Form>
  );
}
