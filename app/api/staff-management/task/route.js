import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const { staffId, taskDescription, dueDate } = await req.json();

  const task = await prisma.task.create({
    data: {
      staffId,
      taskDescription,
      dueDate,
    },
  });

  return NextResponse.json(task);
}

export async function GET() {
  const tasks = await prisma.task.findMany({ include: { staff: true } });
  return NextResponse.json(tasks);
}
