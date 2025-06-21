import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, fromDate, toDate, reason } = body;

    const staff = await prisma.staff.findFirst({
      where: { name },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    const newLeave = await prisma.leaveRequest.create({
      data: {
        fromDate,
        toDate,
        reason,
        staffId: staff.id,
      },
    });

    return NextResponse.json(newLeave);
  } catch (error) {
    console.error('Error submitting leave:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  const staff = await prisma.staff.findUnique({
    where: { name },
  });

  if (!staff) {
    return NextResponse.json([], { status: 200 });
  }

  const leaveHistory = await prisma.leaveRequest.findMany({
    where: { staffId: staff.id },
    orderBy: { fromDate: 'desc' },
  });

  return NextResponse.json(leaveHistory);
}
