

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req) {
  try {
    // Enhanced auth check with debugging
    const { userId } = await auth();
   

    if (!userId) {
      console.warn("No user ID found in auth - headers:", req.headers);
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please sign in to access this resource",
        },
        { status: 401 }
      );
      }
      
      const user = await db.user.findUnique({
          where: {clerkUserId: userId},
      })

    const contacts = await db.emergencyContact.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    // Enhanced auth check with debugging
    const { userId } = await auth();
   

    if (!userId) {
      console.warn("No user ID found in auth - headers:", req.headers);
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please sign in to access this resource",
        },
        { status: 401 }
      );
      }
      
      const user = await db.user.findUnique({
          where: {clerkUserId: userId},
      })

   const { name, phoneNumber, designation } = await req.json();
    if (!name || !phoneNumber || !designation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
      }
      
      const updateContact = await db.emergencyContact.create({
          data: {
              name,
              phoneNumber,
              designation,
              email: user.email,
              userId: user.id,
              id: user.id + "-" + Date.now().toString(),
          }
      })

    return NextResponse.json(updateContact);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
