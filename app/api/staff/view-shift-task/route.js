// app/api/staff/view-shift-task/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';



export async function GET() {
  try {
    const data = await db.shiftTask.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /view-shift-task error:", error);
    return NextResponse.json({ error: "Failed to fetch shift/task data" }, { status: 500 });
  }
}
