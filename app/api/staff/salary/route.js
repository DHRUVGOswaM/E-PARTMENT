import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const slips = await prisma.salarySlip.findMany();
  return NextResponse.json(slips);
}
