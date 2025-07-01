// app/api/staff-management/staff/route.js
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// check current user & role helper
async function currentUser() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;
  return db.user.findUnique({ where: { clerkUserId } });
}

// ───────────────────────────────────────────────────────── GET
// list all staff in the caller's society
export async function GET() {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["SOCIETY_ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // include latest salary status
    const staff = await db.staff.findMany({
      where: { societyId: user.societyId },
      include: {
        Salary: {
          orderBy: { payDate: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(staff);
  } catch (err) {
    console.error("GET staff error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ───────────────────────────────────────────────────────── DELETE
// delete a single staff => ?id=<staffId>
export async function DELETE(req) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["SOCIETY_ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const staffId = req.nextUrl.searchParams.get("id");
    if (!staffId) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // ensure staff belongs to same society
    const staff = await db.staff.findUnique({ where: { id: staffId } });
    if (!staff || staff.societyId !== user.societyId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.staff.delete({ where: { id: staffId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE staff error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
