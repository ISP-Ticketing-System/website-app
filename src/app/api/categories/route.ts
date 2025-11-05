import CategoryModel from "@/db/models/CategoryModel";
import { CategoryInput } from "@/db/schema/category_collection";
import { customError } from "@/helpers/customError";
import { CustomError } from "@/type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const input: CategoryInput = {
    category: body.category,
    times: body.times,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  await CategoryModel.create(input);

  return NextResponse.json(
    { message: `Successfully create a new category for: ${input.category}` },
    { status: 201 }
  );
}

export async function GET() {
  try {
    const categories = await CategoryModel.getAllCategory();

    return NextResponse.json(categories);
  } catch (error) {
    return customError(error as CustomError);
  }
}
