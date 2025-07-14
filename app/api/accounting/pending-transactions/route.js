// GET pending transactions
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId: clerkUserId } = await auth();

  const admin = await db.user.findUnique({
    where: { clerkUserId },
    select: { role: true },
  });

  if (admin?.role !== "SOCIETY_ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const pending = await db.transaction.findMany({
    where: {
      type: "INCOME",
      paidStatus: true,
      isApproved: false,
      recorderId: admin.id,
    },
    include: {
      recorder: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      flat: {
      select: {
        flatNumber: true,
       },
     },
   },
  });

  return NextResponse.json(pending);
}
