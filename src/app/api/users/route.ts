import UserModel from "@/db/models/UserModel";
import { customError } from "@/helpers/customError";
import { CustomError } from "@/type";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await UserModel.create(body);

    return NextResponse.json(
      { message: `Successfully create a new user: ${body.email}` },
      { status: 201 }
    );
  } catch (error) {
    return customError(error as CustomError);
  }
}

export async function GET() {
  try {
    const users = await UserModel.getAllUser();

    return NextResponse.json(users);
  } catch (error) {
    return customError(error as CustomError);
  }
}
