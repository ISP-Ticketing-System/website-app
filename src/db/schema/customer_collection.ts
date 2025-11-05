import { WithId } from "mongodb";
import { z } from "zod";

const validStatus = ["Active", "Inactive"] as const;
const validContract = ["12 Bulan", "6 Bulan", "3 Bulan", "Tidak ada"] as const;

export const CustomerSchema = z
  .object({
    customerType: z
      .string()
      .min(1, { message: "Customer type must be at least 1 characters" }),
    cid: z.string().optional(),
    count: z.number().optional(),
    firstName: z
      .string()
      .min(3, { message: "First name must be at least 3 characters long" }),
    lastName: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z
      .string()
      .min(12, { message: "Phone number must be at least 12 characters long" }),
    idType: z.string().optional(),
    idNumber: z.string().optional(),
    streetAddress: z.string().min(1, { message: "Street address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    province: z.string().min(1, { message: "Province is required" }),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    serviceId: z.string().min(1, { message: "Service is required" }),
    // installationDate: z.preprocess((val) => {
    //   if (typeof val === "string") {
    //     const [year, month, day] = val.split("T")[0].split("-");

    //     return new Date(Number(year), Number(month) - 1, Number(day));
    //   }
    //   return val;
    // }, z.date()),
    installationDate: z.preprocess(
      (val) => {
        if (typeof val === "string" || typeof val === "number") {
          return new Date(val);
        }
        return val;
      },
      z.date({
        required_error: "Installation date is required",
      })
    ),
    contractLength: z.enum(validContract, {
      required_error: "Contract length is required",
      invalid_type_error: "Contract length harus berupa string",
    }),
    setupFee: z
      .string()
      .min(1, { message: "Setup fee is required" })
      .refine((val) => Number(val) >= 1000, {
        message: "Minimum setup fee is 0",
      }),
    note: z.string().optional(),
    status: z.enum(validStatus, {
      required_error: "Status is required",
      invalid_type_error: "Status harus berupa string",
    }),
    companyName: z.string().optional(),
    npwp: z.string().optional(),
    vlan: z.string().optional(),
    nib: z.string().optional(),
    site: z.string().optional(),
    deviceSN: z.string().optional(),
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

export type CustomerInput = z.input<typeof CustomerSchema>; // input: data sebelum transform
export type CustomerOutput = z.infer<typeof CustomerSchema>; // output: hasil setelah transform

type Service = {
  name: string;
};

export type Customer = WithId<CustomerOutput> & {
  serviceData: Service;
};
