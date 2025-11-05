import { WithId } from "mongodb";
import { z } from "zod";

const validStatus = ["Available", "Unavailable"] as const;

export const ServiceSchema = z
  .object({
    serviceName: z
      .string()
      .min(3, { message: "Service name must be at least 3 characters long" }),
    monthlyPrice: z
      .string()
      .min(1, { message: "Monthly price is required" })
      .refine((val) => Number(val) >= 1000, {
        message: "Minimum monthly price is 1000",
      }),

    // setupFee: z
    //   .string()
    //   .min(1, { message: "Setup fee is required" })
    //   .refine((val) => Number(val) >= 1000, {
    //     message: "Minimum setup fee is 0",
    //   }),

    slug: z.string().optional(),
    planDescription: z.string(),
    status: z.enum(validStatus, {
      required_error: "status is required",
      invalid_type_error: "status harus berupa string",
    }),
    isDeleted: z.boolean().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    deletedAt: z.date().nullable().optional(),
  })
  .transform((data) => ({
    ...data,
    isDeleted: data.isDeleted ?? false,
    createdAt: data.createdAt ?? new Date(),
    updatedAt: data.updatedAt ?? new Date(),
    deletedAt: data.deletedAt ?? null,
  }));

export type ServiceInput = z.input<typeof ServiceSchema>; // input: data sebelum transform
export type ServiceOutput = z.infer<typeof ServiceSchema>; // output: hasil setelah transform

export type Service = WithId<ServiceOutput>;
