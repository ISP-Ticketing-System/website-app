import { WithId } from "mongodb";
import { z } from "zod";

const SlaHistorySchema = z.object({
  level: z.number(),
  handlerRole: z.string(),
  assignedAt: z.coerce.date(),
  startedAt: z.coerce.date().nullable(),
  endedAt: z.coerce.date().nullable(),
  durationMinutes: z.number(),
  isBreached: z.boolean(),
  isPaused: z.boolean(),
  closedBy: z.string().nullable(), // ObjectId sebagai string
});

const LogSchema = z.object({
  date: z.coerce.date(),
  handleBy: z.string(),
  handleByUsername: z.string().nullable().optional(),
  handleByRole: z.string().nullable().optional(),
  assignedRole: z.string().optional(),
  status: z.string(),
  slaStatus: z.enum(["green", "red"]).optional(),
  note: z.string(),
});

// schema db
export const TicketSchema = z
  .object({
    code: z.string(), //
    // subject: z.string(), //
    description: z.string(), //
    categoryId: z.string(), //
    ticketCategory: z.string(),
    customerId: z.string(), //
    createdBy: z.string(), //
    createdAt: z.coerce.date().optional(), //
    updatedAt: z.coerce.date().optional(), //
    isDeleted: z.boolean().optional().optional(), //
    deletedAt: z.coerce.date().nullable().optional(), //

    status: z.string(), //
    currentHandlerId: z.string(),

    escalationRequired: z.boolean(), //
    escalationLevel: z.number(), //

    slaHistory: z.array(SlaHistorySchema),
    logs: z.array(LogSchema),
  })
  .transform((data) => ({
    ...data,
    isDeleted: data.isDeleted ?? false,
    createdAt: data.createdAt ?? new Date(),
    updatedAt: data.updatedAt ?? new Date(),
    deletedAt: data.deletedAt ?? null,
  }));

export type TicketInput = z.input<typeof TicketSchema>; // input: data sebelum transform
export type TicketOutput = z.infer<typeof TicketSchema>; // output: hasil setelah transform

type CustomerData = {
  firstName: string;
  lastName: string;
  idType: string;
  idNumber: string;
  cid: string;
};

type CurrentHandleUserData = {
  username: string;
  role: string;
};

export type Ticket = WithId<TicketOutput> & {
  customerData: CustomerData;
} & {
  currentHandleUserData: CurrentHandleUserData;
};

// schema form
export const FormCreateSchema = z.object({
  customerId: z.string().min(1, { message: "Customer is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  escalationRequired: z.boolean(),
  // subject: z.string().min(1, { message: "Subject is required" }),
  description: z.string().min(1, { message: "description is required" }),
});

export type formCreateValue = z.infer<typeof FormCreateSchema>;

export type Log = z.infer<typeof LogSchema>;
export type Sla = z.infer<typeof SlaHistorySchema>;
