import NewsModel from "@/db/models/NewsModel";
import UserModel from "@/db/models/UserModel";
import { NewsInput } from "@/db/schema/news_collection";
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

    let result = await NewsModel.getNewsById(id);

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

    let result = await NewsModel.update(body, id);

    return NextResponse.json(
      { message: `Successfully update news : ${result.title}` },
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

    let result = await NewsModel.delete(id);

    let text = result.isDeleted ? "delete" : "restore";

    return NextResponse.json(
      {
        message: `Successfully ${text} news : ${result.title}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return customError(error as CustomError);
  }
}
