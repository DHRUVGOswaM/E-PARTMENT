// app/api/attendance/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import {db} from "@/lib/prisma"
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, entryTime, exitTime, date } = body;

    const result = await db.attendance.create({
      data: {
        name,
        entryTime,
        exitTime,
        date,
      },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    const records = await prisma.attendance.findMany({
      where: { name },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}
