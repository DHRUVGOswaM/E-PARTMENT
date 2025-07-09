// /app/api/secretary/complaints/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  const secretary = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { society: true },
  });

  if (!secretary || secretary.role !== "SOCIETY_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const complaints = await db.complaint.findMany({
    where: {
      user: {
        societyId: secretary.societyId,
      },
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(complaints);
}
