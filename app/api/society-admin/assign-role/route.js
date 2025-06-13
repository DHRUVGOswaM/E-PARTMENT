import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { userId, flatId, role } = body;

  const updated = await db.user.update({
    where: { clerkUserId: userId },
    data: {
      role,
    },
  });

  await db.flat.update({
    where: { id: flatId },
    data: {
      residentId: userId,
      isOccupied: true,
    },
  });

  return NextResponse.json({ success: true });
}
