import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const { staffId, fromTime, toTime, shiftDate } = await req.json();

  const shift = await prisma.shift.create({
    data: {
      staffId,
      fromTime,
      toTime,
      shiftDate,
    },
  });

  return NextResponse.json(shift);
}

export async function GET() {
  const shifts = await prisma.shift.findMany({ include: { staff: true } });
  return NextResponse.json(shifts);
}
