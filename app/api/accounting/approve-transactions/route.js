import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// POST: Approve a transaction
export async function POST(request) {
  try {
    const { userId: clerkUserId } = await auth();
    const { transactionId } = await request.json();

    if (!clerkUserId || !transactionId) {
      return NextResponse.json(
        { message: "Unauthorized or missing data" },
        { status: 400 }
      );
    }

    const admin = await db.user.findUnique({
      where: { clerkUserId },
      select: { id: true, role: true },
    });

    if (!admin || admin.role !== "SOCIETY_ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await db.transaction.update({
      where: { id: transactionId },
      data: {
        isApproved: true,
        approvedBy: admin.id,
        approvedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Payment approved", updated });
  } catch (error) {
    console.error("❌ Error approving transaction:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch approved payments (optionally filter by month & year)
export async function GET(req) {
  try {
    const { userId: clerkUserId } = await auth();
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get("year"));
    const month = parseInt(searchParams.get("month"));
    const flat = searchParams.get("flat"); // ✅ NEW

    if (!clerkUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let dateFilter = {};
    if (!isNaN(year) && !isNaN(month)) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1); // next month
      dateFilter = {
        approvedAt: {
          gte: start,
          lt: end,
        },
      };
    }

    // ✅ Optional flatNumber filter
    let flatFilter = {};
    if (flat) {
      flatFilter.flatNumber = {
        contains: flat,
        mode: "insensitive",
      };
    }

    // Base filter: approved INCOME transactions
    const baseFilter = {
      type: "INCOME",
      paidStatus: true,
      recorderId: user.id,
      isApproved: true,
      ...dateFilter,
      ...flatFilter, // ✅ Inject flat number filter if exists
    };

    // Admin sees all; others see their own
    const filter = user.role === "SOCIETY_ADMIN"
      ? baseFilter
      : { ...baseFilter, recorderId: user.id };

    const approved = await db.transaction.findMany({
      where: filter,
      orderBy: { approvedAt: "desc" },
      select: {
        id: true,
        amount: true,
        forMonth: true,
        payerName: true,
        flatNumber: true,
        approvedAt: true,
        paymentMethod: true,
        transactionId: true,
        paidStatus: true,
        isApproved: true,
      },
    });

    return NextResponse.json(approved);
  } catch (error) {
    console.error("❌ Error fetching approved transactions:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}


