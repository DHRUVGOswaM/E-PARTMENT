import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clerkUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (
      !clerkUser ||
      !["SOCIETY_ADMIN", "SUPER_ADMIN"].includes(clerkUser.role)
    ) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const body = await req.json();
    const { staff_id, amount, status, payDate, notes } = body;

    const created = await db.salary.create({
      data: {
        id: crypto.randomUUID(),
        staff_id,
        amount,
        status,
        payDate: new Date(payDate),
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error("Salary upload error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const salaries = await db.salary.findMany({
    where: {
      Staff: {
        societyId: user.societyId,
      },
    },
    include: {
      Staff: true,
    },
  });

  return NextResponse.json(salaries);
}
