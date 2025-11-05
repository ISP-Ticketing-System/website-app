import TicketModel from "@/db/models/TicketModel";
import { customError } from "@/helpers/customError";
import { CustomError } from "@/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const tickets = await TicketModel.getAllTicket();

    return NextResponse.json(tickets);
  } catch (error) {
    return customError(error as CustomError);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") as string;
    const body = await request.json();

    const input: any = {
      customerId: body.customerId,
      categoryId: body.categoryId,
      escalationRequired: body.escalationRequired,
      subject: body.subject,
      description: body.description,
    };

    let ticket = await TicketModel.create(input, userId);

    return NextResponse.json(
      {
        message: `Successfully create a new ticket with code: ${ticket.code}`,
      },
      { status: 201 }
    );
  } catch (error) {
    return customError(error as CustomError);
  }
}
