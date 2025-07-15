// app/api/accounting/transactions/route.js

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

async function getPrismaUserId(clerkUserId, userEmail) {
  try {
    console.log("🔍 getPrismaUserId: Checking for existing Prisma user...");
    let user = await db.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!user) {
      console.warn(
        `⚠️ No Prisma User found for Clerk ID: ${clerkUserId}. Creating new user...`
      );
      try {
        user = await db.user.create({
          data: {
            clerkUserId,
            email: userEmail || `${clerkUserId}@example.com`,
          },
        });
        console.log(`✅ Created new Prisma User with ID: ${user.id}`);
      } catch (userCreateError) {
        console.error("❌ Failed to create new Prisma User:", userCreateError);
        return null;
      }
    }

    return user.id;
  } catch (error) {
    console.error("❌ Failed to find or create Prisma User:", error);
    return null;
  }
}

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();
    console.log("📥 GET Request - Clerk user ID:", clerkUserId);

    if (!clerkUserId) {
      return NextResponse.json(
        { message: "Unauthorized: No Clerk user ID found." },
        { status: 401 }
      );
    }

    const prismaUser = await db.user.findUnique({
      where: { clerkUserId },
    });

    if (!prismaUser) {
      console.warn(`⚠️ No Prisma user found for Clerk ID: ${clerkUserId}`);
      return NextResponse.json([], { status: 200 });
    }

    console.log(`✅ Fetched Prisma user ID: ${prismaUser.id}`);

    const transactions = await db.transaction.findMany({
      where: { recorderId: prismaUser.id },
      orderBy: { transactionDate: "desc" },
    });

    console.log(`📊 Fetched ${transactions.length} transactions.`);
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch transactions:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId: clerkUserId } = await auth();
    console.log("📥 POST Request - Clerk user ID:", clerkUserId);

    if (!clerkUserId) {
      return NextResponse.json(
        { message: "Unauthorized: No Clerk user ID found." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userEmail = body.email;
    console.log("📨 POST Request - Received body:", body);

    const prismaUserId = await getPrismaUserId(clerkUserId, userEmail);
    const prismaUser = await db.user.findUnique({
  where: { id: prismaUserId },
  select: { role: true }
});

 const isAdmin = prismaUser?.role === "SOCIETY_ADMIN";

    if (!prismaUserId) {
      return NextResponse.json(
        { message: "Failed to link user, cannot add transaction." },
        { status: 500 }
      );
    }

    const {
      amount,
      type,
      category,
      description,
      transactionDate,
      paymentMethod,
      payerName,
      flatNumber,
      forMonth,
      paidStatus,

      // ✅ New optional fields
      bankName,
      ifscCode,
      transactionId,
      upiId,
      chequeNumber
    } = body;

const paymentMethodMap = {
  "Cash": "CASH",
  "UPI": "UPI",
  "Bank Transfer": "BANK_TRANSFER",
  "Cheque": "CHEQUE"
};

const mappedPaymentMethod = paymentMethodMap[paymentMethod] || null;

    // Validation
    if (!amount || !type || !["INCOME", "EXPENSE"].includes(type)) {
      return NextResponse.json(
        { message: "Amount and valid Type (INCOME/EXPENSE) are required." },
        { status: 400 }
      );
    }

    if (!transactionDate) {
      return NextResponse.json(
        { message: "Transaction Date is required." },
        { status: 400 }
      );
    }

    const newTransaction = await db.transaction.create({
  data: {
    amount: parseFloat(amount),
    type,
    category: category || null,
    description: description || null,
    transactionDate: new Date(transactionDate),
    paymentMethod: mappedPaymentMethod,
    payerName: payerName || null,
    flatNumber: flatNumber || null,
    forMonth: forMonth || null,
    isApproved: isAdmin ? true : false,
    approvedAt: isAdmin ? new Date() : null,
    approvedBy: isAdmin ? prismaUserId : null,
    paidStatus: paidStatus ?? true,
    bankName: bankName || null,
    ifscCode: ifscCode || null,
    transactionId: transactionId || null,
    upiId: upiId || null,
    chequeNumber: chequeNumber || null,
    recorderId: prismaUserId,
  },
});


    console.log("✅ Transaction created successfully:", newTransaction);
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to add transaction:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

