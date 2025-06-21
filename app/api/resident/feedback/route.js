// api/resident/feedback/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import {db} from "@/lib/prisma"
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, flat, staffName, message } = body;

    const newFeedback = await db.feedback.create({
      data: {
        name,
        flat,
        staffName,
        message,
      },
    });

    return NextResponse.json({ success: true, data: newFeedback });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
