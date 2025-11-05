import ServiceModel from "@/db/models/ServiceModel";
import { ServiceInput } from "@/db/schema/service_collection";
import { customError } from "@/helpers/customError";
import { CustomError } from "@/type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const input: ServiceInput = {
      serviceName: body.serviceName,
      monthlyPrice: body.monthlyPrice,
      // setupFee: body.setupFee,
      planDescription: body.planDescription,
      status: body.status,
    };

    await ServiceModel.create(input);

    return NextResponse.json(
      { message: `Successfully create a new service: ${input.serviceName}` },
      { status: 201 }
    );
  } catch (error) {
    return customError(error as CustomError);
  }
}

export async function GET() {
  try {
    const services = await ServiceModel.getAllService();

    return NextResponse.json(services);
  } catch (error) {
    return customError(error as CustomError);
  }
}
