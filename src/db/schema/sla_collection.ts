import { z } from "zod";
import { WithId } from "mongodb";

export const validRoles = [
  "CS FTTH",
  "Helpdesk",
  "NOC",
  "Super NOC",
  "Admin",
] as const;

export const SLASchema = z.object({
  role: z.enum(validRoles),
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

export type SLAInput = z.infer<typeof SLASchema>;
export type SLA = WithId<SLAInput>;
