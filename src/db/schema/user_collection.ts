import { WithId } from "mongodb"; // Tipe helper dari MongoDB yang menambahkan field _id ke sebuah objek
import { z } from "zod"; // Library untuk validasi dan parsing schema

const validRoles = [
  "CS FTTH",
  "Helpdesk",
  "NOC",
  "Super NOC",
  "Admin",
] as const;

const validGender = ["Male", "Female"] as const;
const validStatus = ["Active", "Inactive"] as const;

export const UserSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  role: z.enum(validRoles, {
    required_error: "Role is required",
    invalid_type_error: "Role harus berupa string",
  }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z
    .enum(validGender, {
      required_error: "Gender is required",
      invalid_type_error: "Gender harus berupa string",
    })
    .optional(),
  status: z
    .enum(validStatus, {
      required_error: "Status is required",
      invalid_type_error: "Status harus berupa string",
    })
    .default("Active")
    .optional(),
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

export type UserForm = z.infer<typeof UserSchema>;
export type User = WithId<UserForm>;
