// api/resident/feedback/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import {db} from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";
export async function POST(req) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, flat, staffName, message } = body;

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    })

    const newFeedback = await db.feedback.create({
      data: {
        userId: user.id,
        message,
      },
    });
 
    return NextResponse.json({ success: true, data: newFeedback });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
