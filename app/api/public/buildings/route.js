import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const societyId = searchParams.get("societyId");

    if (!societyId) {
      return new NextResponse("Society ID is required", { status: 400 });
    }

    const buildings = await db.building.findMany({
      where: { societyId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
      
      return NextResponse.json({buildings})
  } catch (error) {
    console.error("Error fetching societies:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
