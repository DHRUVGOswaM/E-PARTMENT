import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: "Society ID is required" }, { status: 400 });
    }

    // Fetch society information
    const society = await db.society.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        name: true,
        address: true,
        registrationNumber: true,
        createdAt: true
      }
    });

    if (!society) {
      return NextResponse.json({ error: "Society not found" }, { status: 404 });
    }

    return NextResponse.json(society);
  } catch (error) {
    console.error("Error fetching society:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
