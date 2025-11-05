import { CustomError } from "@/type";
import { ZodError } from "zod";

export function customError(error: CustomError | ZodError) {
  let message = error.message;
  let status = 500;

  if (error instanceof ZodError) {
    message = error.issues.map((el) => el.message).join(", ");
    status = 400;
  }

  if (error.hasOwnProperty("status")) {
    status = (error as CustomError).status;
  }

  return Response.json(
    {
      message: message,
    },
    {
      status: status,
    }
  );
}
