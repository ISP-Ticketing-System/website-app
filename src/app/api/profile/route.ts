import UserModel from "@/db/models/UserModel";
import { customError } from "@/helpers/customError";
import { CustomError } from "@/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const email = request.headers.get("x-user-email") as string;

    let profile = await UserModel.findByEmail(email);

    return NextResponse.json(profile);
  } catch (error) {
    return customError(error as CustomError);
  }
}
