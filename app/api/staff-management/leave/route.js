import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const leaves = await prisma.leaveRequest.findMany();
  return NextResponse.json(leaves);
}

export async function POST(req) {
  const { id, status } = await req.json();

  const updated = await prisma.leaveRequest.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}
