import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  const data = await req.json();
  const { staffName, shiftTime, task } = data;

  const shift = await prisma.shiftTask.create({
    data: { staffName, shiftTime, task },
  });

  return NextResponse.json(shift);
}

export async function GET() {
  const shifts = await prisma.shiftTask.findMany();
  return NextResponse.json(shifts);
}
