import ServiceModel from "@/db/models/ServiceModel";
import { ServiceInput } from "@/db/schema/service_collection";
import { customError } from "@/helpers/customError";
import { CustomError } from "@/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;

    let service = await ServiceModel.getServiceById(slug);

    return NextResponse.json(service);
  } catch (error) {
    return customError(error as CustomError);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const input: ServiceInput = {
      serviceName: body.serviceName,
      monthlyPrice: body.monthlyPrice,
      // setupFee: body.setupFee,
      planDescription: body.planDescription,
      status: body.status,
    };

    let result = await ServiceModel.update(input, slug);

    return NextResponse.json(
      { message: `Successfully update service: ${result.serviceName}` },
      { status: 201 }
    );
  } catch (error) {
    return customError(error as CustomError);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;

    let result = await ServiceModel.delete(slug);

    let text = result.isDeleted ? "delete" : "restore";

    return NextResponse.json(
      {
        message: `Successfully ${text} service with service name: ${result.serviceName}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return customError(error as CustomError);
  }
}
