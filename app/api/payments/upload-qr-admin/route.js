// app/api/society-admin/payment-qr/route.js
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "401" }, { status: 401 });

    /* find the admin + his societyId */
    const admin = await db.user.findUnique({
      where: {
            clerkUserId: userId,
          role: "SUPER_ADMIN",
      },
    });
    if (!admin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { imageUrl } = await req.json();
    if (!imageUrl)
      return NextResponse.json({ error: "No image" }, { status: 400 });

    /* OPTION A — update column  */
      await db.user.update({
        where: { clerkUserId: userId },
      data: { profilePicture: imageUrl },
    });


    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "500" }, { status: 500 });
  }
}
