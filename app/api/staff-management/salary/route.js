import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const data = await req.formData();
  const staffId = data.get("staffId");
  const slip = data.get("slip"); // file
  const status = data.get("status");
  const issuedDate = data.get("issuedDate");

  const saved = await prisma.salarySlip.create({
    data: {
      staffId,
      slip: slip.name || "",
      status,
      issuedDate,
    },
  });

  return NextResponse.json(saved);
}

export async function GET() {
  const slips = await prisma.salarySlip.findMany({ include: { staff: true } });
  return NextResponse.json(slips);
}
