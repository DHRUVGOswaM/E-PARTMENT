// app/api/staff/route.js
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

// ───── Helpers ───────────────────────────────────────────────────
async function currentUser() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;
  return db.user.findUnique({ where: { clerkUserId } });
}

// ───── POST /api/staff  (create) ─────────────────────────────────
export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.role !== "SOCIETY_ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, role, salary, phoneNumber } = await req.json();
    if (!name || !role || salary === undefined || !phoneNumber)
      return NextResponse.json({ error: "Missing fields. Name, role, salary, and phone number are required." }, { status: 400 });

    // Validate phone number format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number starting with 6-9" }, { status: 400 });
    }

    const staff = await db.staff.create({
      data: {
        name,
        role,
        salary: Number(salary),
        phoneNumber,
        societyId: user.societyId,
        userId: user.id, // link creator
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (err) {
    console.error("POST /api/staff:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ───── GET /api/staff  (list by society) ────────────────────────
export async function GET() {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.role !== "SOCIETY_ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const staffList = await db.staff.findMany({
      where: { societyId: user.societyId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(staffList);
  } catch (err) {
    console.error("GET /api/staff:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
