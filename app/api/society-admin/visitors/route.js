// ↳  GET /api/society-admin/visitors
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    /* 1️⃣  Who’s calling?  ------------------------------------ */
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
      }
      
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });

    console.log("[Visitors API] User:", user);
    console.log("user.id:", user.id);

    /* 2️⃣  Must be a Society-Admin - fetch his/her societyId -- */
    const admin = await db.societyAdmin.findUnique({
      where: {  userId: user.id },
      select: { societyId: true },
    });
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* 3️⃣  Pull every visitor whose flat → building → society
            matches the admin’s society                              */
    const visitors = await db.visitor.findMany({
      where: {
        visitingFlat: {
          building: { societyId: admin.societyId },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        visitingFlat: {
          select: {
            flatNumber: true,
            building: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json({ visitors });
  } catch (err) {
    console.error("[Visitors API] ", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
