import { z } from "zod";
import { WithId } from "mongodb";

export const CategorySchema = z.object({
  category: z.string().min(1, "Category is required"),
  times: z.string().min(1, "Times is required"),
  isDeleted: z.boolean().default(false),
  createdAt: z.preprocess(
    (val) => (val ? new Date(val as string) : new Date()),
    z.date()
  ),
  updatedAt: z.preprocess(
    (val) => (val ? new Date(val as string) : new Date()),
    z.date()
  ),
  deletedAt: z.date().nullable().default(null),
});

export type CategoryInput = z.infer<typeof CategorySchema>;
export type Category = WithId<CategoryInput>;
