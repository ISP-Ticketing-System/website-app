import SLAModel from "@/db/models/SLAModel";
import { SLAInput, SLASchema } from "@/db/schema/sla_collection";
import { customError } from "@/helpers/customError";
import { CustomError } from "@/type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const input: SLAInput = {
    role: body.role,
    times: body.times,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  await SLAModel.create(input);

  return NextResponse.json(
    { message: `Successfully create a new sla for: ${input.role}` },
    { status: 201 }
  );
}

export async function GET() {
  try {
    const services = await SLAModel.getAllSLA();

    return NextResponse.json(services);
  } catch (error) {
    return customError(error as CustomError);
  }
}
