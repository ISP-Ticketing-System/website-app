import CategoryModel from "@/db/models/CategoryModel";
import { customError } from "@/helpers/customError";
import { CustomError } from "@/type";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: `Invalid ID` }, { status: 400 });
    }

    let result = await CategoryModel.getCategoryById(id);

    return NextResponse.json(result);
  } catch (error) {
    return customError(error as CustomError);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: `Invalid ID` }, { status: 400 });
    }

    const body = await request.json();

    let result = await CategoryModel.update(body, id);

    return NextResponse.json(
      { message: `Successfully update Category : ${result.category}` },
      { status: 200 }
    );
  } catch (error) {
    return customError(error as CustomError);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: `Invalid ID` }, { status: 400 });
    }

    let result = await CategoryModel.delete(id);

    let text = result.isDeleted ? "delete" : "restore";

    return NextResponse.json(
      {
        message: `Successfully ${text} Category : ${result.category}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return customError(error as CustomError);
  }
}
