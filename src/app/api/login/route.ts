import UserModel from "@/db/models/UserModel";
import { comparePassword } from "@/helpers/bcrypt";
import { customError } from "@/helpers/customError";
import { signToken } from "@/helpers/jwt";
import { CustomError } from "@/type";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. get input email and password
    const { email, password } = await request.json();

    // 2. find user by email
    const user = await UserModel.findByEmail(email);

    // 3. if user not found, throw error
    if (!user) {
      throw { message: "invalid email or password", status: 400 };
    }

    // 4. compare password
    const isValid = comparePassword(password, user.password);

    // 5. if password invalid, throw error
    if (!isValid) {
      throw { message: "invalid email or password", status: 400 };
    }

    // 6. create token
    const access_token = signToken({
      _id: user._id.toString(),
      email: user.email,
    });

    // 7. save data to cookies
    const cookieStore = await cookies();
    cookieStore.set("authorization", `Bearer ${access_token}`);

    return NextResponse.json(
      { message: "Successfully login", access_token },
      { status: 200 }
    );
  } catch (error) {
    return customError(error as CustomError);
  }
}
