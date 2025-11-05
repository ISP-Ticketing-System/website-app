import CustomerModel from "@/db/models/CustomerModel";
import { CustomerInput } from "@/db/schema/customer_collection";
import { customError } from "@/helpers/customError";
import { CustomError } from "@/type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const input: CustomerInput = {
      customerType: body.customerType,
      cid: body.cid,
      firstName: body.firstName,
      lastName: body.lastName ?? "",
      email: body.email ?? "",
      phoneNumber: body.phoneNumber,
      idType: body.idType,
      idNumber: body.idNumber,
      streetAddress: body.streetAddress,
      city: body.city,
      province: body.province,
      postalCode: body.province,
      country: body.country,
      serviceId: body.serviceId,
      installationDate: body.installationDate,
      contractLength: body.contractLength,
      setupFee: body.setupFee ?? 0,
      note: body.note ?? "",
      status: body.status,
    };

    if (input.customerType === "Dedicated") {
      input.companyName = body.companyName;
      input.npwp = body.npwp;
      input.vlan = body.vlan;
      input.nib = body.nib;
    } else if (input.customerType === "FTTH") {
      input.site = body.site;
      input.deviceSN = body.deviceSN;
    }

    await CustomerModel.create(input);

    return NextResponse.json(
      {
        message: `Successfully create a new customer with name: ${body.firstName}`,
      },
      { status: 201 }
    );
  } catch (error) {
    return customError(error as CustomError);
  }
}

export async function GET() {
  try {
    const customers = await CustomerModel.getAllCustomer();

    return NextResponse.json(customers);
  } catch (error) {
    return customError(error as CustomError);
  }
}
