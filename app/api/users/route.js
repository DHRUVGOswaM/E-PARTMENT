
// app/api/users/route.js
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkUserFromRequest } from "@/lib/checkUser";

// GET - Get current user details
export async function GET(req) {
  
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await checkUserFromRequest(req);
    if(!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Create or update a user profile
export async function POST(req) {
  try {
    const { userId: clerkUserId } =  await auth();

    if (!clerkUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const existingUser = await db.user.findUnique({ where: { clerkUserId } });

    const user = existingUser
      ? await db.user.update({ where: { clerkUserId }, data: body })
      : await db.user.create({ data: { ...body, clerkUserId } });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH - Admin updates a user's role
export async function PATCH(req) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await db.user.findUnique({ where: { clerkUserId } });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { targetClerkUserId, newRole } = await req.json();

    const updatedUser = await db.user.update({
      where: { clerkUserId: targetClerkUserId },
      data: { role: newRole },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
