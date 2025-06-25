// File: /app/api/staff/salary/route.js (STAFF VIEW API)
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");

    if (!staffId) {
      return NextResponse.json({ success: false, error: "Missing staffId" });
    }

    const slips = await prisma.salarySlip.findMany({
      where: { staffId },
      orderBy: { paymentDate: "desc" },
    });

    return NextResponse.json({ success: true, slips });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
