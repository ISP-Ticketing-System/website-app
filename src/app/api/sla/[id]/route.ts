import SLAModel from "@/db/models/SLAModel";
import { customError } from "@/helpers/customError";
import { CustomError } from "@/type";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

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

    let result = await SLAModel.update(body, id);

    return NextResponse.json(
      { message: `Successfully update SLA with role: ${result.role}` },
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

    let result = await SLAModel.delete(id);

    let text = result.isDeleted ? "delete" : "restore";

    return NextResponse.json(
      {
        message: `Successfully ${text} SLA with role: ${result.role}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return customError(error as CustomError);
  }
}
