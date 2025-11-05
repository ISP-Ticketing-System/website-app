import { z } from "zod";
import { WithId } from "mongodb";

export const NewsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
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

export type NewsInput = z.infer<typeof NewsSchema>;
export type News = WithId<NewsInput>;
