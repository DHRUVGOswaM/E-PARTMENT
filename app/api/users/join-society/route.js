import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauth", { status: 401 });

    const me = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!me) return new NextResponse("User not found", { status: 404 });

    const { societyId, role, phoneNumber, buildingId, flatId } =
      await req.json();

    // one open request only
    const exist = await db.pendingAccess.findUnique({
      where: { userId: me.id },
    });
    if (exist)
      return NextResponse.json(
        { error: "Request already pending" },
        { status: 400 }
      );

    await db.pendingAccess.create({
      data: {
        userId: me.id,
        societyId,
        requestedRole: role,
        phoneNumber,
        buildingId: buildingId || null,
        flatId: flatId || null,
      },
    });

    return NextResponse.json({ message: "OK" });
  } catch (e) {
    console.error("join-society:", e);
    return new NextResponse("Server error", { status: 500 });
  }
}
