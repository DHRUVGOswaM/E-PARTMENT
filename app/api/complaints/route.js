// app/api/complaints/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description } = await req.json();

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { society: { include: { users: true } } },
    });

    if (!user || !user.society) throw new Error("User or society not found");

    // Find society secretary
    const secretary = user.society.users.find(
      (u) => u.role === "SOCIETY_ADMIN"
    );

    if (!secretary) throw new Error("No society secretary found");

    const complaint = await db.complaint.create({
      data: {
        title,
        description,
        userId: user.id,
      },
    });

    // [Optional] Notify secretary (e.g., create a notification, email, etc.)

    return NextResponse.json({ complaint });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to file complaint" },
      { status: 500 }
    );
  }
}
