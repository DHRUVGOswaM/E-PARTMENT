import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  const admin = await db.user.findUnique({
    where: {
      clerkUserId: userId,
     },
  });

  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const users = await db.user.findMany({
    where: { societyId: admin.societyId },
  });

  const flats = await db.flat.findMany({
    where: { building: { societyId: admin.societyId } },
    include: { building: true },
  });

  return NextResponse.json({ users, flats });
}
