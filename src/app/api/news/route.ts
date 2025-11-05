import NewsModel from "@/db/models/NewsModel";
import UserModel from "@/db/models/UserModel";
import { NewsInput } from "@/db/schema/news_collection";
import { customError } from "@/helpers/customError";
import { CustomError } from "@/type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = request.headers.get("x-user-email") as string;

  const findAuthor = await UserModel.findByEmail(email);

  if (!findAuthor) {
    throw { message: "Author not found", status: 404 };
  }

  const input: NewsInput = {
    title: body.title,
    content: body.content,
    author: `${findAuthor.username} (${findAuthor.role})`,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  await NewsModel.create(input);

  return NextResponse.json(
    { message: `Successfully create a new news for: ${input.title}` },
    { status: 201 }
  );
}

export async function GET() {
  try {
    const categories = await NewsModel.getAllNews();

    return NextResponse.json(categories);
  } catch (error) {
    return customError(error as CustomError);
  }
}
