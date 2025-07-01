// app/api/payments/qr/route.js
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "401" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { societyId: true },
  });
  if (!user?.societyId)
    return NextResponse.json(
      { error: "Join a society first" },
      { status: 400 }
    );

  /* Option A */
  const qrImageUrl = await db.society
    .findUnique({ where: { id: user.societyId } })
    .then((s) => s?.qrImageUrl);

  /* Option B */
  // const qrImageUrl = await db.societyQR
  //   .findUnique({ where:{ societyId:user.societyId } })
  //   .then(q => q?.imageUrl);

  return NextResponse.json({ qrImageUrl });
}
