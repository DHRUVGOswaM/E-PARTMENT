import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const loggedInUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!loggedInUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await req.json();

    const existing = await db.pendingAdmin.findFirst({
      where: { email: loggedInUser.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Admin request already exists." },
        { status: 400 }
      );
    }

    const pendingAdmin = await db.pendingAdmin.create({
      data: {
        name: loggedInUser.firstName + " " + loggedInUser.lastName,
        email: loggedInUser.email,
        phoneNumber: loggedInUser.phoneNumber || body.phoneNumber,
        address: body.address,
        registrationNumber: body.registrationNumber,
        apartmentName: body.apartmentName,
        totalFlats: parseInt(body.totalFlats),
        status: "PENDING",
        //quotedAmount: 0, // Default value
        //appliedByUserId: loggedInUser.id, // Link to the user who applied
      },
    });

    return NextResponse.json({
      message: "Callback request created successfully.",
      pendingAdmin,
    });
  } catch (error) {
    console.log("Error creating pending admin request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
