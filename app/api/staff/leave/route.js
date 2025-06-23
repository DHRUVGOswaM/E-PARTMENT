import { db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId } = await auth()
    const body = await req.json();
    const { name, fromDate, toDate, reason } = body;

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    const staff = await db.staff.findFirst({
      where: {userId: user.id}
    })

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    const newLeave = await db.leaveRequest.create({
      data: {
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        reason,
        leaveType: 'Sick Leave', // Defaulting to Sick Leave
        staffId: staff.id,
        totalDays: Math.ceil(
          (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
        ),
      },
    });

    return NextResponse.json(newLeave);
  } catch (error) {
    console.error('Error submitting leave:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function GET() {

  const { userId } = await auth();

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  const staff = await db.staff.findFirst({
    where: { userId: user.id },
  });

  if (!staff) {
    return NextResponse.json([], { status: 200 });
  }

  const leaveHistory = await db.leaveRequest.findMany({
    where: { staffId: staff.id },
    orderBy: { fromDate: 'desc' },
  });

  return NextResponse.json(leaveHistory);
}
