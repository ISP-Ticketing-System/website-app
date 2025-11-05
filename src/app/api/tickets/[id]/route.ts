import TicketModel from "@/db/models/TicketModel";
import { TicketInput } from "@/db/schema/ticket_collection";
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

    let service = await TicketModel.getTicketById(id);

    return NextResponse.json(service);
  } catch (error) {
    return customError(error as CustomError);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // try {
  //   const { id } = await params;
  //   let result = await TicketModel.delete(id);
  //   let text = result.isDeleted ? "delete" : "restore";
  //   return NextResponse.json(
  //     {
  //       message: `Successfully ${text} ticket with code: ${result.code}`,
  //     },
  //     { status: 200 }
  //   );
  // } catch (error) {
  //   return customError(error as CustomError);
  // }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get("x-user-id") as string;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: `Invalid ID` }, { status: 400 });
    }

    const body = await request.json();
    let ticket = await TicketModel.updateStatus(body, id, userId);

    return NextResponse.json(
      {
        message: `Successfully update status ticket with code: ${ticket.code}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return customError(error as CustomError);
  }
}
