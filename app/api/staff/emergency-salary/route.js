import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  const data = await req.json();
  const { name, reason, amount, neededBy } = data;

  const request = await prisma.emergencySalary.create({
    data: { name, reason, amount, neededBy },
  });

  return NextResponse.json(request);
}

export async function GET() {
  const requests = await prisma.emergencySalary.findMany();
  return NextResponse.json(requests);
}
