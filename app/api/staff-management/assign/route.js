import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function POST(req) {
  try {
    const data = await req.json();
    const { staffName, shiftTime, task } = data;

    const newAssignment = await db.shiftTask.create({
      data: {
        staffName,
        shiftTime,
        task,
      },
    });

    return NextResponse.json({ success: true, assigned: newAssignment });
  } catch (error) {
    console.error("POST /assign error:", error);
    return NextResponse.json({ success: false, error });
  }
}

export async function GET() {
  try {
    const allAssignments = await db.shiftTask.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(allAssignments);
  } catch (error) {
    console.error("GET /assign error:", error);
    return NextResponse.json({ success: false, error });
  }
}
