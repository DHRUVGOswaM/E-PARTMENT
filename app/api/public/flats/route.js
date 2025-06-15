import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const buildingId = searchParams.get("buildingId");

    if (!buildingId) {
      return new NextResponse("Building ID is required" , { status: 400 });
    }

    const flats = await db.flat.findMany({
      where: { buildingId },
      select: { id: true, flatNumber: true },
      orderBy: { flatNumber: "asc" },
    });
      
      return NextResponse.json({flats})
  } catch (error) {
    console.error("Error fetching societies:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
